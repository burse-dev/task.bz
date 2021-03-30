import express from 'express';
import { Op } from 'sequelize';
import passport from 'passport';
import Tasks from '../../models/tasks';
import UserTasks from '../../models/userTasks';
import { save, update, remove, checkTaskAvailability } from '../controllers/tasks';
import {
  IN_WORK_TASK_STATUS_ID,
} from '../../../src/constant/taskStatus';
import {
  IN_WORK_STATUS_ID,
  PENDING_STATUS_ID,
  REJECTED_STATUS_ID,
  OVERDUE_STATUS_ID,
  REWORK_STATUS_ID,
  SUCCESS_STATUS_ID,
} from '../../../src/constant/taskExecutionStatus';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  req.id = id;
  return next();
});

router.get('/feedTasks', async (req, res, next) => {
  try {
    const sqlQuery = `SELECT "tasks"."id", "tasks"."title", "tasks"."category", "tasks"."status", "tasks"."price", "tasks"."description", "tasks"."executionType",
                  COUNT("userTasks"."taskId"),
                  COUNT("userTasksDone"."taskId") as "doneCount",
                  COUNT("userTasksRejected"."taskId") as "rejectedCount"
                FROM "tasks"
                LEFT OUTER JOIN "userTasks" ON "tasks"."id" = "userTasks"."taskId" 
                    AND "userTasks"."status" IN (${IN_WORK_STATUS_ID}, ${PENDING_STATUS_ID}, ${REWORK_STATUS_ID}, ${SUCCESS_STATUS_ID})
                LEFT JOIN "userTasks" as "userTasksDone" ON "tasks"."id" = "userTasksDone"."taskId" AND "userTasksDone"."status" = ${SUCCESS_STATUS_ID}
                LEFT JOIN "userTasks" as "userTasksRejected" ON "tasks"."id" = "userTasksRejected"."taskId" AND "userTasksRejected"."status" = ${REJECTED_STATUS_ID}
                WHERE (("tasks"."startTime" <= NOW() AND "tasks"."endTime" >= NOW()) OR "tasks"."endTime" IS NULL)
                AND "tasks"."status" = 1
                GROUP BY "tasks"."id"
                HAVING (COUNT("userTasks"."taskId") < "tasks"."limitTotal" OR "tasks"."limitTotal" IS NULL)
                ORDER BY "tasks"."createdAt" DESC`;

    const tasks = await Tasks.sequelize.query(sqlQuery, {
      model: Tasks,
      mapToModel: true,
    });

    res.json({
      count: tasks.length,
      tasks,
    });
  } catch (e) {
    next(e);
  }
});

router.get('/tasks', async (req, res, next) => {
  try {
    const statusId = req.query.status;
    Tasks.findAndCountAll({
      where: {
        ...(statusId && { status: statusId }),
      },
      attributes: [
        'id',
        'title',
        'category',
        'status',
        'price',
        'limitTotal',
        'executionType',
      ],
      include: [{
        model: UserTasks,
        attributes: [
          'status',
        ],
      }],
      order: [
        ['createdAt', 'DESC'],
      ],
    })
      .then((result) => {
        res.json({
          count: result.count,
          tasks: result.rows,
        });
      });
  } catch (e) {
    next(e);
  }
});

router.get('/tasks/:id', async (req, res, next) => {
  try {
    Tasks.findOne({
      where: {
        id: req.id,
      },
    })
      .then((result) => {
        res.json(result);
      });
  } catch (e) {
    next(e);
  }
});

router.post('/tasks/save', passport.authenticate('jwt', { session: false }), save);

router.put('/tasks/save', passport.authenticate('jwt', { session: false }), update);

router.delete('/tasks/delete/:id', passport.authenticate('jwt', { session: false }), remove);

router.get('/task/updateStatus', async (req, res, next) => {
  try {
    // // завершить задачи "в работе"
    // await Tasks.update({
    //   status: FINISHED_TASK_STATUS_ID,
    // }, {
    //   where: {
    //     [Op.and]: {
    //       status: IN_WORK_TASK_STATUS_ID,
    //       endTime: {
    //         [Op.and]: {
    //           [Op.lte]: new Date(),
    //           [Op.ne]: null,
    //         },
    //       },
    //     },
    //   },
    // });
    //
    // // завершить задачи если выполнили достаточное количество
    // const tasks = await Tasks.findAll(
    //   {
    //     attributes: [
    //       'id',
    //       [sequelize.fn('count', sequelize.col('userTasks.id')), 'user_tasks_count'],
    //     ],
    //     include: [
    //       {
    //         model: UserTasks,
    //         attributes: [],
    //       },
    //     ],
    //     group: ['task.id'],
    //     where: {
    //       status: IN_WORK_TASK_STATUS_ID,
    //     },
    //   },
    // );
    //
    // const promises = tasks.map(async (task) => {
    //   if (task.user_tasks_count >= task.limitTotal) {
    //     await Tasks.update({
    //       status: FINISHED_TASK_STATUS_ID,
    //     }, {
    //       where: {
    //         id: task.id,
    //       },
    //     });
    //   }
    // });
    //
    // await Promise.all(promises);

    // завершить задачи, которые не смогли выполнить в лимит времени
    const userTasks = await UserTasks.findAll(
      {
        include: [
          {
            model: Tasks,
            where: {
              status: IN_WORK_TASK_STATUS_ID,
              executionTimeLimit: {
                [Op.ne]: null,
              },
            },
          },
        ],
        where: {
          status: IN_WORK_STATUS_ID,
        },
      },
    );

    const hour = 60 * 60 * 1000;
    const now = new Date();

    userTasks.forEach((userTask) => {
      now.setTime(now.getTime() - hour * userTask.task.executionTimeLimit);
      if (userTask.createdAt < now) {
        UserTasks.update({
          status: OVERDUE_STATUS_ID,
        }, {
          where: {
            id: userTask.id,
          },
        });
      }
    });

    res.json(true);
  } catch (e) {
    next(e);
  }
});

router.post('/task/checkTaskAvailability', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const User = req.user;
  const { taskId } = req.body;

  const result = await checkTaskAvailability(taskId, User.id);

  return res.json(result);
});

export default router;

import express from 'express';
import { Op } from 'sequelize';
import passport from 'passport';
import Tasks from '../../models/tasks';
import UserTasks from '../../models/userTasks';
import { save, update, remove, checkTaskAvailability, setPriority, addPack, deleteFromPack } from '../controllers/tasks';
import {
  IN_WORK_TASK_STATUS_ID,
} from '../../../src/constant/taskStatus';
import {
  ONE_TIME_TYPE_ID,
  REPEATED_TYPE_ID,
} from '../../../src/constant/taskExecutionType';
import {
  IN_WORK_STATUS_ID,
  PENDING_STATUS_ID,
  REJECTED_STATUS_ID,
  OVERDUE_STATUS_ID,
  REWORK_STATUS_ID,
  SUCCESS_STATUS_ID,
} from '../../../src/constant/taskExecutionStatus';
import TaskPacks from '../../models/taskPack';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  req.id = id;
  return next();
});

router.get('/feedTasks', async (req, res, next) => {
  try {
    const { filter } = req.query;

    let executionTypeFilter = '';
    if (filter === 'one-time') {
      executionTypeFilter = `AND "tasks"."executionType" = ${ONE_TIME_TYPE_ID}`;
    }
    if (filter === 'repeated') {
      executionTypeFilter = `AND "tasks"."executionType" = ${REPEATED_TYPE_ID}`;
    }

    let order = '"tasks"."createdAt" DESC';
    if (filter === 'increase') {
      order = '"tasks"."price" ASC';
    }
    if (filter === 'decrease') {
      order = '"tasks"."price" DESC';
    }

    const sqlQuery = `
      SELECT "tasks"."id", "tasks"."title", "tasks"."category", "tasks"."status", "tasks"."price",
      "tasks"."description", "tasks"."executionType", "tasks"."inPriority", "tasks"."taskPackId",
      "tasks"."doneCount", "tasks"."rejectedCount"
      FROM "tasks"
      WHERE (("tasks"."startTime" <= NOW() AND "tasks"."endTime" >= NOW()) OR "tasks"."endTime" IS NULL) AND "tasks"."taskPackId" is NULL ${executionTypeFilter} 
      AND "tasks"."status" = ${IN_WORK_TASK_STATUS_ID}        
      ORDER BY "tasks"."inPriority" DESC, ${order}
    `;

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

router.get('/feedPackTasks', async (req, res, next) => {
  try {
    const { filter } = req.query;

    const packs = await TaskPacks.findAll({
      attributes: [
        'id',
        'title',
        'bonusPercentage',
      ],
      include: [{
        model: Tasks,
        attributes: [
          'id',
          'title',
          'price',
        ],
        required: true,
      }],
      order: [
        ['createdAt', 'DESC'],
        ['tasks', 'createdAt', 'ASC'],
      ],
    });

    let result = packs.map(({ tasks, bonusPercentage, title }) => {
      const tasksPriceSum = tasks.reduce(
        (accumulator, current) => accumulator + current.price,
        0,
      );

      const totalPrice = tasksPriceSum + Math.round(tasksPriceSum * bonusPercentage / 100);

      return {
        title,
        bonusPercentage,
        totalPrice,
        tasks,
      };
    });

    if (filter === 'increase') {
      result = result.sort((a, b) => a.totalPrice - b.totalPrice);
    }
    if (filter === 'decrease') {
      result = result.sort((a, b) => b.totalPrice - a.totalPrice);
    }

    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/tasks', async (req, res, next) => {
  try {
    const statusId = req.query.status;
    const result = await Tasks.findAndCountAll({
      where: {
        ...(statusId && { status: statusId }),
      },
      attributes: [
        'id',
        'title',
        'category',
        'status',
        'price',
        'inPriority',
        'taskPackId',
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
    });

    res.json({
      count: result.count,
      tasks: result.rows,
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

    const minute = 60 * 1000;
    const now = new Date();

    userTasks.forEach((userTask) => {
      now.setTime(now.getTime() - minute * userTask.task.executionTimeLimit);
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

router.get('/task/updateCounters', async (req, res, next) => {
  try {
    const sqlQuery = `SELECT "tasks"."id",
                COUNT(DISTINCT "userTasks"."id"),
                COUNT(DISTINCT  "userTasksDone"."id") as "doneCount",
                COUNT(DISTINCT "userTasksRejected"."id") as "rejectedCount"
                FROM "tasks"
                LEFT OUTER JOIN "userTasks" ON "tasks"."id" = "userTasks"."taskId" 
                    AND "userTasks"."status" IN (${IN_WORK_STATUS_ID}, ${PENDING_STATUS_ID}, ${REWORK_STATUS_ID}, ${REJECTED_STATUS_ID}, ${SUCCESS_STATUS_ID})
                LEFT JOIN "userTasks" as "userTasksDone" ON "tasks"."id" = "userTasksDone"."taskId" AND "userTasksDone"."status" = ${SUCCESS_STATUS_ID}
                LEFT JOIN "userTasks" as "userTasksRejected" ON "tasks"."id" = "userTasksRejected"."taskId" AND "userTasksRejected"."status" = ${REJECTED_STATUS_ID}
                WHERE (("tasks"."startTime" <= NOW() AND "tasks"."endTime" >= NOW()) OR "tasks"."endTime" IS NULL) AND "tasks"."taskPackId" is NULL 
                AND "tasks"."status" = 1
                GROUP BY "tasks"."id"
                HAVING (COUNT("userTasks"."taskId") < "tasks"."limitTotal" OR "tasks"."limitTotal" IS NULL)`;

    const tasks = await Tasks.sequelize.query(sqlQuery, {
      model: Tasks,
      mapToModel: true,
    });

    if (tasks.length) {
      tasks.map(({ doneCount, rejectedCount, id }) => Tasks.update({
        doneCount,
        rejectedCount,
      },
      {
        where: {
          id,
        },
      }));
    }

    res.json(true);
  } catch (e) {
    next(e);
  }
});

router.get('/tasks/setPriority/:id', passport.authenticate('jwt', { session: false }), setPriority);

router.post('/tasks/addPack', passport.authenticate('jwt', { session: false }), addPack);

router.delete('/tasks/deleteFromPack/:id', passport.authenticate('jwt', { session: false }), deleteFromPack);

router.post('/task/checkTaskAvailability', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const User = req.user;
  const { taskId } = req.body;

  const result = await checkTaskAvailability(taskId, User.id);

  return res.json(result);
});

export default router;

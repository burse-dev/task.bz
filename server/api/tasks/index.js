import express from 'express';
import moment from 'moment';
import sequelize, { Op } from 'sequelize';
import passport from 'passport';
import Tasks from '../../models/tasks';
import UserTasks from '../../models/userTasks';
import { save, update, remove } from '../controllers/tasks';
import {
  IN_WORK_TASK_STATUS_ID,
  FINISHED_TASK_STATUS_ID,
} from '../../../src/constant/taskStatus';
import { ONE_TIME_TYPE_ID, REPEATED_TYPE_ID } from '../../../src/constant/taskExecutionType';
import {
  AFTER_CHECKING_TASK_EXECUTION_INTERVAL_TYPE_ID,
  EXECUTION_INTERVALS_VALUES_IN_HOURS,
} from '../../../src/constant/taskExecutionIntervalType';
import { SUCCESS_STATUS_ID } from '../../../src/constant/taskExecutionStatus';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  req.id = id;
  return next();
});

router.get('/feedTasks', async (req, res, next) => {
  try {
    Tasks.findAndCountAll({
      where: {
        [Op.and]: {
          startTime: {
            [Op.or]: {
              [Op.lte]: new Date(),
              [Op.eq]: null,
            },
          },
          endTime: {
            [Op.or]: {
              [Op.gte]: new Date(),
              [Op.eq]: null,
            },
          },
          status: IN_WORK_TASK_STATUS_ID,
        },
      },
      attributes: [
        'id',
        'title',
        'category',
        'status',
        'price',
        'description',
        'executionType',
      ],
      order: [
        ['createdAt', 'DESC'],
      ],
    }).then((result) => {
      res.json({
        count: result.count,
        tasks: result.rows,
      });
    });
  } catch (e) {
    next(e);
  }
});

router.get('/tasks', async (req, res, next) => {
  try {
    Tasks.findAndCountAll({
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
    }).then((result) => {
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
    }).then((result) => {
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
    // завершить задачи "в работе"
    await Tasks.update({
      status: FINISHED_TASK_STATUS_ID,
    }, {
      where: {
        [Op.and]: {
          status: IN_WORK_TASK_STATUS_ID,
          endTime: {
            [Op.and]: {
              [Op.lte]: new Date(),
              [Op.ne]: null,
            },
          },
        },
      },
    });

    // завершить задачи если выполнили достаточное количество
    const tasks = await Tasks.findAll(
      {
        attributes: [
          'id',
          [sequelize.fn('count', sequelize.col('userTasks.id')), 'user_tasks_count'],
        ],
        include: [
          {
            model: UserTasks,
            attributes: [],
          },
        ],
        group: ['task.id'],
        where: {
          status: IN_WORK_TASK_STATUS_ID,
        },
      },
    );

    const promises = tasks.map(async (task) => {
      if (task.user_tasks_count >= task.limitTotal) {
        await Tasks.update({
          status: FINISHED_TASK_STATUS_ID,
        }, {
          where: {
            id: task.id,
          },
        });
      }
    });

    await Promise.all(promises);

    res.json(true);
  } catch (e) {
    next(e);
  }
});

router.post('/task/checkTaskAvailability', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const User = req.user;
  const { taskId } = req.body;

  const Task = await Tasks.findOne({
    where: {
      id: taskId,
    },
  });

  if (!Task || Task.status !== IN_WORK_TASK_STATUS_ID) {
    return res.json({
      availability: false,
      reason: 'no_task',
    });
  }

  const UserTask = await UserTasks.findOne({
    where: {
      taskId,
      userId: User.id,
    },
    order: [
      ['id', 'DESC'],
    ],
  });

  // если отклика еще не было
  if (!UserTask) {
    return res.json({
      availability: true,
    });
  }

  // если отклик на задачу уже был и задача одноразовая
  if (UserTask && Task.executionType === ONE_TIME_TYPE_ID) {
    return res.json({
      availability: false,
      reason: 'one_time',
    });
  }

  if (Task.executionType === REPEATED_TYPE_ID) {
    // если многоразовое выполнение + предыдущее задание принято
    if (
      Task.executionInterval === AFTER_CHECKING_TASK_EXECUTION_INTERVAL_TYPE_ID
      && UserTask.status === SUCCESS_STATUS_ID
    ) {
      return res.json({
        availability: true,
      });
    }

    if (UserTask.readyDate) {
      // если многоразовое выполнение + отчет отправлен + прошел интервал полсе пред. отчета
      const hours = EXECUTION_INTERVALS_VALUES_IN_HOURS[Task.executionInterval];
      const dateInterval = moment(UserTask.readyDate).add(hours, 'hours').toDate();

      if (
        Task.executionInterval > AFTER_CHECKING_TASK_EXECUTION_INTERVAL_TYPE_ID
        && (new Date() > dateInterval)
      ) {
        return res.json({
          availability: true,
        });
      }
    }

    return res.json({
      availability: false,
      reason: 'interval',
    });
  }

  return res.json({
    availability: false,
    reason: 'default',
  });
});

export default router;

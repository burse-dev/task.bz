import express from 'express';
import sequelize, { Op } from 'sequelize';
import passport from 'passport';
import Tasks from '../../models/tasks';
import UserTasks from '../../models/userTasks';
import { save, update, remove, checkTaskAvailability } from '../controllers/tasks';
import {
  IN_WORK_TASK_STATUS_ID,
  FINISHED_TASK_STATUS_ID,
} from '../../../src/constant/taskStatus';
import {
  IN_WORK_STATUS_ID,
  PENDING_STATUS_ID,
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
        sequelize.fn('COUNT', sequelize.col('userTasks.taskId')),
      ],
      include: [{
        model: UserTasks,
        attributes: [],
        where: {
          status: [IN_WORK_STATUS_ID, PENDING_STATUS_ID, REWORK_STATUS_ID, SUCCESS_STATUS_ID],
        },
        required: false,
      }],
      group: '"task.id"',
      having:
        sequelize.or(
          sequelize.where(
            sequelize.fn('COUNT', sequelize.col('userTasks.taskId')), '<', sequelize.col('task.limitTotal'),
          ),
          sequelize.where(
            sequelize.col('task.limitTotal'), Op.eq, null,
          ),
        ),
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

  const result = await checkTaskAvailability(taskId, User.id);

  return res.json(result);
});

export default router;

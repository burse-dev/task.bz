import express from 'express';
import { Op } from 'sequelize';
import passport from 'passport';
import Tasks from '../../models/tasks';
import UserTasks from '../../models/userTasks';
import { save, update, remove } from '../controllers/tasks';
import { REMOVED_TASK_STATUS_ID, SUSPENDED_TASK_STATUS_ID } from '../../../src/constant/taskStatus';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  req.id = id;
  return next();
});

router.get('/feedTasks', async (req, res, next) => {
  try {
    Tasks.findAndCountAll({
      where: {
        status: {
          [Op.notIn]: [REMOVED_TASK_STATUS_ID, SUSPENDED_TASK_STATUS_ID],
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

export default router;

import express from 'express';
import Tasks from '../../models/tasks';

const router = express.Router();

router.get('/tasks', async (req, res, next) => {
  try {
    Tasks.findAndCountAll().then((result) => {
      res.json({
        count: result.count,
        tasks: result.rows,
      });
    });
  } catch (e) {
    next(e);
  }
});

export default router;

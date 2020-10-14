import express from 'express';
import Tickets from '../../models/tickets';
import Users from '../../models/users';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  req.id = id;
  return next();
});

export default async (req, res, next) => {
  try {
    Tickets.findAndCountAll({
      include: [{
        model: Users,
        attributes: [
          'login',
        ],
      }],
      order: [
        ['createdAt', 'DESC'],
      ],
    }).then((result) => {
      res.json({
        count: result.count,
        tickets: result.rows,
      });
    });
  } catch (e) {
    next(e);
  }
};

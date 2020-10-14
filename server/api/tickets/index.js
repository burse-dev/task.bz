import express from 'express';
import passport from 'passport';
import getTickets from '../controllers/tickets';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  req.id = id;
  return next();
});

router.get('/tickets', passport.authenticate('jwt', { session: false }), getTickets);

export default router;

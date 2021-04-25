import express from 'express';
import passport from 'passport';
import {
  getOwnData,
  getWorks,
  makeTask,
  checkUserTask,
  cancelTask,
  sendReport,
  editReport,
  addRequisites,
  addTicket,
  getTickets,
  cancelTicket,
  getAccruals,
  save,
} from '../controllers/users';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  req.userId = id;
  return next();
});

router.get('/user/data', passport.authenticate('jwt', { session: false }), getOwnData);

router.get('/user/works', passport.authenticate('jwt', { session: false }), getWorks);

router.get('/user/getTickets', passport.authenticate('jwt', { session: false }), getTickets);

router.get('/user/getAccruals', passport.authenticate('jwt', { session: false }), getAccruals);

router.post('/user/makeTask', passport.authenticate('jwt', { session: false }), makeTask);

router.post('/user/sendReport', passport.authenticate('jwt', { session: false }), sendReport);

router.post('/user/editReport', passport.authenticate('jwt', { session: false }), editReport);

router.post('/user/cancelTask', passport.authenticate('jwt', { session: false }), cancelTask);

router.post('/user/checkUserTask', passport.authenticate('jwt', { session: false }), checkUserTask);

router.post('/user/addRequisites', passport.authenticate('jwt', { session: false }), addRequisites);

router.post('/user/addTicket', passport.authenticate('jwt', { session: false }), addTicket);

router.post('/user/cancelTicket', passport.authenticate('jwt', { session: false }), cancelTicket);

router.post('/user/save', passport.authenticate('jwt', { session: false }), save);

export default router;

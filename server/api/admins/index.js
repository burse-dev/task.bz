import express from 'express';
import passport from 'passport';
import {
  getReports,
  approveReports,
  declineReports,
  reworkReport,
  getTickets,
  rejectTicket,
  approveTicket,
} from '../controllers/admins';

const router = express.Router();

router.param('id', (req, res, next, id) => {
  req.reportId = id;
  return next();
});

router.get('/reports/:id', passport.authenticate('jwt', { session: false }), getReports);

router.post('/reports/approve', passport.authenticate('jwt', { session: false }), approveReports);

router.post('/reports/decline', passport.authenticate('jwt', { session: false }), declineReports);

router.post('/reports/rework', passport.authenticate('jwt', { session: false }), reworkReport);

router.get('/admin/getTickets', passport.authenticate('jwt', { session: false }), getTickets);

router.post('/admin/rejectTicket', passport.authenticate('jwt', { session: false }), rejectTicket);

router.post('/admin/approveTicket', passport.authenticate('jwt', { session: false }), approveTicket);

export default router;

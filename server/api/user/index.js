import express from 'express';

const passport = require('passport');

const router = express.Router();

const UsersController = require('../controllers/users');

router.param('id', (req, res, next, id) => {
  req.userId = id;
  return next();
});

router.get('/user/data', passport.authenticate('jwt', { session: false }), UsersController.ownData);

router.post('/user/save', passport.authenticate('jwt', { session: false }), UsersController.save);

export default router;

import express from 'express';

const passport = require('passport');
require('../passport');

const UsersController = require('../controllers/users');

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.post('/email/login', passport.authenticate('local', { session: false }), UsersController.signIn);

export default router;

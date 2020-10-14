import express from 'express';
import passport from 'passport';
import { signIn } from '../controllers/users';

require('../passport');

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.post('/email/login', passport.authenticate('local', { session: false }), signIn);

export default router;

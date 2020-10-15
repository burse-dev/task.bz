import express from 'express';
import passport from 'passport';
import { signIn } from '../controllers/users';

const jwt = require('jsonwebtoken');

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

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

router.get('/check-auth', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).end();
    }

    if (decoded.type === 1 || decoded.type === 2) {
      res.json({
        status: 'success',
      });
    }

    return res.status(401).end();
  });
});

router.post('/email/login', passport.authenticate('local', { session: false }), signIn);

export default router;

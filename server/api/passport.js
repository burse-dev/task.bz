import { Strategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import LocalStrategy from 'passport-local';
import Users from '../models/users';

const passport = require('passport');

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: 'task.bz',
}, async (payload, done) => {
  try {
    const existingUser = await Users.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (existingUser) {
      return done(null, existingUser);
    }

    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (inputEmail, inputPassword, done) => {
  const User = await Users.findOne({
    where: {
      email: inputEmail,
    },
  });

  if (!User || !User.password) {
    return done(null, false, { message: 'Incorrect email.' });
  }

  return bcrypt.compare(inputPassword, User.password, (passwordErr, isMatch) => {
    if (passwordErr) {
      return done(passwordErr);
    }

    if (!isMatch) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(null, false, error);
    }

    return done(null, User);
  });
}));

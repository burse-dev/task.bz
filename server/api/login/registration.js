import express from 'express';
import Users from '../../models/users';
import mailer from '../../services/mailer';
import registration from '../../templates/registration';
import isEmailValid from '../../functions/isEmailValid';
import generateHash from '../../functions/generateHash';
import { USER_TYPE_ID } from '../../../src/constant/userType';

const router = express.Router();

router.post('/registration', async (req, res, next) => {
  try {
    const { email, login } = req.body;

    try {
      if (!isEmailValid(email)) {
        res.json({
          error: true,
          message: 'Неверный формат email',
        });
        return;
      }

      const User = await Users.findOne(
        { where: { email } },
      );

      if (User) {
        res.json({
          error: true,
          message: 'Пользователь с таким логином уже существует',
        });
        return;
      }

      const newPass = Math.random().toString(36).substring(2, 10);

      mailer(
        'Регистрация пользователя | task.bz',
        registration.replace('{{name}}', login).replace('{{login}}', email).replace('{{pass}}', newPass),
        null,
        email,
      );

      const hash = await generateHash(newPass);

      await Users.create({
        type: USER_TYPE_ID,
        login,
        email,
        balance: 0,
        password: hash,
      });

      res.json({});
    } catch (e) {
      res.json({});
    }
  } catch (e) {
    next(e);
  }
});

export default router;

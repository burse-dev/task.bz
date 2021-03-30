import express from 'express';
import Users from '../../models/users';
import mailer from '../../services/mailer';
import recoveryPassword from '../../templates/recoveryPassword';
import isEmailValid from '../../functions/isEmailValid';
import generateHash from '../../functions/generateHash';

const router = express.Router();

router.post('/recovery', async (req, res, next) => {
  try {
    const { email } = req.body;

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

      if (!User) {
        res.json({
          error: true,
          message: 'Пользователя с таким логином не существует',
        });
        return;
      }

      const newPass = Math.random().toString(36).substring(2, 10);

      mailer(
        'Восстановление пароля | task.bz',
        recoveryPassword.replace('{{name}}', User.login).replace('{{login}}', email).replace('{{pass}}', newPass),
        null,
        email,
      );

      const hash = await generateHash(newPass);

      await User.update({
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

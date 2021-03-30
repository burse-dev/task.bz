import Users from '../../models/users';
import Mails, { REJECT_TYPE_ID, SUCCESS_TYPE_ID } from '../../models/mails';
import { USER_TYPE_ID } from '../../../src/constant/userType';
import mailer from '../../services/mailer';
import userEmail from '../../templates/userEmail';

// eslint-disable-next-line import/prefer-default-export
export const sendMailing = async (req, res, next) => {
  try {
    const { message, title } = req.body;
    const usersList = await Users.findAndCountAll({
      where: {
        type: USER_TYPE_ID,
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    });

    res.json(true);

    // send messages in background
    if (usersList.rows) {
      usersList.rows.reduce((previousPromise, user) => previousPromise.then(() => mailer(
        title,
        userEmail
          .replace('{{name}}', user.login ? `,&nbsp;${user.login}` : '')
          .replace('{{message}}', message),
        null,
        user.email,
      ).then(() => Mails.create({
        userId: user.id,
        type: SUCCESS_TYPE_ID,
      })).catch(() => {
        Mails.create({
          userId: user.id,
          type: REJECT_TYPE_ID,
        });
      })), Promise.resolve());
    }
  } catch (e) {
    next(e);
  }
};

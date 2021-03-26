import Users from '../../models/users';
import { USER_TYPE_ID } from '../../../src/constant/userType';

// eslint-disable-next-line import/prefer-default-export
export const getList = async (req, res, next) => {
  try {
    Users.findAndCountAll({
      where: {
        type: USER_TYPE_ID,
      },
      attributes: [
        'email', 'login', 'createdAt', 'balance', 'city', 'country', 'type', 'id',
      ],
      order: [
        ['createdAt', 'DESC'],
      ],
    }).then((result) => {
      res.json({
        count: result.count,
        users: result.rows,
      });
    });
  } catch (e) {
    next(e);
  }
};

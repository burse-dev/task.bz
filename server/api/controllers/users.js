import moment from 'moment';
import Users from '../../models/users';
import generateHash from '../../functions/generateHash';

const JWT = require('jsonwebtoken');

const signToken = user => JWT.sign({
  iss: 'task.bz',
  sub: user.id,
  iat: new Date().getTime(),
  exp: new Date().setDate(new Date().getDate() + 1),
}, 'task.bz');

module.exports = {
  signIn: async (req, res) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  ownData: async (req, res) => {
    const data = await Users.findOne({
      where: {
        id: req.user.id,
      },
      attributes: [
        'email', 'login', 'gender', 'city', 'country', 'dob',
      ],
    });

    res.json(data);
  },

  save: async (req, res) => {
    const User = req.user;

    const { login, dob, gender, city, country, password } = req.body;

    let dobValid = true;
    if (!/\d{2}\.\d{2}\.\d{4}/.test(dob)) {
      dobValid = false;
    }

    await User.update({
      ...(dobValid && { dob: moment(dob, 'DD.MM.YYYY') }),
      login,
      gender,
      city,
      country,
      ...(password && { password: await generateHash(password) }),
    });

    res.json(req.user);
  },
};

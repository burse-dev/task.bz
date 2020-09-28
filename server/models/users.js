import Sequelize from 'sequelize';

const db = require('../config/database');

const Users = db.define('users', {
  email: Sequelize.TEXT,
  login: Sequelize.TEXT,
  typeId: Sequelize.INTEGER,
  gender: Sequelize.TEXT,
  dob: Sequelize.DATE,
  country: Sequelize.TEXT,
  phone: Sequelize.TEXT,
  city: Sequelize.TEXT,
  password: Sequelize.TEXT,
});

export default Users;

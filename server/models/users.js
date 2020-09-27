import Sequelize from 'sequelize';

const db = require('../config/database');

const Users = db.define('users', {
  typeId: Sequelize.INTEGER,
  gender: Sequelize.TEXT,
  phone: Sequelize.TEXT,
  email: Sequelize.TEXT,
  password: Sequelize.TEXT,
});

export default Users;

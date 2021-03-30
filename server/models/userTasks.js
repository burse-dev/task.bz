import Sequelize from 'sequelize';
import Files from './files';

const db = require('../config/database');

const UserTasks = db.define('userTask', {
  report: Sequelize.TEXT,
  reply: Sequelize.TEXT,
  screenshot: Sequelize.TEXT,
  status: Sequelize.INTEGER,
  readyDate: Sequelize.DATE,
  wasPaid: Sequelize.BOOLEAN,
});

UserTasks.hasMany(Files);

export default UserTasks;

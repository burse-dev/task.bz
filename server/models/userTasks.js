import Sequelize from 'sequelize';

const db = require('../config/database');

export default db.define('userTask', {
  report: Sequelize.TEXT,
  reply: Sequelize.TEXT,
  screenshot: Sequelize.TEXT,
  status: Sequelize.INTEGER,
  readyDate: Sequelize.DATE,
  wasPaid: Sequelize.BOOLEAN,
});

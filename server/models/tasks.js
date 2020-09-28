import Sequelize from 'sequelize';

const db = require('../config/database');

const Tasks = db.define('task', {
  title: Sequelize.TEXT,
  status: Sequelize.INTEGER,
  description: Sequelize.TEXT,
  category: Sequelize.INTEGER,
  price: Sequelize.INTEGER,
  time_start: Sequelize.DATE,
  time_end: Sequelize.DATE,
  owner: Sequelize.INTEGER,
  timeLimitValue: Sequelize.INTEGER,
  maxExecutionPerLimit: Sequelize.INTEGER,
  executionTime: Sequelize.INTEGER,
  executionCount: Sequelize.INTEGER,
});

export default Tasks;

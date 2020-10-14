import Sequelize from 'sequelize';
import UserTasks from './userTasks';

const db = require('../config/database');

const Tasks = db.define('task', {
  title: Sequelize.TEXT,
  category: Sequelize.INTEGER,
  description: Sequelize.TEXT,
  reportRules: Sequelize.TEXT,
  price: Sequelize.INTEGER,
  executionTimeForUserLimit: Sequelize.INTEGER,
  limitInHour: Sequelize.INTEGER,
  limitForUser: Sequelize.INTEGER,
  limitInDay: Sequelize.INTEGER,
  limitTotal: Sequelize.INTEGER,
  status: Sequelize.INTEGER,
  startTime: Sequelize.DATE,
  endTime: Sequelize.DATE,
  owner: Sequelize.INTEGER,
});

Tasks.hasMany(UserTasks);
UserTasks.belongsTo(Tasks);

export default Tasks;

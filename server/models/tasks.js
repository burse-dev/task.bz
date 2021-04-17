import Sequelize from 'sequelize';
import UserTasks from './userTasks';

const db = require('../config/database');

const Tasks = db.define('task', {
  title: Sequelize.TEXT,
  category: Sequelize.INTEGER,
  description: Sequelize.TEXT,
  reportRules: Sequelize.TEXT,
  price: Sequelize.FLOAT,
  executionTimeLimit: Sequelize.INTEGER, // время исполнения
  limitInHour: Sequelize.INTEGER, // лимит исполнений в час
  limitInDay: Sequelize.INTEGER, // лимит исполнений в день
  limitTotal: Sequelize.INTEGER, // общий лимит на задачу
  executionType: Sequelize.INTEGER,
  executionInterval: Sequelize.INTEGER,
  status: Sequelize.INTEGER,
  startTime: Sequelize.DATE,
  endTime: Sequelize.DATE,
  owner: Sequelize.INTEGER,
  inPriority: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Tasks.hasMany(UserTasks);
UserTasks.belongsTo(Tasks);

export default Tasks;

import Sequelize from 'sequelize';
import Tasks from './tasks';

const db = require('../config/database');

const TaskPacks = db.define('taskPack', {
  title: Sequelize.STRING,
  bonusPercentage: Sequelize.INTEGER,
});

TaskPacks.hasMany(Tasks);

export default TaskPacks;

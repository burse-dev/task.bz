import Tasks from './tasks';

const db = require('../config/database');

const TaskPacks = db.define('taskPack', {});

TaskPacks.hasMany(Tasks);

export default TaskPacks;

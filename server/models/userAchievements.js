import Sequelize from 'sequelize';

const db = require('../config/database');

const UserAchievement = db.define('userAchievement', {
  value: Sequelize.TEXT,
});

export default UserAchievement;

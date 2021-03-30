import Sequelize from 'sequelize';

const db = require('../config/database');

const Files = db.define('file', {
  path: Sequelize.TEXT,
  url: Sequelize.TEXT,
});

export default Files;

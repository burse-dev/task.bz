import Sequelize from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

module.exports = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: config.logging,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

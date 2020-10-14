import Sequelize from 'sequelize';

const db = require('../config/database');

const Requisites = db.define('requisites', {
  value: Sequelize.TEXT,
  type: Sequelize.INTEGER,
});

export default Requisites;

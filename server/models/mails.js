import Sequelize from 'sequelize';

const db = require('../config/database');

export const SUCCESS_TYPE_ID = 1;
export const REJECT_TYPE_ID = 2;

const Mails = db.define('mail', {
  userId: Sequelize.INTEGER,
  type: Sequelize.INTEGER,
});

export default Mails;

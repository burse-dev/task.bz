import Sequelize from 'sequelize';
import Messages from './messages';

const db = require('../config/database');

const Dialogs = db.define('dialogs', {
  subject: Sequelize.TEXT,
  status: Sequelize.INTEGER,
  lastMessageText: Sequelize.TEXT,
  lastMessageDate: Sequelize.DATE,
});

Dialogs.hasMany(Messages);

export default Dialogs;

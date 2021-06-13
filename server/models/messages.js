import Sequelize from 'sequelize';

const db = require('../config/database');

const Messages = db.define('messages', {
  text: Sequelize.TEXT,
  wasRead: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  senderId: Sequelize.INTEGER,
  recipientId: Sequelize.INTEGER,
  sentFromAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default Messages;

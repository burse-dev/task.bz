import Sequelize from 'sequelize';
import Tasks from './tasks';

const db = require('../config/database');

const Transactions = db.define('transactions', {
  value: Sequelize.FLOAT,
  description: Sequelize.TEXT,
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

Transactions.belongsTo(Tasks);

export default Transactions;

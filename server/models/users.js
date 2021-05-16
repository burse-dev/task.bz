import Sequelize from 'sequelize';
import Requisites from './requisites';
import UserTasks from './userTasks';
import Transactions from './transactions';
import UserAchievement from './userAchievements';

const db = require('../config/database');

const Users = db.define('users', {
  email: Sequelize.TEXT,
  balance: Sequelize.FLOAT,
  login: Sequelize.TEXT,
  type: Sequelize.INTEGER,
  gender: Sequelize.TEXT,
  dob: Sequelize.DATE,
  country: Sequelize.TEXT,
  phone: Sequelize.TEXT,
  city: Sequelize.TEXT,
  password: Sequelize.TEXT,
  lastActivity: Sequelize.DATE,
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

// eslint-disable-next-line func-names
Users.prototype.recalculatePayments = async function () {
  if (!this.transactions) {
    return null;
  }

  const balance = this.transactions.reduce(
    (accumulator, current) => accumulator + current.value,
    0,
  );

  return this.update({
    balance,
  });
};

Users.hasMany(UserTasks);
UserTasks.belongsTo(Users);

Users.hasMany(Requisites);

Users.hasMany(UserAchievement);

Users.hasMany(Transactions);
Transactions.belongsTo(Users);

export default Users;

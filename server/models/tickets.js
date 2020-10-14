import Sequelize from 'sequelize';
import Users from './users';
import Requisites from './requisites';

const db = require('../config/database');

const Tickets = db.define('tickets', {
  value: Sequelize.FLOAT,
  status: Sequelize.INTEGER,
});

Tickets.belongsTo(Users);
Tickets.belongsTo(Requisites);

export default Tickets;

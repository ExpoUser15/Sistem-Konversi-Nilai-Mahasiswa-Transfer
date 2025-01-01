const { Sequelize } = require('sequelize');

const URI = `mysql://${MYSQLUSER}:${MYSQLPASSWORD}@${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}`;

const sequelize = new Sequelize(URI);

module.exports = sequelize;
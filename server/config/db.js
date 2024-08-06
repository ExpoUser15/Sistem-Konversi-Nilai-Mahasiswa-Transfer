const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('db_konversi_nilai', 'root', '', {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

module.exports = sequelize;
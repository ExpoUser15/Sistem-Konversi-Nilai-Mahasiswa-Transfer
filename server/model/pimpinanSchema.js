const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const pimpinanSchema = sequelize.define(
    'tb_leader',
    {
      kode: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jabatan: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
        timestamps: false,
    }
);

module.exports = pimpinanSchema;
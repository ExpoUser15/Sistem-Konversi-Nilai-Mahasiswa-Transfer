const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const logActivitySchema = sequelize.define(
    'tb_log_activity',
    {
      id_aktivitas: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_pengguna: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
        timestamps: false,
    }
);

module.exports = logActivitySchema;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const laporanSchema = sequelize.define(
    'tb_document',
    {
      id_dokumen: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: true,
      },
      dokumen: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      formulir: {
        type: DataTypes.STRING,
        allowNull: true
      },
      daftar_konversi: {
        type: DataTypes.STRING,
        allowNull: true
      },
      id_mahasiswa: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
        timestamps: false
    }
);

module.exports = laporanSchema;
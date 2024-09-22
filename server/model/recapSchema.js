const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const recapSchema = sequelize.define(
    'tb_recapitulations',
    {
      id_recap: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      sisa_mk: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      total_hasil_konversi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_sks_asal: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total_sks_tujuan: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      semester: {
        type: DataTypes.STRING,
        allowNull: true
      },
      report: {
        type: DataTypes.STRING,
        allowNull: true
      },
      id_mahasiswa: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tanggal: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {
        timestamps: false
    }
);

module.exports = recapSchema;
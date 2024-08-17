const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const konversiSchema = sequelize.define(
    'tb_conversion',
    {
      id_konversi: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: true,
      },
      mk_asal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sks_asal: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nilai_asal: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_mk: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sks_tujuan: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nilai_tujuan: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      id_mahasiswa: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      tanggal: {
        type: DataTypes.STRING,
        allowNull: false
      } 
    },
    {
        timestamps: false
    }
);

module.exports = konversiSchema;
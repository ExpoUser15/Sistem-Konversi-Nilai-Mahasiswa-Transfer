const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const mahasiswaSchema = sequelize.define(
    'tb_student',
    {
      id_mahasiswa: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: true,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nim: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pt_asal: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fakultas: {
        type: DataTypes.STRING,
        allowNull: false
      },
      prodi: {
        type: DataTypes.STRING,
        allowNull: false
      },
      prodi_tujuan: {
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

module.exports = mahasiswaSchema;
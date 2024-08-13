const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const mataKuliahSchema = sequelize.define(
    'tb_course',
    {
      id_mk: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: true,
      },
      mata_kuliah: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sks: {
        type: DataTypes.STRING,
        allowNull: false
      },
      semester: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
        timestamps: false
    }
);

module.exports = mataKuliahSchema;
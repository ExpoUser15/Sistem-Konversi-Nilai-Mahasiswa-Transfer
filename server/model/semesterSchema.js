const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const semesterSchema = sequelize.define(
    'tb_semester',
    {
      id_semester: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      id_mk: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      semester: {
        type: DataTypes.STRING,
        allowNull: false
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

module.exports = semesterSchema;
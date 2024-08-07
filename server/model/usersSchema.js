const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const usersSchema = sequelize.define(
    'tb_user',
    {
      id_pengguna: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user: {
        type: DataTypes.ENUM,
        values: ['Akademik', 'Kaprodi']
      }
    },
    {
        timestamps: false
    }
);

module.exports = usersSchema;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const berkasSchema = sequelize.define(
    'tb_file',
    {
      id_berkas: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: true,
      },
      transkrip_nilai: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kk: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ktp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ijazah: {
        type: DataTypes.STRING,
        allowNull: false
      },
      surat_pindah: {
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

module.exports = berkasSchema;
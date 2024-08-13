const { QueryTypes } = require("sequelize");
const { getCurrentTime, getCurrentFormattedDate } = require("../utils/time");
const { v4: uuidv4 } = require('uuid');
const sequelize = require("../config/db");

async function createLog(schema, { ket, idUser }) {
    const date = getCurrentFormattedDate();
    const time = getCurrentTime();
    const full = `${date.formatDate2} ${time}`;
    await schema.create({
        id_aktivitas: uuidv4(),
        keterangan: ket,
        tanggal: full,
        id_pengguna: idUser
    });
}

async function readLog() {
    let results = await sequelize.query(
        `SELECT 
            tb_log_activities.id_aktivitas,
            tb_log_activities.keterangan,
            tb_log_activities.tanggal,
            tb_users.username,
            tb_users.user
         FROM tb_log_activities
         JOIN tb_users ON tb_users.id_pengguna = tb_log_activities.id_pengguna 
         ORDER BY tanggal DESC`, 
        {
          type: QueryTypes.SELECT
        }
      )
    
      results.map(item => item.tanggal = getCurrentFormattedDate(new Date(item.tanggal)).formatDate + " " + getCurrentTime());

    return results;
}

module.exports = {
    createLog,
    readLog
};
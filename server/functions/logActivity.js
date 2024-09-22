const { QueryTypes } = require("sequelize");
const { getCurrentTime, getCurrentFormattedDate } = require("../utils/time");
const { v4: uuidv4 } = require('uuid');
const sequelize = require("../config/db");

async function createLog(schema, { ket, idUser }) {
    const date = getCurrentFormattedDate(); // Ambil format tanggal saat ini
    const time = getCurrentTime(); // Ambil waktu saat ini
    const full = `${date.formatDate2} ${time}`; // Gabungkan tanggal dan waktu
    await schema.create({
        id_aktivitas: uuidv4(), // Buat ID unik untuk log aktivitas
        keterangan: ket, // Keterangan aktivitas
        tanggal: full, // Tanggal dan waktu aktivitas
        id_pengguna: idUser // ID pengguna yang melakukan aktivitas
    });
}

async function readLog() {
    // Query untuk mendapatkan log aktivitas dengan join ke tabel pengguna
    let results = await sequelize.query(
        `SELECT 
            tb_log_activities.id_aktivitas,
            tb_log_activities.keterangan,
            tb_log_activities.tanggal,
            tb_users.username,
            tb_users.user
         FROM tb_log_activities
         JOIN tb_users ON tb_users.id_pengguna = tb_log_activities.id_pengguna 
         ORDER BY tanggal DESC
         LIMIT 50`, 
        {
          type: QueryTypes.SELECT
        }
    );

    // Lakukan pemformatan ulang tanggal jika diperlukan
    results = results.map(item => {
        const formattedDate = getCurrentFormattedDate(new Date(item.tanggal)).formatDate;
        const formattedTime = getCurrentTime(new Date(item.tanggal));
        item.tanggal = `${formattedDate} ${formattedTime}`;
        return item;
    });

    return results;
}

module.exports = {
    createLog,
    readLog
};

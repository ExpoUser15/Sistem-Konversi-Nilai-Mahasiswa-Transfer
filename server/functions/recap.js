const { QueryTypes } = require("sequelize");
const sequelize = require("../config/db");

async function recap(id) {
    const result = {};

    const countQuery = await sequelize.query(
        `SELECT tb_courses.*
         FROM tb_courses 
         LEFT JOIN tb_conversions 
         ON tb_courses.id_mk = tb_conversions.id_mk
         AND tb_conversions.id_mahasiswa = :id 
         WHERE tb_conversions.id_mk IS NULL`,
        {
            type: QueryTypes.SELECT,
            replacements: { id }
        }
    );

    const data = await sequelize.query(
        `SELECT *
         FROM tb_conversions 
         JOIN tb_courses ON tb_courses.id_mk = tb_conversions.id_mk
         WHERE tb_conversions.id_mahasiswa = :id`,
        {
            type: QueryTypes.SELECT,
            replacements: { id }
        }
    );

    const totalSks = await sequelize.query(`
            SELECT 
                id_mahasiswa,
                SUM(tb_courses.sks) AS total_sks_tujuan,
                SUM(tb_conversions.sks_asal) AS total_sks_asal
            FROM 
                tb_conversions
            JOIN tb_courses ON tb_courses.id_mk = tb_conversions.id_mk
            WHERE 
                id_mahasiswa = :id_mahasiswa
            GROUP BY 
                id_mahasiswa`,
        {
            replacements: { id_mahasiswa: id }, 
            type: sequelize.QueryTypes.SELECT
        }
    );

    result.remainingMK = `${countQuery.length} MK`;
    result.totalSKSAsal = `${String(totalSks[0].total_sks_asal)} SKS`;
    result.totalSKSTujuan = `${String(totalSks[0].total_sks_tujuan)} SKS`;
    result.totalMK = `${data.length} MK`;

    return result;
}

module.exports = recap;
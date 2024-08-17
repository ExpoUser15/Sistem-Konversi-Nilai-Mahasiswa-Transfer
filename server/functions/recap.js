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

    const totalSKS = data.reduce((accumulator, student) => accumulator + Number(student.sks), 0);

    result.remainingMK = `${countQuery.length} MK`;
    result.totalSKS = `${String(totalSKS)} SKS`;
    result.totalMK = `${data.length} MK`;

    return result;
}

module.exports = recap;
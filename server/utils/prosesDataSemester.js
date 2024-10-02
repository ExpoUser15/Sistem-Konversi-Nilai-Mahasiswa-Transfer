const sequelize = require('../config/db');

function dataTable(query) {
    const hasil = query.map(item => [
        item.mata_kuliah,
        item.sks
    ]);

    return hasil;
}

function dataTableMK(query){
    const hasil = query.map(item => [
        item.semester,
        item.total_mata_kuliah_per_semester === '8' ? '0' : item.total_mata_kuliah_per_semester,
        item.total_mata_kuliah_per_semester === '8' ? '' : item.total_sks_per_semester,
    ]);

    return hasil;
}

async function proses(id) {
    const result = await sequelize.query(`
    SELECT * 
    FROM (
        SELECT 
        k.id_mahasiswa, 
        mk.id_mk, 
        mk.mata_kuliah, 
        mk.sks, 
        mk.semester, 
        (
            SELECT SUM(mk2.sks) 
            FROM tb_conversions k2 
            JOIN tb_courses mk2 ON k2.id_mk = mk2.id_mk 
            WHERE k2.id_mahasiswa = k.id_mahasiswa 
            AND mk2.id_mk <= mk.id_mk 
            AND mk2.semester % 2 = 1
        ) AS running_sks 
        FROM tb_conversions k 
        JOIN tb_courses mk ON k.id_mk = mk.id_mk 
        WHERE k.id_mahasiswa = :id
        AND mk.semester % 2 = 1
    ) AS temp 
    WHERE running_sks <= 24
    ORDER BY running_sks DESC;
    `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { id }
    });

    const data = dataTable(result);

    const result2 = await sequelize.query(`
    SELECT * 
    FROM (
        SELECT 
        k.id_mahasiswa, 
        mk.id_mk, 
        mk.mata_kuliah, 
        mk.sks, 
        mk.semester, 
        (
            SELECT SUM(mk2.sks) 
            FROM tb_conversions k2 
            JOIN tb_courses mk2 ON k2.id_mk = mk2.id_mk 
            WHERE k2.id_mahasiswa = k.id_mahasiswa 
            AND mk2.id_mk <= mk.id_mk 
            AND mk2.semester % 2 = 1
        ) AS running_sks 
        FROM tb_conversions k 
        JOIN tb_courses mk ON k.id_mk = mk.id_mk 
        WHERE k.id_mahasiswa = :id
        AND mk.semester % 2 = 1
    ) AS temp 
    WHERE running_sks > 24
    ORDER BY running_sks DESC;
    `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { id }
    });

    const data2 = dataTable(result2);

    const result3 = await sequelize.query(`
    SELECT * 
    FROM (
        SELECT 
            k.id_mahasiswa, 
            mk.id_mk, 
            mk.mata_kuliah, 
            mk.sks, 
            mk.semester, 
            (
                SELECT SUM(mk2.sks) 
                FROM tb_conversions k2 
                JOIN tb_courses mk2 ON k2.id_mk = mk2.id_mk 
                WHERE k2.id_mahasiswa = k.id_mahasiswa 
                AND mk2.id_mk <= mk.id_mk 
                AND mk2.semester % 2 = 0
            ) AS running_sks 
        FROM tb_conversions k 
        JOIN tb_courses mk ON k.id_mk = mk.id_mk 
        WHERE k.id_mahasiswa = :id 
        AND mk.semester % 2 = 0
    ) AS temp 
    WHERE running_sks <= 24
    ORDER BY running_sks DESC;
`, {
    type: sequelize.QueryTypes.SELECT,
    replacements: { id }
});

    const data3 = dataTable(result3);

    const result4 = await sequelize.query(`
    SELECT * 
    FROM (
        SELECT 
        k.id_mahasiswa, 
        mk.id_mk, 
        mk.mata_kuliah, 
        mk.sks, 
        mk.semester, 
        (
            SELECT SUM(mk2.sks) 
            FROM tb_conversions k2 
            JOIN tb_courses mk2 ON k2.id_mk = mk2.id_mk 
            WHERE k2.id_mahasiswa = k.id_mahasiswa 
            AND mk2.id_mk <= mk.id_mk 
            AND mk2.semester % 2 = 0
        ) AS running_sks 
        FROM tb_conversions k 
        JOIN tb_courses mk ON k.id_mk = mk.id_mk 
        WHERE k.id_mahasiswa = :id
        AND mk.semester % 2 = 0
    ) AS temp 
    WHERE running_sks > 24
    ORDER BY running_sks DESC;
    `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { id }
    });

    const data4 = dataTable(result4);

    const query = `
    SELECT 
        mk.semester, 
        COUNT(mk.id_mk) AS total_mata_kuliah_per_semester, 
        SUM(mk.sks) AS total_sks_per_semester,
        (SELECT SUM(mk2.sks)
         FROM tb_courses mk2
         LEFT JOIN tb_conversions k2 ON mk2.id_mk = k2.id_mk AND k2.id_mahasiswa = :id_mahasiswa
         WHERE k2.id_mk IS NULL
        ) AS total_sks_keseluruhan,
        (SELECT COUNT(mk3.id_mk)
         FROM tb_courses mk3
         LEFT JOIN tb_conversions k3 ON mk3.id_mk = k3.id_mk AND k3.id_mahasiswa = :id_mahasiswa
         WHERE k3.id_mk IS NULL
        ) AS total_mata_kuliah_keseluruhan
    FROM tb_courses mk
    LEFT JOIN tb_conversions k ON mk.id_mk = k.id_mk AND k.id_mahasiswa = :id_mahasiswa
    WHERE k.id_mk IS NULL
    GROUP BY mk.semester
    ORDER BY mk.semester ASC;
  `;

    let results = await sequelize.query(query, {
        replacements: { id_mahasiswa: id }, 
        type: sequelize.QueryTypes.SELECT
    });

    const totalMK = results[0].total_mata_kuliah_keseluruhan;

    results = dataTableMK(results);

    return {
        ganjil: result.length != 0 ? { data, total: result[0].running_sks } : '',
        ganjilLebih: result2.length != 0 ? { data: data2, total: result2[result2.length - 1].running_sks } : '',
        genap: result3.length != 0 ? { data: data3, total: result3[0].running_sks } : '',
        genapLebih: result4.length != 0 ? { data: data4, total: result4[result4.length - 1].running_sks } : '',
        mkBelum: { data: results, total: totalMK }
    }
}

module.exports = proses;
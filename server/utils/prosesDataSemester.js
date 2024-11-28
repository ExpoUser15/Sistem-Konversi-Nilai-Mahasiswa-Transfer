const { QueryTypes } = require('sequelize');
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

    const data100 = await sequelize.query(
        `
        SELECT tb_semesters.id_semester, tb_semesters.penempatan, tb_courses.mata_kuliah, tb_courses.sks, tb_courses.semester
        FROM tb_semesters 
        JOIN tb_courses 
        ON tb_courses.id_mk = tb_semesters.id_mk 
        WHERE id_mahasiswa = :id
        ORDER BY tb_semesters.penempatan ASC
        `,
        {
            type: QueryTypes.SELECT,
            replacements: { id },
        }
    );

    const groupedData = data100.reduce((acc, item) => {
        const penempatan = item.penempatan;

        let placementGroup = acc.find((group) => group.penempatan === penempatan);

        if (!placementGroup) {
            placementGroup = { penempatan, courses: [], total_sks: 0 };
            acc.push(placementGroup);
        }

        placementGroup.courses.push({
            mata_kuliah: item.mata_kuliah,
            sks: item.sks,
            penempatan: item.penempatan,
            semester: item.semester,
            kode: item.id_semester,
            totalSKS: placementGroup.total_sks + item.sks
        });

        placementGroup.total_sks += item.sks;

        return acc;
    }, []);

    const result100 = groupedData.map(group => (group.courses));

    return {
        dataPenempatan: result100,
        mkBelum: { data: results, total: totalMK }
    }
}

module.exports = proses;
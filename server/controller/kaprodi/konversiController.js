const { Op, QueryTypes } = require("sequelize");
const generateId = require("../../functions/generateId");
const recap = require("../../functions/recap");
const konversiSchema = require("../../model/konversiSchema");
const recapSchema = require("../../model/recapSchema");
const Queries = require("../../queries/queries");
const { getCurrentFormattedDate } = require("../../utils/time");
const generatePDF = require("../../utils/generateReport");
const mahasiswaSchema = require("../../model/mahasiswaSchema");
const sequelize = require("../../config/db");
const semesterSchema = require("../../model/semesterSchema");
const mataKuliahSchema = require("../../model/mataKuliahSchema");
const path = require('path');
const fs = require('fs');

const konveriQueries = new Queries(konversiSchema);
const recapQueries = new Queries(recapSchema);
const mahasiswaQueries = new Queries(mahasiswaSchema);
const semesterQueries = new Queries(semesterSchema);

const konversiController = async (req, res) => {
    try {
        const data = await sequelize.query("SELECT tb_recapitulations.*, tb_students.*, tb_recapitulations.tanggal AS tanggal_recap  FROM tb_recapitulations JOIN tb_students ON tb_students.id_mahasiswa = tb_recapitulations.id_mahasiswa", {
            type: QueryTypes.SELECT
        });

        res.json({
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const konversiReportController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await sequelize.query("SELECT * FROM tb_recapitulations JOIN tb_students ON tb_students.id_mahasiswa = tb_recapitulations.id_mahasiswa JOIN tb_documents ON tb_documents.id_mahasiswa = tb_recapitulations.id_mahasiswa WHERE tb_recapitulations.id_mahasiswa = :id", {
            type: QueryTypes.SELECT,
            replacements: { id }
        });

        res.json({
            data: data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const penempatanMKController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await sequelize.query(`
            SELECT tb_courses.* 
            FROM tb_courses 
            LEFT JOIN tb_conversions 
            ON tb_courses.id_mk = tb_conversions.id_mk 
            AND tb_conversions.id_mahasiswa = :id 
            LEFT JOIN tb_semesters ON tb_semesters.id_mk = tb_courses.id_mk
            AND tb_semesters.id_mahasiswa = :id 
            WHERE tb_conversions.id_mk IS NULL AND tb_semesters.id_mk IS NULL
            ORDER BY tb_courses.semester ASC
        `, {
            type: QueryTypes.SELECT,
            replacements: { id }
        });

        res.json({
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const penempatanController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await sequelize.query(
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

        const groupedData = data.reduce((acc, item) => {
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

        const result = groupedData.map(group => (group.courses));

        res.json({
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const recapController = async (req, res) => {
    try {
        const { id } = req.params;
        const recapData = await recapQueries.findOne({
            id_mahasiswa: id
        });

        res.json({
            data: recapData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'Error',
            message: "Server Error"
        });
    }
}

const semesterPostController = async (req, res) => {
    try {
        const { id } = req.params;
        const { mata_kuliah, semester } = req.body;

        let data = await sequelize.query(
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

        let mkData = await sequelize.query(`
            SELECT tb_courses.* 
            FROM tb_courses 
            LEFT JOIN tb_conversions 
            ON tb_courses.id_mk = tb_conversions.id_mk 
            AND tb_conversions.id_mahasiswa = :id 
            LEFT JOIN tb_semesters ON tb_semesters.id_mk = tb_courses.id_mk
            AND tb_semesters.id_mahasiswa = :id 
            WHERE tb_conversions.id_mk IS NULL AND tb_semesters.id_mk IS NULL
            ORDER BY tb_courses.semester ASC
        `, {
            type: QueryTypes.SELECT,
            replacements: { id }
        });

        if (!mata_kuliah || !semester) {
            return res.status(422).json({
                status: 'Warning',
                message: "Silahkan mengisi mata kuliah dan semester terlebih dahulu."
            });
        }

        const sks = await sequelize.query(
            `
            SELECT sks FROM tb_courses 
            WHERE id_mk = :id
            `,
            {
                type: QueryTypes.SELECT,
                replacements: { id: mata_kuliah },
            }
        );

        let sumQuery = await sequelize.query(
            `
            SELECT SUM(tb_courses.sks) AS total_sks
            FROM tb_semesters 
            JOIN tb_courses 
            ON tb_courses.id_mk = tb_semesters.id_mk 
            WHERE id_mahasiswa = :id AND penempatan = :semester
            ORDER BY tb_semesters.penempatan ASC
            `,
            {
                type: QueryTypes.SELECT,
                replacements: { id, semester },
            }
        );

        const sum = Number(sumQuery[0].total_sks) + Number(sks[0].sks);

        let groupedData = data.reduce((acc, item) => {
            const penempatan = item.penempatan;

            let placementGroup = acc.find((group) => group.penempatan === penempatan);

            if (!placementGroup) {
                placementGroup = { penempatan, courses: [], total_sks: 0 };
                acc.push(placementGroup);
            }

            placementGroup.total_sks = placementGroup.total_sks + item.sks;

            placementGroup.courses.push({
                mata_kuliah: item.mata_kuliah,
                sks: item.sks,
                penempatan: item.penempatan,
                semester: item.semester,
                kode: item.id_semester,
                totalSKS: placementGroup.total_sks
            });

            return acc;
        }, []);

        let result = groupedData.map(group => group.courses);

        if (sum > 24) {
            return res.json({
                status: "Warning",
                message: `SKS yang anda masukan pada semester ${semester} melebihi maksimal SKS (24).`,
                data: result,
                mkData
            });
        }

        let idUser;

        let userId = await semesterQueries.findAll();
        if (userId.length === 0) {
            idUser = generateId(0, 'S');
        } else {
            userId = Number(userId[userId.length - 1].id_semester.substring(2));
            idUser = generateId(userId, 'S');
        }

        await semesterQueries.create({
            id_semester: idUser,
            id_mk: mata_kuliah,
            penempatan: semester,
            id_mahasiswa: id
        });

        data = await sequelize.query(
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

        groupedData = data.reduce((acc, item) => {
            const penempatan = item.penempatan;

            let placementGroup = acc.find((group) => group.penempatan === penempatan);

            if (!placementGroup) {
                placementGroup = { penempatan, courses: [], total_sks: 0 };
                acc.push(placementGroup);
            }

            placementGroup.total_sks = placementGroup.total_sks + item.sks;

            placementGroup.courses.push({
                mata_kuliah: item.mata_kuliah,
                sks: item.sks,
                penempatan: item.penempatan,
                semester: item.semester,
                kode: item.id_semester,
                totalSKS: placementGroup.total_sks
            });

            return acc;
        }, []);

        result = groupedData.map(group => group.courses);

        mkData = await sequelize.query(`
            SELECT tb_courses.* 
            FROM tb_courses 
            LEFT JOIN tb_conversions 
            ON tb_courses.id_mk = tb_conversions.id_mk 
            AND tb_conversions.id_mahasiswa = :id 
            LEFT JOIN tb_semesters ON tb_semesters.id_mk = tb_courses.id_mk
            AND tb_semesters.id_mahasiswa = :id 
            WHERE tb_conversions.id_mk IS NULL AND tb_semesters.id_mk IS NULL
            ORDER BY tb_courses.semester ASC
        `, {
            type: QueryTypes.SELECT,
            replacements: { id }
        });

        console.log(mkData);

        res.json({
            status: 'Success',
            message: 'Berhasil Memasukan mata kuliah',
            data: result,
            mkData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const detailKonversiController = async (req, res) => {
    try {
        const { id } = req.params

        const data = await sequelize.query(`
            SELECT 
                tb_conversions.id_konversi, 
                tb_conversions.id_mahasiswa, 
                tb_conversions.mk_asal, 
                tb_conversions.sks_asal, 
                tb_conversions.nilai_asal, 
                tb_courses.mata_kuliah, 
                tb_courses.sks, 
                tb_conversions.nilai_tujuan, 
                tb_courses.id_mk 
            FROM tb_conversions 
            JOIN tb_courses ON tb_courses.id_mk = tb_conversions.id_mk 
            WHERE id_mahasiswa = :id 
            ORDER BY semester ASC`, {
            type: QueryTypes.SELECT,
            replacements: { id }
        });

        res.json({
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const addKonversiController = async (req, res) => {
    try {
        if (req.error) {
            return res.status(422).json({
                status: "Error",
                message: "Terjadi duplikasi data!"
            });
        }

        const { data, semester } = req.body;
        const { id } = req.params;

        if (!id) {
            return res.status(422).json({
                status: "Error",
                message: "Terjadi kesalahan"
            });
        }

        const exists = await mahasiswaQueries.findOne({ id_mahasiswa: id });

        if (!exists) {
            return res.json({
                status: "Error",
                message: "Mahasiswa tidak ditemukan"
            });
        }

        let error;

        for (var i = 0; i < data.length; i++) {
            const { mata_kuliah_asal, sks_asal, nilai_asal, mata_kuliah_tujuan, sks_tujuan, nilai_tujuan } = data[i];
            if (!mata_kuliah_asal || !sks_asal || !nilai_asal || !mata_kuliah_tujuan || !sks_tujuan || !nilai_tujuan) {
                error = true;
                break;
            }
            error = false;
        }

        if (error) {
            return res.status(422).json({
                status: "Error",
                message: "Data tidak lengkap. Silahkan cek terlebih dahulu!"
            });
        }

        let konversiDat = await konveriQueries.findAll({
            id_mahasiswa: id
        });

        if (konversiDat.length !== 0) {
            await konveriQueries.delete({
                id_mahasiswa: id
            });
        }

        for (var i = 0; i < data.length; i++) {
            const { mata_kuliah_asal, sks_asal, nilai_asal, mata_kuliah_tujuan, sks_tujuan, nilai_tujuan } = data[i];

            let idKonversi;
            let konversiId = await konveriQueries.findAll();

            if (konversiId.length === 0) {
                idKonversi = generateId(0, 'K');
            } else {
                konversiId = Number(konversiId[konversiId.length - 1].id_konversi.substring(1));
                idKonversi = generateId(konversiId, 'K');
            }

            const tanggal = getCurrentFormattedDate().formatDate2;

            await konveriQueries.create({
                id_konversi: idKonversi,
                mk_asal: mata_kuliah_asal,
                sks_asal,
                nilai_asal,
                id_mk: mata_kuliah_tujuan,
                sks_tujuan,
                nilai_tujuan,
                id_mahasiswa: id,
                tanggal
            });
        }

        const recapQ = await recapQueries.findAll({
            id_mahasiswa: id
        });

        if (recapQ.id_mahasiswa === id) {
            await recapQueries.delete({
                id_mahasiswa: id
            });
        }

        const { remainingMK, totalSKSAsal, totalSKSTujuan, totalMK } = await recap(id);

        let recapId = await sequelize.query("SELECT * FROM tb_recapitulations");
        recapId = recapId[0];

        let idRecap;

        if (recapId.length === 0) {
            idRecap = generateId(0, 'Recap');
        } else {
            recapId = Number(recapId[recapId.length - 1].id_recap.substring(5));
            idRecap = generateId(recapId, 'Recap');
        }

        const tanggal = getCurrentFormattedDate().formatDate2;

        await recapSchema.create({
            id_recap: idRecap,
            sisa_mk: remainingMK,
            total_hasil_konversi: totalMK,
            total_sks_asal: totalSKSAsal,
            total_sks_tujuan: totalSKSTujuan,
            semester,
            id_mahasiswa: id,
            tanggal
        });

        await mahasiswaQueries.update({
            status: 'Converted'
        }, {
            id_mahasiswa: id
        });

        const mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa WHERE status = 'Pending' ORDER BY tanggal ASC");

        res.json({
            status: "Success",
            message: "Berhasil menyimpan hasil konversi, silahkan cek di riwayat konversi.",
            data: mahasiswaData[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'Error',
            message: "Server Error"
        });
    }
}

const updateKonversiController = async (req, res) => {
    try {
        const { id_konversi, mk_asal, sks_asal, nilai_asal, id_mk, nilai_tujuan } = req.body;
        const { id } = req.params;

        if (!mk_asal || !sks_asal || !nilai_asal || !id_mk || !nilai_tujuan) {
            console.log(req.body)
            return res.status(422).json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        const semesterData = await semesterQueries.findOne({
            [Op.and]: [
                { id_mahasiswa: id },
                { id_mk }
            ]
        });

        if (semesterData) {
            const mkData = await mataKuliahSchema.findOne({
                where: {
                    id_mk
                }
            });

            const { dataValues } = mkData;

            return res.status(422).json({
                status: "Warning",
                message: `Silahkan hapus mata kuliah "${dataValues.mata_kuliah}" pada tabel penempatan semester terlebih dahulu.`
            });
        }

        const data = await konveriQueries.findAll();
        const validasi = data.some(item => id_konversi === item.id_konversi);

        if (!validasi) {
            return res.json({
                status: "Error",
                message: "ID tidak ditemukan!"
            });
        }

        await konveriQueries.update({
            mk_asal,
            sks_asal,
            nilai_asal,
            id_mk,
            nilai_tujuan,
        }, {
            id_konversi
        });

        const { remainingMK, totalSKSAsal, totalSKSTujuan, totalMK } = await recap(id);

        await recapQueries.update({
            sisa_mk: remainingMK,
            total_hasil_konversi: totalMK,
            total_sks_asal: totalSKSAsal,
            total_sks_tujuan: totalSKSTujuan
        }, {
            id_mahasiswa: id
        });

        const data2 = await sequelize.query(`
            SELECT 
                tb_conversions.id_konversi, 
                tb_conversions.id_mahasiswa, 
                tb_conversions.mk_asal, 
                tb_conversions.sks_asal, 
                tb_conversions.nilai_asal, 
                tb_courses.mata_kuliah, 
                tb_courses.sks, 
                tb_conversions.nilai_tujuan, 
                tb_courses.id_mk 
            FROM tb_conversions 
            JOIN tb_courses ON tb_courses.id_mk = tb_conversions.id_mk 
            WHERE id_mahasiswa = :id 
            ORDER BY semester ASC`, {
            type: QueryTypes.SELECT,
            replacements: { id }
        });

        const rekapitulasiData = await recapQueries.findOne({
            id_mahasiswa: id
        });

        res.json({
            data: data2,
            status: "Success",
            message: "Berhasil mengubah hasil konversi",
            recapData: rekapitulasiData.dataValues
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const deleteKonversiController = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await konveriQueries.findAll();
        const validasi = data.some(item => id === item.id_mahasiswa);

        let dataKonversi = await sequelize.query("SELECT * FROM tb_recapitulations JOIN tb_students ON tb_students.id_mahasiswa = tb_recapitulations.id_mahasiswa");

        if (!validasi) {
            return res.json({
                status: "Error",
                message: "Terjadi Kesalahan!",
                data: dataKonversi[0]
            });
        }

        const semester = await semesterQueries.findAll({
            id_mahasiswa: id
        });

        await konveriQueries.delete({
            id_mahasiswa: id
        });

        await recapQueries.delete({
            id_mahasiswa: id
        });

        await documentQueries.delete({
            id_mahasiswa: id
        });

        await semesterQueries.delete({
            id_mahasiswa: id
        });

        await mahasiswaQueries.update({
            status: 'Pending'
        }, {
            id_mahasiswa: id
        });

        dataKonversi = await sequelize.query("SELECT * FROM tb_recapitulations JOIN tb_students ON tb_students.id_mahasiswa = tb_recapitulations.id_mahasiswa");

        res.json({
            status: "Success",
            message: "Berhasil menghapus hasil konversi",
            data: dataKonversi[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const deleteSpesifikKonversiController = async (req, res) => {
    try {
        const { id, id_mahasiswa } = req.params;

        if (!id || !id_mahasiswa) {
            return res.json({
                status: "Error",
                message: "Terjadi kesalahan!"
            });
        }

        await konveriQueries.delete({
            id_konversi: id
        });

        let data = await sequelize.query(`
            SELECT 
                tb_conversions.id_konversi, 
                tb_conversions.id_mahasiswa, 
                tb_conversions.mk_asal, 
                tb_conversions.sks_asal, 
                tb_conversions.nilai_asal, 
                tb_courses.mata_kuliah, 
                tb_courses.sks, 
                tb_conversions.nilai_tujuan, 
                tb_courses.id_mk 
            FROM tb_conversions 
            JOIN tb_courses ON tb_courses.id_mk = tb_conversions.id_mk 
            WHERE id_mahasiswa = :id 
            ORDER BY semester ASC`, {
            type: QueryTypes.SELECT,
            replacements: { id: id_mahasiswa }
        });

        if (data.length === 0) {
            await recapQueries.delete({
                id_mahasiswa
            });

            await semesterQueries.delete({
                id_mahasiswa
            });

            await mahasiswaQueries.update({
                status: 'Pending'
            }, {
                id_mahasiswa
            });

            return res.json({
                status: "Success",
                message: "Berhasil menghapus hasil konversi",
                data
            });
        }

        const { remainingMK, totalSKSAsal, totalSKSTujuan, totalMK } = await recap(id_mahasiswa);

        await recapQueries.update({
            sisa_mk: remainingMK,
            total_hasil_konversi: totalMK,
            total_sks_asal: totalSKSAsal,
            total_sks_tujuan: totalSKSTujuan
        }, {
            id_mahasiswa
        });

        data = await sequelize.query(`
            SELECT 
                tb_conversions.id_konversi, 
                tb_conversions.id_mahasiswa, 
                tb_conversions.mk_asal, 
                tb_conversions.sks_asal, 
                tb_conversions.nilai_asal, 
                tb_courses.mata_kuliah, 
                tb_courses.sks, 
                tb_conversions.nilai_tujuan, 
                tb_courses.id_mk 
            FROM tb_conversions 
            JOIN tb_courses ON tb_courses.id_mk = tb_conversions.id_mk 
            WHERE id_mahasiswa = :id 
            ORDER BY semester ASC`, {
            type: QueryTypes.SELECT,
            replacements: { id: id_mahasiswa }
        });

        const rekapitulasiData = await recapQueries.findOne({
            id_mahasiswa
        });

        res.json({
            status: "Success",
            message: "Berhasil menghapus hasil konversi",
            data,
            recapData: rekapitulasiData.dataValues
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            status: "Error"
        });
    }
}

const deleteMKPenempatanController = async (req, res) => {
    try {
        const { id, id_mahasiswa, semester } = req.params;

        let data = await sequelize.query(
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
                replacements: { id: id_mahasiswa },
            }
        );

        let groupedData = data.reduce((acc, item) => {
            const penempatan = item.penempatan;

            let placementGroup = acc.find((group) => group.penempatan === penempatan);

            if (!placementGroup) {
                placementGroup = { penempatan, courses: [], total_sks: 0 };
                acc.push(placementGroup);
            }

            placementGroup.total_sks += item.sks;

            placementGroup.courses.push({
                mata_kuliah: item.mata_kuliah,
                sks: item.sks,
                penempatan: item.penempatan,
                semester: item.semester,
                kode: item.id_semester,
                totalSKS: placementGroup.total_sks
            });

            return acc;
        }, []);

        let result = groupedData.map(group => group.courses);

        if (!id || !id_mahasiswa) {
            return res.json({
                status: "Error",
                message: "Terjadi kesalahan!",
                data: result
            });
        }

        await semesterSchema.destroy({
            where: {
                [Op.and]: [
                    { id_mahasiswa },
                    { id_semester: id }
                ]
            }
        });

        data = await sequelize.query(
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
                replacements: { id: id_mahasiswa },
            }
        );

        groupedData = data.reduce((acc, item) => {
            const penempatan = item.penempatan;

            let placementGroup = acc.find((group) => group.penempatan === penempatan);

            if (!placementGroup) {
                placementGroup = { penempatan, courses: [], total_sks: 0 };
                acc.push(placementGroup);
            }

            placementGroup.total_sks += item.sks;

            placementGroup.courses.push({
                mata_kuliah: item.mata_kuliah,
                sks: item.sks,
                penempatan: item.penempatan,
                semester: item.semester,
                kode: item.id_semester,
                totalSKS: placementGroup.total_sks
            });

            return acc;
        }, []);

        result = groupedData.map(group => group.courses);

        const mkData = await sequelize.query(`
            SELECT tb_courses.* 
            FROM tb_courses 
            LEFT JOIN tb_conversions 
            ON tb_courses.id_mk = tb_conversions.id_mk 
            AND tb_conversions.id_mahasiswa = :id 
            LEFT JOIN tb_semesters ON tb_semesters.id_mk = tb_courses.id_mk
            AND tb_semesters.id_mahasiswa = :id 
            WHERE tb_conversions.id_mk IS NULL AND tb_semesters.id_mk IS NULL
            ORDER BY tb_courses.semester ASC
        `, {
            type: QueryTypes.SELECT,
            replacements: { id: id_mahasiswa }
        });

        res.json({
            status: "Success",
            message: "Berhasil menghapus mata kuliah",
            data: result,
            mkData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            status: "Error"
        });
    }
}

const deletePenempatanController = async (req, res) => {
    try {
        const { penempatan, id_mahasiswa } = req.params;

        let data = await sequelize.query(
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
                replacements: { id: id_mahasiswa },
            }
        );

        let groupedData = data.reduce((acc, item) => {
            const penempatan = item.penempatan;

            let placementGroup = acc.find((group) => group.penempatan === penempatan);

            if (!placementGroup) {
                placementGroup = { penempatan, courses: [], total_sks: 0 };
                acc.push(placementGroup);
            }

            placementGroup.total_sks = placementGroup.total_sks + item.sks;

            placementGroup.courses.push({
                mata_kuliah: item.mata_kuliah,
                sks: item.sks,
                penempatan: item.penempatan,
                semester: item.semester,
                kode: item.id_semester,
                totalSKS: placementGroup.total_sks
            });

            return acc;
        }, []);

        let result = groupedData.map(group => group.courses);

        if (!penempatan || !id_mahasiswa) {
            return res.json({
                status: "Error",
                message: "Terjadi kesalahan!",
                data: result
            });
        }

        const hapus = await semesterSchema.destroy({
            where: {
                [Op.and]: [
                    { penempatan },
                    { id_mahasiswa }
                ]
            }
        });

        if(hapus > 0){
            data = await sequelize.query(
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
                    replacements: { id: id_mahasiswa },
                }
            );
    
            groupedData = data.reduce((acc, item) => {
                const penempatan = item.penempatan;
    
                let placementGroup = acc.find((group) => group.penempatan === penempatan);
    
                if (!placementGroup) {
                    placementGroup = { penempatan, courses: [], total_sks: 0 };
                    acc.push(placementGroup);
                }
    
                placementGroup.total_sks = placementGroup.total_sks + item.sks;
    
                placementGroup.courses.push({
                    mata_kuliah: item.mata_kuliah,
                    sks: item.sks,
                    penempatan: item.penempatan,
                    semester: item.semester,
                    kode: item.id_semester,
                    totalSKS: placementGroup.total_sks
                });
    
                return acc;
            }, []);
    
            result = groupedData.map(group => group.courses);
    
            console.log(result);
    
            const mkData = await sequelize.query(`
                SELECT tb_courses.* 
                FROM tb_courses 
                LEFT JOIN tb_conversions 
                ON tb_courses.id_mk = tb_conversions.id_mk 
                AND tb_conversions.id_mahasiswa = :id 
                LEFT JOIN tb_semesters ON tb_semesters.id_mk = tb_courses.id_mk
                AND tb_semesters.id_mahasiswa = :id 
                WHERE tb_conversions.id_mk IS NULL AND tb_semesters.id_mk IS NULL
                ORDER BY tb_courses.semester ASC
            `, {
                type: QueryTypes.SELECT,
                replacements: { id: id_mahasiswa }
            });

            res.json({
                status: "Success",
                message: "Berhasil menghapus hasil penempatan semester",
                data: result,
                mkData
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            status: "Error"
        });
    }
}


const generatePDFContoller = async (req, res) => {
    try {
        const { id } = req.params;

        let { dataValues } = await recapQueries.findOne({
            id_mahasiswa: id
        });

        const pdf = await generatePDF(id, 'laporan');

        if (dataValues.report) {
            fs.unlink(`./tmp/laporan/${dataValues.report}`, async (deleteErr) => {
                if (deleteErr) {
                    console.error('Error deleting the file:', deleteErr);
                } else {
                    console.log('File successfully deleted:', dataValues.report);

                    await recapQueries.update({
                        report: pdf
                    }, {
                        id_mahasiswa: id
                    });

                    if (req.path.includes('report')) {
                        const filePath = path.join(process.cwd(), `tmp/laporan`, pdf);
                        return res.sendFile(filePath,{
                            headers: {
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': `attachment; filename="${pdf}"`
                            }
                        }, (err) => {
                            if (err) {
                                console.log('File not found:', err);
                                res.status(404).send('File not found');
                            }
                        });
                    }
                }
            });
        }else{
            if (req.path.includes('report')) {
                await recapQueries.update({
                    report: pdf
                }, {
                    id_mahasiswa: id
                });

                const filePath = path.join(process.cwd(), `tmp/laporan`, pdf);
                return res.sendFile(filePath,{
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename="${pdf}"`
                    }
                }, (err) => {
                    if (err) {
                        console.log('File not found:', err);
                        res.status(404).send('File not found');
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            status: "Error"
        });
    }
}

const updateDateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { tanggal } = req.body;

        if(!id){
            return res.json({
                status: "Error",
                message: "Terjadi kesalahan."
            });
        }
        if(!tanggal){
            return res.json({
                status: "Warning",
                message: "Gagal mengubah tanggal."
            });
        }
        
        await recapQueries.update({
            tanggal
        }, {
            id_mahasiswa: id
        });

        res.json({
            status: "Success",
            message: "Berhasil mengubah tanggal.",
            tanggal
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            status: "Error"
        });
    }
}


module.exports = {
    konversiController,
    addKonversiController,
    updateKonversiController,
    deleteKonversiController,
    detailKonversiController,
    konversiReportController,
    penempatanController,
    penempatanMKController,
    semesterPostController,
    updateDateController,
    deleteSpesifikKonversiController,
    deleteMKPenempatanController,
    deletePenempatanController,
    recapController,
    generatePDFContoller
}
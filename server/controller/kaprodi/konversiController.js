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
const document = require("../../utils/generateDoc");
const laporanSchema = require("../../model/laporanSchema");
const semesterSchema = require("../../model/semesterSchema");

const konveriQueries = new Queries(konversiSchema);
const recapQueries = new Queries(recapSchema);
const documentQueries = new Queries(laporanSchema);
const mahasiswaQueries = new Queries(mahasiswaSchema);
const semesterQueries = new Queries(semesterSchema);

const konversiController = async (req, res) => {
    try {
        const data = await sequelize.query("SELECT * FROM tb_recapitulations JOIN tb_students ON tb_students.id_mahasiswa = tb_recapitulations.id_mahasiswa JOIN tb_documents ON tb_documents.id_mahasiswa = tb_recapitulations.id_mahasiswa", {
            type: QueryTypes.SELECT
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
            WHERE tb_conversions.id_mk IS NULL
        `, {
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

const penempatanController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await sequelize.query(`
            SELECT tb_semesters.semester, tb_courses.mata_kuliah, tb_courses.sks
            FROM tb_semesters 
            JOIN tb_courses 
            ON tb_courses.id_mk = tb_semesters.id_mk 
            WHERE id_mahasiswa = :id
        `, {
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

const semesterPostController = async (req, res) => {
    try {
        const { id } = req.params;
        const { mata_kuliah, semester } = req.body;

        let data = await sequelize.query(`
            SELECT tb_semesters.semester, tb_courses.mata_kuliah, tb_semesters.id_semester, tb_courses.sks
            FROM tb_semesters 
            JOIN tb_courses 
            ON tb_courses.id_mk = tb_semesters.id_mk 
            WHERE id_mahasiswa = :id
        `, {
            type: QueryTypes.SELECT,
            replacements: { id }
        });

        if (!mata_kuliah || !semester) {
            return res.json({
                status: "Warning",
                message: "Silahkan mengisi data terlebih dahulu",
                data
            });
        }
        const { totalSKSAsal, totalSKSTujuan } = await recap(id);

        const pdf = process.env.FILE_URL + "report/" + await generatePDF(id, totalSKSAsal, totalSKSTujuan);

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
            semester,
            id_mahasiswa: id
        });

        data = await sequelize.query(`
            SELECT tb_semesters.semester, tb_semesters.id_semester, tb_courses.mata_kuliah, tb_courses.sks
            FROM tb_semesters 
            JOIN tb_courses 
            ON tb_courses.id_mk = tb_semesters.id_mk 
            WHERE id_mahasiswa = :id
        `, {
            type: QueryTypes.SELECT,
            replacements: { id }
        });

        res.json({
            status: 'Success',
            message: 'Berhasil Memasukan mata kuliah',
            data: data
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

        const pdf = process.env.FILE_URL + "report/" + await document(id, totalSKSAsal, totalSKSTujuan);

        await recapQueries.update({
            report: pdf
        }, {
            id_mahasiswa: id
        });

        await mahasiswaQueries.update({
            status: 'Converted'
        }, {
            id_mahasiswa: id
        });

        let idDoc = await sequelize.query("SELECT * FROM tb_documents");
        idDoc = idDoc[0];

        const validasiDoc = idDoc.some(item => item.id_mahasiswa == id);

        if (validasiDoc) {
            documentQueries.delete({
                id_mahasiswa: id
            });
        }

        let docID;

        if (idDoc.length === 0) {
            docID = generateId(0, 'Doc');
        } else {
            idDoc = Number(idDoc[idDoc.length - 1].id_dokumen.substring(5));
            docID = generateId(idDoc, 'Doc');
        }

        await documentQueries.create({
            id_dokumen: docID,
            id_mahasiswa: id
        });

        const dataKonversi = await sequelize.query("SELECT * FROM tb_recapitulations JOIN tb_students ON tb_students.id_mahasiswa = tb_recapitulations.id_mahasiswa");

        res.json({
            status: "Success",
            message: "Berhasil menyimpan hasil konversi",
            data: dataKonversi[0]
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
        const { id_konversi, mk_asal, sks_asal, nilai_asal, id_mk, sks, nilai_tujuan } = req.body;
        const { id } = req.params;

        if (!mk_asal || !sks_asal || !nilai_asal || !id_mk || !sks || !nilai_tujuan) {
            console.log(req.body)
            return res.status(422).json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!"
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
            sks_tujuan: sks,
            nilai_tujuan,
        }, {
            id_konversi
        });

        const { remainingMK, totalSKS, totalMK } = await recap(id);

        const tanggal = getCurrentFormattedDate().formatDate2;
        const recapData = await recapQueries.findOne({ id_mahasiswa: id })

        await recapQueries.update({
            id_recap: recapData.id_recap,
            sisa_mk: remainingMK,
            total_hasil_konversi: totalMK,
            total_sks: totalSKS,
            report: process.env.FILE_URL + "report/" + await generatePDF(id),
            id_mahasiswa: id,
            tanggal
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

        console.log(data2)

        res.json({
            data: data2,
            status: "Success",
            message: "Berhasil mengubah hasil konversi"
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
        const { id, idkonversi } = req.params;

        const data = await konveriQueries.findAll();
        const validasi = data.some(item => id === item.id_mahasiswa);

        let dataKonversi = await sequelize.query("SELECT * FROM tb_recapitulations JOIN tb_students ON tb_students.id_mahasiswa = tb_recapitulations.id_mahasiswa");

        if (!validasi) {
            return res.json({
                status: "Error",
                message: "ID tidak ditemukan!",
                data: dataKonversi[0]
            });
        }

        await konveriQueries.delete({
            id_mahasiswa: id
        });

        await recapQueries.delete({
            id_mahasiswa: id
        });

        await documentQueries.delete({
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

const deletePreviewController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.json({
                status: "Error",
                message: "Terjadi kesalahan!"
            });
        }

        await konveriQueries.delete({
            id_mahasiswa: id
        });

        await recapQueries.delete({
            id_mahasiswa: id
        });

        await mahasiswaQueries.update({
            status: "Pending"
        }, {
            id_mahasiswa: id
        });

        res.json({
            status: "success",
            message: "Berhasil menghapus riwayat hasil konversi"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const editDetailController = async (req, res) => {
    try {
        // const { id } = req.params;
        // const { mk_asal, sks_asal, nilai_asal, sks, nilai_tujuan, id_mk } = req.body;

        // console.log(req.body);

        // konveriQueries.update();

        // res.json({
        //     status: "success",
        //     message: "Berhasil mengubah konversi"
        // });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    konversiController,
    addKonversiController,
    updateKonversiController,
    deleteKonversiController,
    deletePreviewController,
    detailKonversiController,
    konversiReportController,
    penempatanController,
    penempatanMKController,
    semesterPostController,
    editDetailController,
}
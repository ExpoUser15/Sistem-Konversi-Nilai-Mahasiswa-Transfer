const { Op } = require("sequelize");
const generateId = require("../../functions/generateId");
const { createLog } = require("../../functions/logActivity");
const recap = require("../../functions/recap");
const konversiSchema = require("../../model/konversiSchema");
const logActivitySchema = require("../../model/logActivitySchema");
const recapSchema = require("../../model/recapSchema");
const Queries = require("../../queries/queries");
const { getCurrentFormattedDate } = require("../../utils/time");
const generatePDF = require("../../utils/generateReport");
const mahasiswaSchema = require("../../model/mahasiswaSchema");
const sequelize = require("../../config/db");
const document = require("../../utils/generateDoc");
const laporanSchema = require("../../model/laporanSchema");

const konveriQueries = new Queries(konversiSchema);
const recapQueries = new Queries(recapSchema);
const logSchema = new Queries(logActivitySchema);
const documentQueries = new Queries(laporanSchema);
const mahasiswaQueries = new Queries(mahasiswaSchema);

let dataId;

const konversiController = async (req, res) => {
    try {
        dataId = req.data.data.id;

        await createLog(logSchema, {
            ket: "Mengakses halaman konversi",
            idUser: req.data.data.id
        });

        const data = await sequelize.query("SELECT * FROM tb_recapitulations JOIN tb_students ON tb_students.id_mahasiswa = tb_recapitulations.id_mahasiswa");

        res.json({
            auth: req.data,
            data: data[0]
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

        const pdf = process.env.FILE_URL + "report/" + await generatePDF(id, totalSKSAsal, totalSKSTujuan);
        const doc = process.env.FILE_URL + "doc/" + await document(id);
        console.log(doc);

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

        let docID;

        if (idDoc.length === 0) {
            docID = generateId(0, 'Doc');
        } else {
            idDoc = Number(idDoc[idDoc.length - 1].id_dokumen.substring(5));
            docID = generateId(idDoc, 'Doc');
        }

        await documentQueries.create({
            id_dokumen: docID,
            dokumen: doc,
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
        const { mk_asal, sks_asal, nilai_asal, id_mk, sks_tujuan, nilai_tujuan } = req.body.data;
        const { semester } = req.body;
        const { id, idkonversi } = req.params;

        if (!mk_asal || !sks_asal || !nilai_asal || !id_mk || !sks_tujuan || !nilai_tujuan) {
            await createLog(logSchema, {
                ket: "Gagal mengubah hasil konversi",
                idUser: dataId
            });

            return res.json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        const data = await konveriQueries.findAll();
        const validasi = data.some(item => idkonversi === item.id_konversi && id === item.id_mahasiswa);

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
            sks_tujuan,
            nilai_tujuan,
            id_mahasiswa: id,
        }, {
            [Op.and]: [
                { id_mahasiswa: id },
                { id_konversi: idkonversi }
            ]
        });

        const { remainingMK, totalSKS, totalMK } = await recap(id);

        const tanggal = getCurrentFormattedDate().formatDate2;
        const recapData = await recapQueries.findOne({ id_mahasiswa: id })

        await recapQueries.update({
            id_recap: recapData.id_recap,
            sisa_mk: remainingMK,
            total_hasil_konversi: totalMK,
            total_sks: totalSKS,
            semester: !semester ? recapData.semester : semester,
            report: process.env.FILE_URL + "report/" + await generatePDF(id),
            id_mahasiswa: id,
            tanggal
        }, {
            id_mahasiswa: id
        });

        res.json({
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
            await createLog(logSchema, {
                ket: "Gagal menghapus preview konversi",
                idUser: dataId
            });

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

        await createLog(logSchema, {
            ket: "Berhasil menghapus riwayat hasil konversi",
            idUser: dataId
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

module.exports = {
    konversiController,
    addKonversiController,
    updateKonversiController,
    deleteKonversiController,
    deletePreviewController
}
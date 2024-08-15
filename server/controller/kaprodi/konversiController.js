const generateId = require("../../functions/generateId");
const { createLog } = require("../../functions/logActivity");
const recap = require("../../functions/recap");
const konversiSchema = require("../../model/konversiSchema");
const logActivitySchema = require("../../model/logActivitySchema");
const recapSchema = require("../../model/recapSchema");
const Queries = require("../../queries/queries");
const { getCurrentFormattedDate } = require("../../utils/time");

const konveriQueries = new Queries(konversiSchema);
const recapQueries = new Queries(recapSchema);
const logSchema = new Queries(logActivitySchema);

let data;

const konversiController = async (req, res) => {
    try {
        data = req.data.data.id;

        await createLog(logSchema, {
            ket: "Mengakses halaman konversi",
            idUser: req.data.data.id
        });

        const konversiData = await konveriQueries.findAll();

        res.json({
            auth: req.data,
            konversiData
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
            await createLog(logSchema, {
                ket: "Gagal menyimpan hasil konversi",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Terjadi duplikasi data!"
            });
        }

        const { hasil, semester } = req.body;
        const { id } = req.params;

        let error;

        for (var i = 0; i < hasil.length; i++) {
            const { mk_asal, sks_asal, nilai_asal, id_mk, sks_tujuan, nilai_tujuan } = hasil[i];
            if (!mk_asal || !sks_asal || !nilai_asal || !id_mk || !sks_tujuan || !nilai_tujuan) {
                error = true;
                break;
            }
            error = false;
        }

        if (error) {
            await createLog(logSchema, {
                ket: "Gagal menambahkan konversi baru",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Data tidak lengkap. Silahkan cek terlebih dahulu!"
            });
        }

        for (var i = 0; i < hasil.length; i++) {
            const { mk_asal, sks_asal, nilai_asal, id_mk, sks_tujuan, nilai_tujuan } = hasil[i];

            let konversiId = await konveriQueries.findAll();
            let idKonversi;

            if (konversiId.length === 0) {
                idKonversi = generateId(0, 'K');
            } else {
                konversiId = Number(konversiId[konversiId.length - 1].id_konversi.substring(1));
                idKonversi = generateId(konversiId, 'K');
            }

            const tanggal = getCurrentFormattedDate().formatDate2;

            await konveriQueries.create({
                id_konversi: idKonversi,
                mk_asal,
                sks_asal,
                nilai_asal,
                id_mk,
                sks_tujuan,
                nilai_tujuan,
                id_mahasiswa: id,
                tanggal
            });
        }

        const { remainingMK, totalSKS, totalMK } = await recap(id);

        let recapId = await recapQueries.findAll();
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
            total_sks: totalSKS,
            semester,
            id_mahasiswa: id,
            tanggal
        });

        await createLog(logSchema, {
            ket: "Berhasil menyimpan hasil konversi",
            idUser: data
        });

        res.json({
            status: "success",
            message: "Berhasil menyimpan hasil konversi"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const updateKonversiController = async (req, res) => {
    try {
        const { mk_asal, sks_asal, nilai_asal, id_mk, sks_tujuan, nilai_tujuan } = req.body;
        const { id } = req.params;

        if (!mk_asal || !sks_asal || !nilai_asal || !id_mk || !sks_tujuan || !nilai_tujuan) {
            await createLog(logSchema, {
                ket: "Gagal mengubah hasil konversi",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        const data = await konveriQueries.findAll();
        const validasi = data.some(item => id === item.id_konversi);

        if (!validasi) {
            await createLog(logSchema, {
                ket: "Gagal mengubah hasil konversi",
                idUser: data
            });

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
            id_mahasiswa: id
        });

        await createLog(logSchema, {
            ket: "Berhasil mengubah hasil konversi",
            idUser: data
        });

        res.json({
            status: "success",
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
        const { id } = req.params;

        const data = await konveriQueries.findAll();
        const validasi = data.some(item => id === item.id_konversi);

        if (!validasi) {
            await createLog(logSchema, {
                ket: "Gagal menghapus hasil konversi",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "ID tidak ditemukan!"
            });
        }

        await konveriQueries.delete({
            id_mahasiswa: id
        });

        await createLog(logSchema, {
            ket: "Berhasil menghapus hasil konversi",
            idUser: data
        });

        res.json({
            status: "success",
            message: "Berhasil menghapus hasil konversi"
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
    deleteKonversiController
}
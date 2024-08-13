const { Op } = require("sequelize");
const { createLog } = require("../../functions/logActivity");
const logActivitySchema = require("../../model/logActivitySchema");
const mataKuliahSchema = require("../../model/mataKuliahSchema");
const Queries = require("../../queries/queries");

const mkQueries = new Queries(mataKuliahSchema);
const logSchema = new Queries(logActivitySchema);

let data;

const mataKuliahController = async (req, res) => {
    try {
        const mkData = await mkQueries.findAll();

        data = req.data.data.id;

        await createLog(logSchema, {
            ket: "Mengakses halaman mata kuliah",
            idUser: req.data.data.id
        });

        res.json({
            auth: req.data.status,
            mkData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const addMataKuliahController = async (req, res) => {
    try {
        const { id_mk, mata_kuliah, sks, semester } = req.body;

        if (!id_mk || !mata_kuliah || !sks || !semester) {
            await createLog(logSchema, {
                ket: "Gagal menambahkan mata kuliah baru",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

       await mkQueries.create({
            id_mk,
            mata_kuliah,
            sks,
            semester
        });

        await createLog(logSchema, {
            ket: `Menambahkan mata kuliah '${mata_kuliah}'`,
            idUser: data
        });

        res.json({
            status: "success",
            message: `Berhasil menambahkan mata kuliah '${mata_kuliah}'`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const deleteMataKuliahController = async (req, res) => {
    try {
        const { id } = req.params;

        const mk = await mkQueries.findOne({
            id_mk: id
        });

        if(!mk){
            await createLog(logSchema, {
                ket: `Gagal menghapus: mata kuliah tidak ada.`,
                idUser: data
            });

            return res.json({
                status: "Error",
                message: 'Mata kuliah yang ingin dihapus tidak ada!'
            });
        }

        await mkQueries.delete({
            id_mk: id
        });

        await createLog(logSchema, {
            ket: `Menghapus mata kuliah '${mk.dataValues.mata_kuliah}'`,
            idUser: data
        });

        res.json({
            status: "success",
            message: `Berhasil menghapus mata kuliah '${mk.dataValues.mata_kuliah}'`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const updateMataKuliahController = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_mk, mata_kuliah, sks, semester } = req.body;

        if (!id_mk || !mata_kuliah || !sks || !semester) {
            await createLog(logSchema, {
                ket: "Gagal mengubah data mata kuliah",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        let mkData = await mkQueries.findOne({ 
            [Op.or]: [
                { id_mk },
                { mata_kuliah }
            ]
        });

        if(mkData){
            await createLog(logSchema, {
                ket: `Gagal menambahkan mata kuliah '${mata_kuliah}'`,
                idUser: data
            });

            return res.json({
                status: "Error",
                message: 'ID atau nama Mata kuliah sudah ada'
            });
        }

       await mkQueries.update({
            id_mk,
            mata_kuliah,
            sks,
            semester
        }, {
            id_mk: id
        });

        await createLog(logSchema, {
            ket: `Mengubah mata kuliah data '${mata_kuliah}'`,
            idUser: data
        });

        res.json({
            status: "success",
            message: `Berhasil mengubah`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const addKonversiController = (req, res) => {
    try {
        // Memastikan req.files dan req.body telah diinisialisasi
        console.log('Files:', req.files);
        console.log('Body:', req.body);

        // Memeriksa apakah req.data ada sebelum mengakses status
        const authStatus = req.data ? req.data.status : null;

        res.json({
            auth: authStatus || "Status not available"
        });
    } catch (error) {
        console.error('Error in konversiController:', error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    mataKuliahController,
    addMataKuliahController,
    deleteMataKuliahController,
    updateMataKuliahController,
    addKonversiController
}
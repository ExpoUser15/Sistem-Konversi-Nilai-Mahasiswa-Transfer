const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/db");
const laporanSchema = require("../../model/laporanSchema");
const Queries = require("../../queries/queries");
const recapSchema = require("../../model/recapSchema");
const generateId = require("../../functions/generateId");
const document = require("../../utils/generateDoc");

const dokumenQueries = new Queries(laporanSchema);

const laporanController = async (req, res) => {
    try {
        const mhs = await sequelize.query("SELECT * FROM tb_documents JOIN tb_students ON tb_students.id_mahasiswa = tb_documents.id_mahasiswa JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa JOIN tb_recapitulations ON tb_recapitulations.id_mahasiswa = tb_students.id_mahasiswa");

        console.log(mhs);

        return res.json({
            data: mhs[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const laporanPostController = async (req, res) => {
    try {
        const { id } = req.params;
        const { form } = req.files;

        let mhs = await sequelize.query("SELECT * FROM tb_documents JOIN tb_students ON tb_students.id_mahasiswa = tb_documents.id_mahasiswa JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa");

        if (!form) {
            return res.json({
                status: 'Warning',
                message: 'Silahkan memasukan gambar telebih dahulu',
                data: mhs[0]
            });
        }

        if (!id) {
            return res.json({
                status: 'Warning',
                message: 'ID tidak ditemukan',
                data: mhs[0]
            });
        }

        await dokumenQueries.update({
            formulir: process.env.FILE_URL + form[0].filename,
        }, {
            id_dokumen: id
        });

        mhs = await sequelize.query("SELECT * FROM tb_documents JOIN tb_students ON tb_students.id_mahasiswa = tb_documents.id_mahasiswa JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa");

        return res.json({
            status: 'Success',
            message: 'Berhasil mengupload',
            data: mhs[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const transkripPostController = async (req, res) => {
    try {
        const { id } = req.params;
        const { form } = req.files;

        let mhs = await sequelize.query("SELECT * FROM tb_documents JOIN tb_students ON tb_students.id_mahasiswa = tb_documents.id_mahasiswa JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa");

        if (!form) {
            return res.json({
                status: 'Warning',
                message: 'Silahkan memasukan gambar telebih dahulu',
                data: mhs[0]
            });
        }

        if (!id) {
            return res.json({
                status: 'Warning',
                message: 'ID tidak ditemukan',
                data: mhs[0]
            });
        }

        const doc = process.env.FILE_URL + "doc/" + await document(id, form[0].filename);

        await dokumenQueries.update({
            dokumen: doc,
            daftar_konversi: process.env.FILE_URL + form[0].filename,
        }, {
            id_mahasiswa: id
        });
        
        mhs = await sequelize.query("SELECT * FROM tb_documents JOIN tb_students ON tb_students.id_mahasiswa = tb_documents.id_mahasiswa JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa");

        return res.json({
            status: 'Success',
            message: 'Berhasil mengupload',
            data: mhs[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const searchLaporan = async (req, res) => {
    try {
        const { search } = req.body;

        const data = await sequelize.query(
            "SELECT * FROM tb_documents JOIN tb_students ON tb_students.id_mahasiswa = tb_documents.id_mahasiswa WHERE nama LIKE :search",
            {
                type: QueryTypes.SELECT,
                replacements: { search: `%${search}%` }
            }
        );

        return res.json({
            search: true,
            data: data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    laporanController,
    laporanPostController,
    searchLaporan,
    transkripPostController
}
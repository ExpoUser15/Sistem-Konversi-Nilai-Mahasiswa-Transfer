const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { deleteFile } = require("../../functions/deleteFile");
const generateId = require("../../functions/generateId");
const { createLog } = require("../../functions/logActivity");
const { upload } = require("../../middleware/fileHandler");
const berkasSchema = require("../../model/berkasSchema");
const logActivitySchema = require("../../model/logActivitySchema");
const mahasiswaSchema = require("../../model/mahasiswaSchema");
const Queries = require("../../queries/queries");
const { getCurrentFormattedDate } = require("../../utils/time");
const konversiSchema = require("../../model/konversiSchema");
const laporanSchema = require("../../model/laporanSchema");
const recapSchema = require("../../model/recapSchema");

const mahasiswaQueries = new Queries(mahasiswaSchema);
const berkasQueries = new Queries(berkasSchema);
const documentQueries = new Queries(laporanSchema);
const konveriQueries = new Queries(konversiSchema);
const recapQueries = new Queries(recapSchema);


const mahasiswaController = async (req, res) => {
    try {
        const { type, page } = req.params;

        if (type === 'all') {
            const mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal ASC");

            return res.json({
                auth: req.data.status,
                data: mahasiswaData[0]
            });
        }

        if (type === 'recent') {
            const mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal DESC LIMIT 10");

            return res.json({
                data: mahasiswaData[0]
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const addMahasiswaController = async (req, res) => {
    try {
        const { nama, email, nim, pt_asal, fakultas, prodi, prodi_tujuan } = req.body;
        const { kk, ktp, ijazah, transkrip, surat_pindah } = req.files;

        let mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal ASC");

        if (!nama || !email || !pt_asal || !fakultas || !prodi || !prodi_tujuan) {

            return res.status(422).json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!",
                data: mahasiswaData[0]
            });
        }

        if (!kk || !ktp || !ijazah || !transkrip || !surat_pindah) {

            return res.status(422).json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!",
                data: mahasiswaData[0]
            });
        }

        for (const key in req.files) {
            if (req.files[key][0].mimetype !== 'image/jpeg' && req.files[key][0].mimetype !== 'image/png') {
                return res.status(422).json({
                    status: 'Error',
                    message: `Masukan gambar berupa PNG atau JPG/JPEG`,
                    data: mahasiswaData[0]
                });
            }
        }

        const nimExist = await sequelize.query('SELECT * FROM tb_students WHERE nim = :nim', {
            type: QueryTypes.SELECT,
            replacements: { nim }
        });

        if(nimExist.length === 1){
            return res.status(422).json({
                status: 'Warning',
                message: `NIM sudah ada silahkan masukan NIM yang baru`,
                data: mahasiswaData[0]
            });
        }

        let mahasiswaId = await mahasiswaQueries.findAll();
        let idMahasiswa

        if (mahasiswaId.length === 0) {
            idMahasiswa = generateId(0, 'MT');
        } else {
            mahasiswaId = Number(mahasiswaId[mahasiswaId.length - 1].id_mahasiswa.substring(2));
            idMahasiswa = generateId(mahasiswaId, 'MT');
        }

        const idBerkas = generateId(mahasiswaId, 'File');
        const tanggal = getCurrentFormattedDate().formatDate2;

        await mahasiswaQueries.create({
            id_mahasiswa: idMahasiswa,
            nama,
            nim: !nim ? '-' : nim,
            email,
            pt_asal,
            fakultas,
            prodi,
            prodi_tujuan,
            tanggal,
            status: "Pending"
        });

        await berkasQueries.create({
            id_berkas: idBerkas,
            transkrip_nilai: process.env.FILE_URL + transkrip[0].filename,
            kk: process.env.FILE_URL + kk[0].filename,
            ktp: process.env.FILE_URL + ktp[0].filename,
            ijazah: process.env.FILE_URL + ijazah[0].filename,
            surat_pindah: process.env.FILE_URL + surat_pindah[0].filename,
            id_mahasiswa: idMahasiswa
        });

        mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal ASC");

        res.json({
            status: "Success",
            message: "Berhasil menambahkan mahasiswa baru",
            data: mahasiswaData[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const deleteMahasiswaController = async (req, res) => {
    try {
        const id = req.params.id;

        let mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal ASC");

        if (!id) {

            return res.status(422).json({
                status: "Error",
                message: "Gagal menghapus mahasiswa",
                data: mahasiswaData[0]
            });
        }

        const fileArr = ['ijazah', 'kk', 'ktp', 'surat_pindah', 'transkrip_nilai'];
        const berkas = await berkasQueries.findOne({ id_mahasiswa: id });

        deleteFile(berkas, fileArr);

        await mahasiswaQueries.delete({
            id_mahasiswa: id
        });

        const kon = sequelize.query("SELECT * FROM tb_conversions WHERE id_mahasiswa = :id", {
            replacements: { id },
            type: QueryTypes.SELECT
        }); 

        const doc = sequelize.query("SELECT * FROM tb_documents WHERE id_mahasiswa = :id", {
            replacements: { id },
            type: QueryTypes.SELECT
        }); 

        const recap = sequelize.query("SELECT * FROM tb_recapitulations WHERE id_mahasiswa = :id", {
            replacements: { id },
            type: QueryTypes.SELECT
        }); 

        if(kon[0]){
            await konveriQueries.delete({
                id_mahasiswa: id
            });
        }

        if(doc[0]){
            await documentQueries.delete({
                id_mahasiswa: id
            });
        }

        if(recap[0]){
            await recapQueries.delete({
                id_mahasiswa: id
            });
        }

        mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal ASC");

        return res.json({
            status: "Success",
            message: "Berhasil menghapus mahasiswa",
            data: mahasiswaData[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const updateMahasiswaController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, email, nim, pt_asal, fakultas, prodi, prodi_tujuan } = req.body;

        let mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal ASC");

        if (!id) {

            return res.status(422).json({
                status: "Error",
                message: "Terjadi Kesalahan",
                data: mahasiswaData[0]
            });
        }

        if (!nama || !email || !pt_asal || !fakultas || !prodi || !prodi_tujuan) {

            return res.status(422).json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!",
                data: mahasiswaData[0]
            });
        }

        const data = await mahasiswaQueries.findAll();
        const validasi = data.some(item => id === item.id_mahasiswa);

        if (!validasi) {

            return res.status(422).json({
                status: "Error",
                message: "ID tidak ditemukan!",
                data: mahasiswaData[0]
            });
        }

        await mahasiswaQueries.update({
            id_mahasiswa: id,
            nama,
            email,
            nim,
            pt_asal,
            fakultas,
            prodi,
            prodi_tujuan,
        }, {
            id_mahasiswa: id
        });

        mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal ASC");

        return res.json({
            status: "Success",
            message: "Berhasil mengubah data mahasiswa",
            data: mahasiswaData[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const updateBerkasController = async (req, res) => {
    try {
        const { id, fileID } = req.params;
        const { ktp, kk, ijazah, surat_pindah, transkrip } = req.files;

        let mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal ASC");

        if (!ktp && !kk && !ijazah && !surat_pindah && !transkrip) {
            return res.status(422).json({
                status: "Warning",
                message: "Silahkan masukan gambar terlebih dahulu!",
                data: mahasiswaData[0]
            });
        }

        const keysName = Object.keys(req.files);

        if (req.files[keysName[0]][0].mimetype !== 'image/jpeg' && req.files[keysName[0]][0].mimetype !== 'image/png') {

            return res.status(422).json({
                status: "Warning",
                message: "Masukan gambar berupa PNG atau JPG/JPEG",
                data: mahasiswaData[0]
            });
        }

        const berkas = {};
        berkas[keysName[0] === 'transkrip' ? 'transkrip_nilai' : keysName[0]] = `${process.env.FILE_URL}${req.files[keysName[0]][0].filename}`;

        if (!id || !fileID) {

            return res.status(422).json({
                status: "Error",
                message: "Terjadi Kesalahan",
                data: mahasiswaData[0]
            });
        }

        const berkasData = await berkasQueries.findAll();
        const validasi = berkasData.some(item => fileID === item.id_berkas);

        if (!validasi) {
            return res.json({
                status: "Error",
                message: "Gagal: ID tidak ditemukan!",
                data: mahasiswaData[0]
            });
        }

        await berkasQueries.update(berkas, {
            id_berkas: fileID
        });

        mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa ORDER BY tanggal ASC");

        console.log(mahasiswaData);

        return res.json({
            status: "Success",
            message: "Berhasil mengubah gambar",
            data: mahasiswaData[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const searchingMahasiswa = async (req, res) => {
    try {
        const { search } = req.body;

        const mahasiswaData = await sequelize.query(
            "SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa WHERE nama LIKE :search OR tanggal LIKE :search ORDER BY tanggal ASC",
            {
                type: QueryTypes.SELECT,
                replacements: { search: `%${search}%` }
            }
        );

        return res.json({
            search: true,
            data: mahasiswaData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    mahasiswaController,
    addMahasiswaController,
    deleteMahasiswaController,
    updateMahasiswaController,
    updateBerkasController,
    searchingMahasiswa
}
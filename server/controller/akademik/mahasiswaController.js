const sequelize = require("../../config/db");
const generateId = require("../../functions/generateId");
const { createLog } = require("../../functions/logActivity");
const { upload } = require("../../middleware/fileHandler");
const berkasSchema = require("../../model/berkasSchema");
const logActivitySchema = require("../../model/logActivitySchema");
const mahasiswaSchema = require("../../model/mahasiswaSchema");
const Queries = require("../../queries/queries");
const { getCurrentFormattedDate } = require("../../utils/time");

const mahasiswaQueries = new Queries(mahasiswaSchema);
const berkasQueries = new Queries(berkasSchema);
const logSchema = new Queries(logActivitySchema);

let data;

const mahasiswaController = async (req, res) => {
    try {
        const mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa");

        data = req.data.data.id;

        await createLog(logSchema, {
            ket: "Mengakses halaman mahasiswa",
            idUser: req.data.data.id
        });

        res.json({
            auth: req.data.status,
            mahasiswaData,
        });
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

        if (!nama || !email || !nim || !pt_asal || !fakultas || !prodi || !prodi_tujuan) {
            await createLog(logSchema, {
                ket: "Gagal menambahkan mahasiswa baru",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        if (!kk || !ktp || !ijazah || !transkrip || !surat_pindah) {
            await createLog(logSchema, {
                ket: "Gagal menambahkan mahasiswa baru",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        // console.log(req.files);

        for(const key in req.files){
            if(req.files[key][0].mimetype !== 'image/jpeg' && req.files[key][0].mimetype !== 'image/png'){
                return res.json({
                    status: 'Error',
                    message: `Masukan gambar berupa PNG atau JPG/JPEG`
                });
            }
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
            nim,
            email,
            pt_asal,
            fakultas,
            prodi,
            prodi_tujuan,
            tanggal
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

        await createLog(logSchema, {
            ket: "Menambahkan mahasiswa baru",
            idUser: data
        });

        res.json({
            status: "success",
            message: "Berhasil menambahkan mahasiswa baru"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const deleteMahasiswaController = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            await createLog(logSchema, {
                ket: "Gagal menghapus mahasiswa",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Gagal menghapus mahasiswa"
            });
        }

        mahasiswaQueries.delete({
            id_mahasiswa: id
        });

        await createLog(logSchema, {
            ket: "Menghapus mahasiswa",
            idUser: data
        });

        return res.json({
            status: "Success",
            message: "Berhasil menghapus mahasiswa"
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
        const { id_mahasiswa, nama, email, nim, pt_asal, fakultas, prodi, prodi_tujuan } = req.body;

        if (!id) {
            await createLog(logSchema, {
                ket: "Gagal mengubah mahasiswa baru",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Terjadi Kesalahan"
            });
        }

        if (!nama || !email || !nim || !pt_asal || !fakultas || !prodi || !prodi_tujuan) {
            await createLog(logSchema, {
                ket: "Gagal mengubah mahasiswa baru",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        const data = await mahasiswaQueries.findAll();
        const validasi = data.some(item => id === item.id_mahasiswa);

        if (!validasi) {
            await createLog(logSchema, {
                ket: "Gagal mengubah mahasiswa baru",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "ID tidak ditemukan!"
            });
        }

        await mahasiswaQueries.update({
            id_mahasiswa,
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

        return res.json({
            status: "Success",
            message: "Berhasil mengubah mahasiswa"
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
        const files = req.files;

        const keysName = Object.keys(files);

        if(files[keysName[0]][0].mimetype !== 'image/jpeg' || files[keysName[0]][0].mimetype !== 'image/png'){
            await createLog(logSchema, {
                ket: "Gagal mengubah gambar",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Masukan gambar berupa PNG atau JPG/JPEG"
            });
        }

        const berkas = {};
        berkas[keysName[0]] = `${process.env.FILE_URL}${files[keysName[0]][0].filename}`;

        if (!id || !fileID) {
            await createLog(logSchema, {
                ket: "Gagal mengubah gambar",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Terjadi Kesalahan"
            });
        }

        const berkasData = await berkasQueries.findAll();
        const validasi = berkasData.some(item => fileID === item.id_berkas);

        if (!validasi) {
            await createLog(logSchema, {
                ket: "Gagal mengubah berkas",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Gagal: ID tidak ditemukan!"
            });
        }

        await berkasQueries.update(berkas, {
            id_berkas: fileID
        });

        await createLog(logSchema, {
            ket: "Mengubah gambar",
            idUser: data
        });

        return res.json({
            status: "Success",
            message: "Berhasil mengubah gambar"
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
    updateBerkasController
}
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

        // data = req.data.data.id;

        // await createLog(logSchema, {
        //     ket: "Mengakses halaman mahasiswa",
        //     idUser: req.data.data.id
        // });

        res.json({
            // auth: req.data.status,
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

        if (!nama || !email || !pt_asal || !fakultas || !prodi || !prodi_tujuan) {
            // await createLog(logSchema, {
            //     ket: "Gagal menambahkan mahasiswa baru",
            //     idUser: data
            // });

            return res.status(422).json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        if (!kk || !ktp || !ijazah || !transkrip || !surat_pindah) {
            // await createLog(logSchema, {
            //     ket: "Gagal menambahkan mahasiswa baru",
            //     idUser: data
            // });

            return res.status(422).json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        for(const key in req.files){
            if(req.files[key][0].mimetype !== 'image/jpeg' && req.files[key][0].mimetype !== 'image/png'){
                return res.status(422).json({
                    status: 'Error',
                    message: `Masukan gambar berupa PNG atau JPG/JPEG`,
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

        // await createLog(logSchema, {
        //     ket: "Menambahkan mahasiswa baru",
        //     idUser: data
        // });

        const mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa");

        res.json({
            status: "Success",
            message: "Berhasil menambahkan mahasiswa baru",
            mahasiswaData
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

        if (!id) {
            // await createLog(logSchema, {
            //     ket: "Gagal menghapus mahasiswa",
            //     idUser: data
            // });

            return res.status(422).json({
                status: "Error",
                message: "Gagal menghapus mahasiswa"
            });
        }

        await mahasiswaQueries.delete({
            id_mahasiswa: id
        });

        // await createLog(logSchema, {
        //     ket: "Menghapus mahasiswa",
        //     idUser: data
        // });

        const mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa");

        return res.json({
            status: "Success",
            message: "Berhasil menghapus mahasiswa",
            mahasiswaData
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
        console.log(req.body)

        if (!id) {
            // await createLog(logSchema, {
            //     ket: "Gagal mengubah mahasiswa baru",
            //     idUser: data
            // });

            return res.status(422).json({
                status: "Error",
                message: "Terjadi Kesalahan"
            });
        }

        if (!nama || !email || !pt_asal || !fakultas || !prodi || !prodi_tujuan) {
            // await createLog(logSchema, {
            //     ket: "Gagal mengubah mahasiswa baru",
            //     idUser: data
            // });

            return res.status(422).json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        const data = await mahasiswaQueries.findAll();
        const validasi = data.some(item => id === item.id_mahasiswa);

        if (!validasi) {
            // await createLog(logSchema, {
            //     ket: "Gagal mengubah mahasiswa baru",
            //     idUser: data
            // });

            return res.status(422).json({
                status: "Error",
                message: "ID tidak ditemukan!"
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

        const mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa");

        return res.json({
            status: "Success",
            message: "Berhasil mengubah data mahasiswa",
            mahasiswaData
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

        console.log(req.files);

        if(!ktp && !kk && !ijazah && !surat_pindah && !transkrip){
            // await createLog(logSchema, {
            //     ket: "Gagal mengubah gambar",
            //     idUser: data
            // });

            return res.status(422).json({
                status: "Warning",
                message: "Silahkan masukan gambar terlebih dahulu!"
            });
        }
        
        const keysName = Object.keys(req.files);

        if(req.files[keysName[0]][0].mimetype !== 'image/jpeg' && req.files[keysName[0]][0].mimetype !== 'image/png'){
            // await createLog(logSchema, {
            //     ket: "Gagal mengubah gambar",
            //     idUser: data
            // });

            return res.status(422).json({
                status: "Warning",
                message: "Masukan gambar berupa PNG atau JPG/JPEG"
            });
        }

        const berkas = {};
        berkas[keysName[0] === 'transkrip' ? 'transkrip_nilai' : keysName[0]] = `${process.env.FILE_URL}${req.files[keysName[0]][0].filename}`;

        console.log('Berkas: ', berkas)

        if (!id || !fileID) {
            // await createLog(logSchema, {
            //     ket: "Gagal mengubah gambar",
            //     idUser: data
            // });

            return res.status(422).json({
                status: "Error",
                message: "Terjadi Kesalahan"
            });
        }

        const berkasData = await berkasQueries.findAll();
        const validasi = berkasData.some(item => fileID === item.id_berkas);

        if (!validasi) {
            // await createLog(logSchema, {
            //     ket: "Gagal mengubah berkas",
            //     idUser: data
            // });

            return res.json({
                status: "Error",
                message: "Gagal: ID tidak ditemukan!"
            });
        }

        await berkasQueries.update(berkas, {
            id_berkas: fileID
        });

        // await createLog(logSchema, {
        //     ket: "Mengubah gambar",
        //     idUser: data
        // });

        const mahasiswaData = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa");

        return res.json({
            status: "Success",
            message: "Berhasil mengubah gambar",
            mahasiswaData
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
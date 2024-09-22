const sequelize = require("../../config/db");
const laporanSchema = require("../../model/laporanSchema");
const Queries = require("../../queries/queries");

const dokumenQueries = new Queries(laporanSchema);

const laporanController = async (req, res) => {
    try {
        const mhs = await sequelize.query("SELECT * FROM tb_documents JOIN tb_students ON tb_students.id_mahasiswa = tb_documents.id_mahasiswa");
        
        return res.json({
            data: mhs[0]
        });
    } catch (error) {
        console.log(error);
    }
}

const laporanPostController = async (req, res) => {
    try {
       const { id } = req.params;
       const { form } = req.files;

       let mhs = await sequelize.query("SELECT * FROM tb_documents JOIN tb_students ON tb_students.id_mahasiswa = tb_documents.id_mahasiswa");
       console.log(mhs);

       if(!form){
        return res.json({
            status: 'Warning',
            message: 'Silahkan memasukan gambar telebih dahulu',
            data: mhs[0]
        });
       }

       if(!id){
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

       mhs = await sequelize.query("SELECT * FROM tb_documents JOIN tb_students ON tb_students.id_mahasiswa = tb_documents.id_mahasiswa");

       return res.json({
        status: 'Success',
        message: 'Berhasil mengupload',
        data: mhs[0]
    });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    laporanController,
    laporanPostController
}
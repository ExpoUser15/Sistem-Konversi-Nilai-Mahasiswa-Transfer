const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Queries = require("../../queries/queries");
const recapSchema = require("../../model/recapSchema");
const generatePDF = require("../../utils/generateReport");
const path = require('path');
const fs = require('fs');

const recapQueries = new Queries(recapSchema);

const laporanController = async (req, res) => {
    try {
        const mhs = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa JOIN tb_recapitulations ON tb_recapitulations.id_mahasiswa = tb_students.id_mahasiswa");

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

        let mhs = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa JOIN tb_recapitulations ON tb_recapitulations.id_mahasiswa = tb_students.id_mahasiswa");

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
                message: 'Terjadi kesalahan.',
                data: mhs[0]
            });
        }

        await recapQueries.update({
            upload: process.env.FILE_URL + "upload/" + form[0].filename,
        }, {
            id_mahasiswa: id
        });

        mhs = await sequelize.query("SELECT * FROM tb_students JOIN tb_files ON tb_files.id_mahasiswa = tb_students.id_mahasiswa JOIN tb_recapitulations ON tb_recapitulations.id_mahasiswa = tb_students.id_mahasiswa");

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
            "SELECT * FROM tb_students WHERE nama LIKE :search",
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


const generatePDFContoller2 = async (req, res) => {
    try {
        const { id } = req.params;

        let { dataValues } = await recapQueries.findOne({
            id_mahasiswa: id
        });

        const pdf = await generatePDF(id, 'formulir', 'all');

        const filePath = `./tmp/formulir/${dataValues.formulir}`;

        if (dataValues.formulir) {
            fs.unlink(filePath, async (deleteErr) => {
                if (deleteErr) {
                    console.error('Error deleting the file:', deleteErr);
                } else {
                    console.log('File successfully deleted:', dataValues.formulir);

                    await recapQueries.update({
                        formulir: pdf
                    }, {
                        id_mahasiswa: id
                    });

                    if (req.path.includes('report')) {
                        const filePath = path.join(process.cwd(), `tmp/formulir`, pdf);
                        return res.sendFile(filePath, {
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
        } else {
            if (req.path.includes('report')) {
                await recapQueries.update({
                    formulir: pdf
                }, {
                    id_mahasiswa: id
                });

                const filePath = path.join(process.cwd(), `tmp/formulir`, pdf);
                return res.sendFile(filePath, {
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
};

const reviewUploadController = async (req, res) => {
    try {
        const { id } = req.params;

        let { dataValues } = await recapQueries.findOne({
            id_mahasiswa: id
        });

        if(!id){
            res.status(422).json({
                message: "Terjadi Kesalahan",
                status: "Error"
            });
        }

        if (req.path.includes('upload')) {

            const filePath = path.join(process.cwd(), `tmp/form`, dataValues.upload);
            return res.sendFile(filePath, (err) => {
                if (err) {
                    console.log('File not found:', err);
                    res.status(404).send('File not found');
                }
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


module.exports = {
    laporanController,
    laporanPostController,
    searchLaporan,
    generatePDFContoller2,
    reviewUploadController
}
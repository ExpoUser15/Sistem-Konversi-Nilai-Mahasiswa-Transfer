const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/db");
const generateId = require("../../functions/generateId");
const pimpinanSchema = require("../../model/pimpinanSchema");
const Queries = require("../../queries/queries");

const pimpinanQueries = new Queries(pimpinanSchema);

const pimpinanController = async (req, res) => {
    try {
        const data = await pimpinanQueries.findAll();

        res.json({
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            status: "Error"
        });
    }
}


const addPimpinanController = async (req, res) => {
    try {
        const { kode, nama, jabatan } = req.body;

        let data = await pimpinanQueries.findAll();

        if(!nama || !jabatan || !kode){
            return res.status(422).json({
                status: 'Warning',
                message: 'Lengkapi form terlebih dahulu.',
                data
            });
        }

        const exitsKode = data.some(item => item.kode === kode);

        if(exitsKode){
            return res.status(422).json({
                status: 'Warning',
                message: 'Kode sudah ada.',
                data
            });
        }

        if(data.length + 1 > 4){
            return res.status(422).json({
                status: 'Warning',
                message: 'Maksimal data yang bisa dimasukan hanya empat.',
                data
            });
        }

        await pimpinanQueries.create({
            kode,
            nama,
            jabatan
        });

        data = await pimpinanQueries.findAll();

        res.json({
            status: 'Success',
            message: 'Berhasil menambah pimpinan.',
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            status: "Error"
        });
    }
}

const updatePimpinanController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, jabatan } = req.body;

        let data = await pimpinanQueries.findAll();

        if(!id){
            return res.status(422).json({
                status: 'Error',
                message: 'Terjadi Kesalahan.',
                data
            });
        }

        if(!nama || !jabatan){
            return res.status(422).json({
                status: 'Warning',
                message: 'Lengkapi form terlebih dahulu.',
                data
            });
        }

        await pimpinanQueries.update({
            nama,
            jabatan
        },{
            kode: id
        });

        data = await pimpinanQueries.findAll();

        res.json({
            status: 'Success',
            message: 'Berhasil mengubah pimpinan.',
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            status: "Error"
        });
    }
}

const deletePimpinanController = async (req, res) => {
    try {
        const { id } = req.params;

        let data = await pimpinanQueries.findAll();

        if(!id){
            return res.status(422).json({
                status: 'Error',
                message: 'Terjadi Kesalahan.',
                data
            });
        }

        await pimpinanQueries.delete({
            kode: id
        });

        data = await pimpinanQueries.findAll();

        res.json({
            status: 'Success',
            message: 'Berhasil menghapus pimpinan.',
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            status: "Error"
        });
    }
}

const searchingPimpinan = async (req, res) => {
    try {
        const { search } = req.body;

        const data = await sequelize.query(
            "SELECT * FROM tb_leaders WHERE nama LIKE :search OR jabatan LIKE :search ORDER BY nama ASC",
            {
                type: QueryTypes.SELECT,
                replacements: { search: `%${search}%` }
            }
        );

        return res.json({
            search: true,
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    pimpinanController,
    addPimpinanController,
    updatePimpinanController,
    deletePimpinanController,
    searchingPimpinan
}
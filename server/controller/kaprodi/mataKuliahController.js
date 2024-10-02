const { QueryTypes } = require("sequelize");
const mataKuliahSchema = require("../../model/mataKuliahSchema");
const Queries = require("../../queries/queries");
const generateId = require("../../functions/generateId");
const sequelize = require("../../config/db");

const mkQueries = new Queries(mataKuliahSchema);

const mataKuliahController = async (req, res) => {
    try {
        const mkData = await mkQueries.findAll();

        res.json({
            data: mkData
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

            return res.status(422).json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        let idUser;

        if (!id_mk) {
            let userId = await mkQueries.findAll();
            userId = Number(userId[userId.length - 1].id_mk.substring(2));
            if (userId.length === 0) {
                idUser = generateId(0, 'SI');
            } else {
                idUser = generateId(userId, 'SI');
            }
        }

       await mkQueries.create({
            id_mk: !id_mk ? idUser : id_mk,
            mata_kuliah,
            sks,
            semester
        });

        const mkData = await mkQueries.findAll();

        res.json({
            status: "Success",
            message: `Berhasil menambahkan mata kuliah '${mata_kuliah}'`,
            data: mkData
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

            return res.json({
                status: "Error",
                message: 'Mata kuliah yang ingin dihapus tidak ada!'
            });
        }

        await mkQueries.delete({
            id_mk: id
        });

        const mkData = await mkQueries.findAll();

        res.json({
            status: "Success",
            message: `Berhasil menghapus mata kuliah '${mk.dataValues.mata_kuliah}'`,
            data: mkData
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

        let data = await mkQueries.findAll();

        if (!id_mk || !mata_kuliah || !sks || !semester) {
            return res.json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!",
                data
            });
        }

       await mkQueries.update({
            id_mk: id_mk,
            mata_kuliah,
            sks,
            semester
        }, {
            id_mk: id
        });

        data = await mkQueries.findAll();
       
        res.json({
            status: "Success",
            message: `Berhasil mengubah mata kuliah`,
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'Error',
            message: "Server Error"
        });
    }
}

const searchingMK = async (req, res) => {
    try {
        const { search } = req.body;

        const mkData = await sequelize.query(
            "SELECT * FROM tb_courses WHERE id_mk LIKE :search OR mata_kuliah LIKE :search ORDER BY semester ASC",
            {
                type: QueryTypes.SELECT,
                replacements: { search: `%${search}%` }
            }
        );

        console.log(mkData);

        return res.json({
            search: true,
            data: mkData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    mataKuliahController,
    addMataKuliahController,
    deleteMataKuliahController,
    updateMataKuliahController,
    searchingMK
}
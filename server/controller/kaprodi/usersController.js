const { readLog, createLog } = require("../../functions/logActivity")
const logActivitySchema = require("../../model/logActivitySchema");
const usersSchema = require("../../model/usersSchema");
const Queries = require("../../queries/queries")
const bcrypt = require('bcrypt');

const logSchema = new Queries(logActivitySchema);
const userQueries = new Queries(usersSchema);

let data;

const usersController = async (req, res) => {
    try {
        data = req.data.data.id;

        await createLog(logSchema, {
            ket: "Mengakses Halaman Users",
            idUser: req.data.data.id
        });

        const usersData = await userQueries.findAll();

        console.log(usersData)

        res.json({
            payload: req.data,
            usersData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const addUsersController = async (req, res) => {
    try {
        const { username, password, user } = req.body;

        if (!username || !password || !user) {
            await createLog(logSchema, {
                ket: "Gagal menambahkan user baru",
                idUser: data
            });

            return res.json({
                status: "Error",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        bcrypt.hash(password, 10)
            .then(async hash => {
                await userQueries.create({
                    id_pengguna: "",
                    username,
                    password: hash,
                    user
                });

                await createLog(logSchema, {
                    ket: "Menambahkan user baru",
                    idUser: data
                });

                res.json({
                    status: "success",
                    message: 'Berhasil menambahkan data.'
                });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "Server Error"
                });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const deleteController = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userQueries.findOne({
            id_pengguna: id
        });

        await createLog(logSchema, {
            ket: `Menghapus user ${user.dataValues.username}`,
            idUser: data
        });

        await userQueries.delete({
            id_pengguna: id
        });

        res.json({
            status: "success",
            message: "Berhasil menghapus"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const updateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, user } = req.body;

        if (!username || !user) {
            await createLog(logSchema, {
                ket: `Gagal mengubah`,
                idUser: data
            });

            return res.json({
                status: "success",
                message: "Silahkan mengisikan form terlebih dahulu!"
            });
        }

        bcrypt.hash(password, 10)
            .then(async hash => {

                await userQueries.update({
                    id_pengguna: id,
                    username,
                    password: hash,
                    user
                }, {
                    id_pengguna: id
                });

                const userData = await userQueries.findOne({
                    id_pengguna: id
                });

                await createLog(logSchema, {
                    ket: `Mengubah user ${userData.dataValues.username}`,
                    idUser: data
                });

                res.json({
                    status: "success",
                    message: "Berhasil mengubah"
                });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "Server Error"
                });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    usersController,
    addUsersController,
    deleteController,
    updateController
}
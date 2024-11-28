const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/db");
const generateId = require("../../functions/generateId");
const usersSchema = require("../../model/usersSchema");
const Queries = require("../../queries/queries")
const bcrypt = require('bcrypt');

const userQueries = new Queries(usersSchema);

const usersController = async (req, res) => {
    try {
        const usersData = await userQueries.findAll();

        res.json({
            auth: req.data.status,
            data: usersData
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
        const { id, username, password, user } = req.body;

        if (!username || !password || !user) {
            const users = await userQueries.findAll();

            return res.json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!",
                data: users
            });
        }

        if (id) {
            let userData = await userQueries.findOne(
                { id_pengguna: id }
            );
            if (userData) {
                return res.json({
                    status: "Error",
                    message: 'ID user sudah ada'
                });
            }
        }

        let idUser;

        if (!id) {
            let userId = await userQueries.findAll();
            if (userId.length === 0) {
                idUser = generateId(0, 'K');
            } else {
                userId = Number(userId[userId.length - 1].id_pengguna.substring(1));
                idUser = generateId(userId, 'K');
            }
        }

        bcrypt.hash(password, 10)
            .then(async hash => {
                const idPengguna = !id ? idUser : id;
                await userQueries.create({
                    id_pengguna: idPengguna,
                    username,
                    password: hash,
                    user
                });

                const users = await userQueries.findAll();

                res.json({
                    status: "Success",
                    message: 'Berhasil menambahkan user',
                    data: users
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

        await userQueries.delete({
            id_pengguna: id
        });

        const user = await userQueries.findAll();

        res.json({
            status: "Success",
            message: "Berhasil menghapus user",
            data: user
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
        const { id_pengguna, username, password, user } = req.body;
        console.log(req.body);
        const { id } = req.params;

        if (!username || !user || !id_pengguna) {
            const userData = await userQueries.findAll();

            return res.json({
                status: "Warning",
                message: "Silahkan mengisikan form terlebih dahulu!",
                data: userData
            });
        }

        if (!password) {
            await userQueries.update({
                id_pengguna,
                username,
                user
            }, {
                id_pengguna: id
            });

            const userData = await userQueries.findAll();

            return res.json({
                status: "Success",
                message: "Berhasil mengubah user",
                data: userData
            });
        }

        bcrypt.hash(password, 10)
            .then(async hash => {
                await userQueries.update({
                    id_pengguna,
                    username,
                    password: hash,
                    user
                }, {
                    id_pengguna: id
                });

                const userData = await userQueries.findAll();

                res.json({
                    status: "Success",
                    message: "Berhasil mengubah",
                    data: userData
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

const searchingUsers = async (req, res) => {
    try {
        const { search } = req.body;

        const users = await sequelize.query(
            "SELECT * FROM tb_users WHERE id_pengguna LIKE :search OR username LIKE :search OR user LIKE :search ORDER BY username ASC",
            {
                type: QueryTypes.SELECT,
                replacements: { search: `%${search}%` }
            }
        );

        return res.json({
            search: true,
            data: users
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
    updateController,
    searchingUsers
}
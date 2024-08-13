const usersSchema = require("../model/usersSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Queries = require("../queries/queries");
const logActivitySchema = require("../model/logActivitySchema");
const { createLog } = require("../functions/logActivity");

const loginController = (req, res) => {
    res.json({
        auth: req.data,
    });
}

const postLoginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userQueries = new Queries(usersSchema);

        const logSchema = new Queries(logActivitySchema);

        const data = await userQueries.findOne({ username });

        if (!data) {
            createLog(logSchema, { 
                ket: `Login Gagal: Username atau password salah`,
                idUser: dataValues.id_pengguna
            });
            return res.json({
                status: "Error",
                message: "Username atau Password Salah!"
            });
        }

        const { dataValues } = data;

        bcrypt.compare(password, dataValues.password)
            .then(async result => {
                if (!result) {
                    createLog(logSchema, { 
                        ket: `Login Gagal: Username atau password salah`,
                        idUser: dataValues.id_pengguna
                    });
                    return res.json({
                        status: "Error",
                        message: "Username atau Password Salah!"
                    })
                }

                const token = jwt.sign({ 
                    username: dataValues.username, 
                    user: dataValues.user, 
                    id: dataValues.id_pengguna 
                }, process.env.SECRET_KEY, { expiresIn: '1d' });
            
                res.cookie("token", token);

                createLog(logSchema, { 
                    ket: `Berhasil melakukan login`,
                    idUser: dataValues.id_pengguna
                });

                res.json({
                    status: "success",
                });
            })
            .catch(err => {
                console.log(err);
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
    loginController,
    postLoginController
}
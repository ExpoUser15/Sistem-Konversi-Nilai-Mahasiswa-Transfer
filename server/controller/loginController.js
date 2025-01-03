const usersSchema = require("../model/usersSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Queries = require("../queries/queries");

const loginController = async (req, res) => {
    try {
        res.json({
            auth: req.data,
        });
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }

}

const postLoginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(422).json({
                status: "Warning",
                message: "Silahkan masukan Username atau Password terlebih dahulu!"
            });
        }

        const userQueries = new Queries(usersSchema);

        const data = await userQueries.findOne({ username });

        if (!data) {
            return res.status(422).json({
                status: "Warning",
                message: "Username atau Password Salah!"
            });
        }

        const { dataValues } = data;

        bcrypt.compare(password, dataValues.password)
            .then(async result => {
                if (!result) {
                    return res.status(422).json({
                        status: "Warning",
                        message: "Username atau Password Salah!"
                    });
                }

                const token = jwt.sign({
                    username: dataValues.username,
                    user: dataValues.user,
                    id: dataValues.id_pengguna
                }, process.env.SECRET_KEY, { expiresIn: '1d' });


                // dev cookie
                // res.cookie("token", token);

                res.cookie('token', token, {
                    httpOnly: true, 
                    secure: true, 
                    sameSite: 'None'
                });

                res.json({
                    status: "Success",
                    user: dataValues.user,
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
const usersSchema = require("../model/usersSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginController = (req, res) => {
    res.json({
        token: req.data,
    });
}

const postLoginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        const data = await usersSchema.findOne({ where: { username } });

        if (!data) {
            return res.json({
                status: "Error",
                message: "Username atau Password Salah!"
            });
        }

        const { dataValues } = data;

        bcrypt.compare(password, dataValues.password)
            .then(result => {
                if (!result) {
                    return res.json({
                        status: "Error",
                        message: "Username atau Password Salah!"
                    })
                }

                const token = jwt.sign({ username: dataValues.username, user: dataValues.user }, process.env.SECRET_KEY, { expiresIn: '1d' });
                res.cookie("token", token);

                res.json({
                    status: "success",
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500);
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
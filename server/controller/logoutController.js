const { createLog } = require("../functions/logActivity");
const logActivitySchema = require("../model/logActivitySchema");
const Queries = require("../queries/queries");
const jwt = require('jsonwebtoken');

const logSchema = new Queries(logActivitySchema);

const logoutController = async (req, res) => {
    try {
        const cookie = req.cookies;

        if(!cookie.token){
            return res.status(401).json({
                auth: "Unauthenticated!",
                message: "Terjadi Kesalahan!"
            });
        }

        jwt.verify(cookie.token, process.env.SECRET_KEY, async (err, decoded) => {
            await createLog(logSchema, {
                ket: "Berhasil logout",
                idUser: decoded.id
            });
        });
        
        res.clearCookie('token');
        res.json({
            auth: "Unauthenticated!",
            message: "Anda berhasil logout!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = logoutController;
const logActivitySchema = require("../model/logActivitySchema");
const Queries = require("../queries/queries");

const logoutController = async (req, res) => {
    try {
        const cookie = req.cookies;

        if(!cookie.token){
            return res.status(401).json({
                auth: "Unauthenticated!",
                status: 'Error',
                message: "Terjadi Kesalahan!"
            });
        }
        
        res.clearCookie('token');
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = logoutController;
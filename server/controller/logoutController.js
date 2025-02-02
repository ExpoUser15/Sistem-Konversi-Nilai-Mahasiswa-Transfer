const logoutController = async (req, res) => {
    try {
        const cookie = req.cookies;
        console.log("Logout: ", cookie);

        if(!cookie.token){
            return res.json({
                status: 'Error',
                message: "Terjadi Kesalahan!"
            });
        }
        
        res.clearCookie('token');
        res.clearCookie('PHPSESSID');
        res.clearCookie('_csrf');
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = logoutController;
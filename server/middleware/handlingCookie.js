const jwt = require('jsonwebtoken');

const handlingCookie = (req, res, next) => {
    try {
        const token = req.cookies;

        if (token.token) {
            jwt.verify(token.token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        res.clearCookie("token");
                        return req.status(419).json({
                            status: "Warning",
                            message: "Sesi anda telah berakhir, silahkan login kembali."
                        });
                    }
                    return res.status(401).json({
                        status: "Warning",
                        message: "Sesi anda telah berakhir, silahkan login kembali."
                    });
                }

                req.data = {
                    status: "Success",
                    data: {
                        username: decoded.username,
                        user: decoded.user
                    }
                };
                next();
            });
        } else {
            return res.status(401).json({
                status: "Warning",
                message: "Anda harus login terlebih dahulu."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }

}

module.exports = handlingCookie;
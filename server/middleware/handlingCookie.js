const jwt = require('jsonwebtoken');

const handlingCookie = (req, res, next) => {
    try {
        const token = req.cookies;

        if (token.token) {
            jwt.verify(token.token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        res.clearCookie("token");
                        return req.data = {
                            status: "Error",
                            message: "Sesi anda telah berakhir, silahkan login kembali."
                        };
                    }
                    return req.data = {
                        status: "Warning",
                        message: "Sesi anda telah berakhir, silahkan login kembali."
                    };
                }

                req.data = {
                    status: "Success",
                    data: {
                        id: decoded.id,
                        username: decoded.username,
                        user: decoded.user
                    }
                };
            });
        } else {
            req.data = {
                status: "Warning",
                message: "Sesi anda telah berakhir, silahkan login kembali."
            }
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }

}

module.exports = handlingCookie;
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
                            status: "Expired",
                            message: "Sesi anda telah berakhir, silahkan login kembali."
                        };
                    }
                    return req.data = {
                        status: "Unauthenticated",
                        message: "Silahkan login terlebih dahulu!"
                    };
                }

                req.data = {
                    status: "Authenticated",
                    data: {
                        id: decoded.id,
                        username: decoded.username,
                        user: decoded.user,
                        token: token.token
                    }
                };
            });
            next();
        } else {
            req.data = {
                status: "Unauthenticated",
                message: "Silahkan login terlebih dahulu!"
            }
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }

}

module.exports = handlingCookie;
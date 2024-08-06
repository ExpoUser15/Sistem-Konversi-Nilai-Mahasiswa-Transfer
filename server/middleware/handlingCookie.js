const jwt = require('jsonwebtoken');

const handlingCookie = (req, res, next) => {
    const token = req.cookies;

    if (token.token) {
        jwt.verify(token.token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    console.log(err.name);
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
                payload: {
                    username: decoded.username,
                    user: decoded.user
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
}

module.exports = handlingCookie;
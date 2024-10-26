const validateUserKaprodi = (req, res, next) => {
    try {
        if (req.data.status === 'Unauthenticated') {
            return res.json({
                auth: req.data,
            });
        } else if (req.data.data?.user !== 'Kaprodi') {
            return res.json({
                auth: {
                    status: 'Error',
                    message: 'Kamu bukan kaprodi!'
                },
            });
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const validateUserAkademik = (req, res, next) => {
    try {
        if (req.data.status === 'Unauthenticated') {
            return res.json({
                auth: req.data,
            });
        } else if (req.data.data.user !== 'Akademik') {
            return res.json({
                auth: {
                    status: 'Error',
                    message: 'Kamu bukan Kabiro Akademik!'
                },
            });
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    validateUserKaprodi,
    validateUserAkademik
};
const logActivitySchema = require("../../model/logActivitySchema");
const { readLog, createLog } = require("../../functions/logActivity");
const Queries = require("../../queries/queries");

const logSchema = new Queries(logActivitySchema);

const logController = async (req, res) => {
    try {
        await createLog(logSchema, {
            ket: "Mengakses halaman log aktvitas",
            idUser: req.data.data.id
        });

        const log = await readLog();
    
        res.json({
            auth: req.data.status,
            data: log,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = logController;
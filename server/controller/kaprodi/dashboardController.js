const sequelize = require("../../config/db");

const analyticsController = async (req, res) => {
    try {
        const countMK = await sequelize.query("SELECT COUNT(*) AS total_mk FROM tb_courses");
        const countStudents = await sequelize.query("SELECT COUNT(*) AS total_student FROM tb_students");
        // const avgConvert = await sequelize.query("SELECT AVG(*) AS avg FROM tb_");
        console.log(countMK);

        res.json({
            countMK,
            countStudents,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    analyticsController,
}
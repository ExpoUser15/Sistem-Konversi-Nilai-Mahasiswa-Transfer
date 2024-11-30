const sequelize = require("../../config/db");

const analyticsController = async (req, res) => {
    try {
        const countMK = await sequelize.query("SELECT COUNT(*) AS total_mk FROM tb_courses");
        const countStudents = await sequelize.query("SELECT COUNT(*) AS total_student FROM tb_students");
        const totalSKS = await sequelize.query(`
            SELECT SUM(tb_courses.sks) AS total_sks 
            FROM tb_courses 
        `);

        res.json({
            countMK,
            countStudents,
            totalSKS
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
const {getCurrentTime, getCurrentFormattedDate} = require("../utils/time");
const { v4: uuidv4 } = require('uuid');

async function createLog(schema, {ket, idUser}){
    const date = getCurrentFormattedDate();
    const time = getCurrentTime();
    const full = `${date.formatDate2} ${time}`;
    await schema.create({
        id_aktivitas: uuidv4(),
        keterangan: ket,
        tanggal: full,
        id_pengguna: idUser
    });
}

async function readLog(schema){
    const data = await schema.findAll();
    const val = data.map(item => item.dataValues);
    return val;
}

module.exports = {
    createLog,
    readLog
};
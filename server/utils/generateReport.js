const { jsPDF } = require('jspdf');
const fs = require('fs');
const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');
const Queries = require('../queries/queries');
const recapSchema = require('../model/recapSchema');
const { getCurrentFormattedDate } = require('./time');
const mahasiswaSchema = require('../model/mahasiswaSchema');
const proses = require('./prosesDataSemester');
require('jspdf-autotable');

require("dotenv").config();

const queriesStudents = new Queries(mahasiswaSchema);

async function generatePDF(id, sks_asal, sks_tujuan) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    doc.setFontSize(12);
    doc.text("DAFTAR KONVERSI NILAI MAHASISWA", 105, 10, null, null, 'center');

    doc.setFontSize(10);

    const mahasiswa = await queriesStudents.findOne({
        id_mahasiswa: id
    });

    // Header
    doc.text("PERGURUAN TINGGI ASAL", 15, 25);
    doc.text(`Nama PT : ${mahasiswa.dataValues.pt_asal}`, 15, 30);
    doc.text(`Fakultas : ${mahasiswa.dataValues.fakultas}`, 15, 35);
    doc.text(`Prodi : ${mahasiswa.dataValues.prodi}`, 15, 40);

    doc.text(`Nama Mahasiswa : ${mahasiswa.dataValues.nama}`, 130, 25, null, null);
    doc.text(`NIM : ${mahasiswa.dataValues.nim}`, 130, 30, null, null);
    doc.text(`Fakultas Tujuan : Ilmu Komputer`, 130, 35, null, null);
    doc.text(`Prodi Tujuan : ${mahasiswa.dataValues.prodi_tujuan}`, 130, 40, null, null);

    const query2 = await sequelize.query("SELECT tb_courses.id_mk, mk_asal, sks_asal, nilai_asal, sks_tujuan, nilai_tujuan, mata_kuliah FROM tb_conversions JOIN tb_courses ON tb_courses.id_mk = tb_conversions.id_mk WHERE id_mahasiswa = :id", {
        type: QueryTypes.SELECT,
        replacements: { id }
    });

    let dataValues = await sequelize.query('SELECT * FROM tb_recapitulations WHERE id_mahasiswa = :id', {
        replacements: { id },
        type: QueryTypes.SELECT
    });
    dataValues = dataValues[0];

    let no = 1;

    const hasil = query2.map(item => [
        no++,
        item.id_mk,
        item.mk_asal,
        item.sks_asal,
        item.nilai_asal,
        item.mata_kuliah,
        item.sks_tujuan,
        item.nilai_tujuan
    ]);

    hasil.push(["", "", "Total SKS", String(sks_asal), "", "Total SKS", String(sks_tujuan)]);

    doc.autoTable({
        startY: 50,
        head: [[
            { content: "Kurikulum PT ASAL", colSpan: 5, styles: { halign: 'center' } },
            { content: "Kurikulum PT Tujuan", colSpan: 3, styles: { halign: 'center' } }
        ], [
            { content: "No", styles: { halign: 'center' } },
            { content: "Kode MK", styles: { halign: 'center' } },
            { content: "Nama MK", styles: { halign: 'center' } },
            { content: "SKS", styles: { halign: 'center' } },
            { content: "Nilai", styles: { halign: 'center' } },
            { content: "Nama MK", styles: { halign: 'center' } },
            { content: "SKS", styles: { halign: 'center' } },
            { content: "Nilai", styles: { halign: 'center' } }
        ]],
        body: hasil,
        theme: 'plain',
        styles: {
            cellPadding: 1,
            fontSize: 8,
            valign: 'middle',
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
        }
    });

    doc.setFontSize(10);
    let finalY = doc.autoTable.previous.finalY;

    // Recapitulation
    finalY += 10;
    doc.setFontSize(12);
    doc.text("REKAPITULASI", 15, finalY);
    doc.setFontSize(10);
    doc.text("2. Hasil Konversi Mata Kuliah/SKS yang diperoleh", 15, finalY + 5);
    doc.text("3. Jumlah Mata Kuliah yang masih harus ditempuh", 15, finalY + 10);
    doc.text("4. Semester yang ditetapkan pada PT Tujuan", 15, finalY + 15);

    doc.setFontSize(10);
    doc.text(`: ${dataValues.total_hasil_konversi}/${dataValues.total_sks_tujuan} SKS`, 105, finalY + 5);
    doc.text(`: ${dataValues.sisa_mk}`, 105, finalY + 10);
    doc.text(`: ${dataValues.semester}`, 105, finalY + 15);

    doc.text(`Sorong, ${getCurrentFormattedDate().formatDate3}`, 105, finalY + 30, null, null, 'center');
    // Signatures
    finalY += 30;
    doc.setFontSize(10);
    doc.text("Dikonversi oleh,", 55, finalY + 10, null, null, 'center');
    doc.text("Ketua Program Studi", 55, finalY + 15, null, null, 'center');
    doc.text("Frits G. J. Rupilele, ST.,M.Cs", 55, finalY + 30, null, null, 'center');

    doc.text("Disetujui oleh,", 155, finalY + 10, null, null, 'center');
    doc.text("Dekan", 155, finalY + 15, null, null, 'center');
    doc.text("Iriene S. Rajagukguk, S.Si.,M.Cs", 155, finalY + 30, null, null, 'center');

    doc.text("Mengetahui,", 105, finalY + 40, null, null, 'center');
    doc.text("Wakil Rektor", 105, finalY + 45, null, null, 'center');
    doc.text("Sherly Gaspersz, S.Pd.,M.Pd", 105, finalY + 60, null, null, 'center');

    doc.addPage();

    const prosesData = await proses(id);

    // Data for "Semesters" table
    const semesterData = prosesData.mkBelum.data;

    semesterData.push(['9', '0', '']);

    // Data for "MK" table (Genap 7, Ganjil 8, and Ganjil 9)
    const subjectsData = prosesData.ganjil.data;

    const subjectsData2 = prosesData.genap.data;

    if(subjectsData){
        subjectsData.push([{ content: 'TOTAL', styles: { halign: 'right' } }, { content: prosesData.ganjil.total, styles: { halign: 'left', fontStyle: 'bold' } }]);
    }

    if(subjectsData2){
        subjectsData2.push([{ content: 'TOTAL', styles: { halign: 'right' } }, { content: prosesData.genap.total, styles: { halign: 'left', fontStyle: 'bold' } }]);
    }

    // Header for Semesters table
    const semesterHeader = ['Semester', 'MK yg belum', 'SKS'];

    // Add title
    doc.setFontSize(12);
    doc.text('Daftar Semester dan Mata Kuliah', 14, 12);

    // Semester Table
    doc.autoTable({
        startY: 15,
        head: [semesterHeader],
        body: semesterData,
        theme: 'grid',
        styles: { halign: 'center', cellPadding: 1 },
        foot: [['TOTAL', prosesData.mkBelum.total, '']],
        footStyles: { fillColor: [255, 204, 0] },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.4,
            lineColor: [0, 0, 0],
            font: "times"
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.4,
            lineColor: [0, 0, 0],
            fontStyle: 'bold',
            font: "times"
        },
        footStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.4,
            lineColor: [0, 0, 0],
            fontStyle: 'bold',
            font: "times"
        },
    });

    doc.text("Ganjil 7", 100, 13);

    // Add the "Subjects" table (Genap 7, Ganjil 8, Ganjil 9)
    doc.autoTable({
        startY: 15,
        head: [['MK', 'SKS']],
        body: subjectsData,
        theme: 'grid',
        margin: { left: 100 },
        styles: { halign: 'center', cellPadding: 1 },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.4,
            lineColor: [0, 0, 0],
            font: "times",
            fontStyle: 'bold'
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.4,
            lineColor: [0, 0, 0],
            fontStyle: 'normal',
            font: "times",
            halign: 'left'
        },
    });

    doc.text("Genap 8", 100, 83);
    doc.autoTable({
        startY: 85,
        head: [['MK', 'SKS']],
        body: subjectsData2,
        theme: 'grid',
        margin: { left: 100 },
        styles: { halign: 'center', cellPadding: 1 },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.4,
            lineColor: [0, 0, 0],
            font: "times",
            fontStyle: 'bold'
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.4,
            lineColor: [0, 0, 0],
            fontStyle: 'normal',
            font: "times",
            halign: 'left'
        },
    });


    if (prosesData.genapLebih) {
        const subjectsData3 = prosesData.genapLebih.data;
        doc.text("Genap 10", 100, 153);

        doc.autoTable({
            startY: 155,
            head: [['MK', 'SKS']],
            body: subjectsData3,
            margin: { left: 100 },
            theme: 'grid',
            styles: { halign: 'center', cellPadding: 1 },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineWidth: 0.4,
                lineColor: [0, 0, 0],
                font: "times",
                fontStyle: 'bold'
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineWidth: 0.4,
                lineColor: [0, 0, 0],
                fontStyle: 'normal',
                font: "times",
                halign: 'left'
            },
        });
    }

    if (prosesData.ganjilLebih) {
        const subjectsData3 = prosesData.ganjilLebih.data;
        doc.text("Ganjil 9", 100, 220);

        doc.autoTable({
            startY: 223,
            head: [['MK', 'SKS']],
            body: subjectsData3,
            margin: { left: 100 },
            theme: 'grid',
            styles: { halign: 'center', cellPadding: 1 },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineWidth: 0.4,
                lineColor: [0, 0, 0],
                font: "times",
                fontStyle: 'bold'
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineWidth: 0.4,
                lineColor: [0, 0, 0],
                fontStyle: 'normal',
                font: "times",
                halign: 'left'
            },
        });
    }

    const filename = mahasiswa.dataValues.nama + '-Laporan_Konversi_Nilai-' + Date.now() + '.pdf';

    fs.writeFile(`./tmp/laporan/${filename}`, doc.output(), 'binary', async (err) => {
        if (err) {
            console.error('Error writing PDF to file:', err);
        } else {
            console.log('PDF successfully written to', filename);
        }
    });

    return filename;
}

module.exports = generatePDF;
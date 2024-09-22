const { jsPDF } = require('jspdf');
const fs = require('fs');
const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');
const Queries = require('../queries/queries');
const { getCurrentFormattedDate } = require('./time');
const mahasiswaSchema = require('../model/mahasiswaSchema');
const recap = require('../functions/recap');
require('jspdf-autotable');

require("dotenv").config();

const mahasiswaQueries = new Queries(mahasiswaSchema);

function getBase64Image(imagePath) {
    const image = fs.readFileSync(imagePath);
    return `data:image/jpeg;base64,${image.toString('base64')}`; // Sesuaikan format sesuai jenis gambar (JPEG, PNG, dll)
}

function addTextWithLetterSpacing(doc, text, x, y, letterSpacing) {
    for (let i = 0; i < text.length; i++) {
        doc.text(text[i], x, y);
        x += doc.getTextWidth(text[i]) + letterSpacing; // Update posisi x
    }
}

const document = async (id) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const mahasiswa = await mahasiswaQueries.findOne({
        id_mahasiswa: id
    });

    const recapDoc = await recap(id);
    const totalSKS = String(recapDoc.totalSKSAsal).split(' ')[0].split('');

    const imgData = getBase64Image('../server/public/R.png');

    doc.addImage(imgData, 'png', 28, 10, 34, 32);
    doc.setFontSize(12);

    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.text("YAYASAN VICTORY SORONG", 120, 15, null, null, 'center');
    doc.setTextColor(0, 94, 181);
    doc.text("UNIVERSITAS VICTORY SORONG", 120, 21, null, null, 'center');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("BIRO AKADEMIK DAN PELAPORAN", 120, 26, null, null, 'center');
    doc.setFontSize(8);
    doc.text("Alamat: Jin Basuki Rahmat Km. 11.5 Kelurahan Klawuyuk, Distrik Sorong Timur", 120, 30, null, null, 'center');
    doc.text("Kota Sorong - Papua Barat - Indonesia Kode Pos: 98417", 120, 34, null, null, 'center');
    doc.text("Telp: (0951) 329509, Fax.: (0951) 329670", 120, 38, null, null, 'center');
    doc.text("Email: unvicsorong@yahoo.co.id", 120, 42, null, null, 'center');

    doc.setDrawColor(24, 54, 150);
    doc.setLineWidth(1);

    const y = 45; 
    const x1 = 23; 
    const x2 = 185; 

    doc.line(x1, y, x2, y);

    doc.setFontSize(16);
    addTextWithLetterSpacing(doc, 'FORMULIR', 88, 52, 1);
    doc.setFontSize(10);
    doc.text("SELEKSI BERKAS CALON MAHASISWA", 105, 57, null, null, 'center');
    doc.text("PINDAH / TRANSFER", 105, 61, null, null, 'center');
    doc.text("TAHUN AKADEMIK", 105, 65, null, null, 'center');
    doc.text("........................ / .......................", 105, 69, null, null, 'center');

    doc.text("No : ", 162, 60);
    doc.text(".................", 170, 60);

    doc.text("I.        DATA MAHASISWA", 40, 78);

    const data = [
        ['Nama', '   :', `${mahasiswa.nama.toUpperCase()}`],
        ['NPM Asal', '   :', `${mahasiswa.nim.toUpperCase()}`],
        ['Tempat Tanggal Lahir ', '   :', ``],
    ];

    doc.autoTable({
        body: data,
        startY: 79,
        theme: 'grid',
        margin: { left: 24 },
        styles: {
            valign: 'middle',
            font: "times"
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineWidth: 0.4,
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: { cellWidth: 42 },
            1: { cellWidth: 10 },
            2: { cellWidth: 111 },
        },
    });

    // Data Perguruan Tinggi Asal Section
    doc.text("II.       DATA PERGURUAN TINGGI ASAL", 40, 110);

    const columnsPTAsal = [
        ["Nama Pt", '   :', `${mahasiswa.pt_asal.toUpperCase()}`],
        ["Fakultas", '   :', `${mahasiswa.fakultas.toUpperCase()}`],
        ["Program Studi", '   :', `${mahasiswa.prodi.toUpperCase()}`],
    ];

    doc.autoTable({
        body: columnsPTAsal,
        startY: 111,
        margin: { left: 24 },
        styles: {
            valign: 'middle',
            font: "times"
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineWidth: 0.4,
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: { cellWidth: 42 },
            1: { cellWidth: 10 },
            2: { cellWidth: 111 },
        },
        theme: "grid",
    });


    // Title Section
    doc.text("III.    KELENGKAPAN BERKAS", 40, 143);

    // Table Body
    const body = [
        [
            { content: '1', styles: { halign: 'center' } },
            { content: 'Ijasah / Surat Pindah', styles: { halign: 'left' } },
            { content: '', styles: { halign: 'center' } },
            { content: '', styles: { halign: 'center' } },
        ],
        [
            { content: '2', styles: { halign: 'center' } },
            { content: 'Transkrip Nilai', styles: { halign: 'left' } },
            { content: '', styles: { halign: 'center' } },
            { content: '', styles: { halign: 'center' } },
        ],
        [
            { content: '3', styles: { halign: 'center' } },
            { content: 'Data Mahasiswa pada PDPT', styles: { halign: 'left' } },
            { content: '', styles: { halign: 'center' } },
            { content: '', styles: { halign: 'center' } },
        ],
        [
            { content: '', styles: { fillColor: [211, 211, 211], halign: 'center' } },
            { content: 'Lengkap', styles: { halign: 'left' } },
            { content: '', styles: { halign: 'center', fillColor: [211, 211, 211] } },
            { content: 'Tidak Lengkap', styles: { halign: 'left' } },
        ]
    ];

    // Table Head
    const head = [
        { content: "No", styles: { halign: 'center' } },
        { content: "Rincian", styles: { halign: 'center' } },
        { content: "Ada", styles: { halign: 'center' } },
        { content: "Tidak Ada", styles: { halign: 'center' } },
    ];

    // Generate the Table
    doc.autoTable({
        head: [head],
        body: body,
        startY: 144,
        margin: { left: 24 },
        columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 60 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
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
        theme: "plain", // Plain table theme
    });

    doc.setFont("times", "italic");
    addTextWithLetterSpacing(doc, 'Ket: isi dengan dicentang', 25, doc.lastAutoTable.finalY + 4, 0.1);
    doc.setFont("times", "bold");

    // Riwayat Kuliah Section
    doc.text("IV. RIWAYAT KULIAH", 40, 194);

    doc.autoTable({
        body: [[
            { content: "Lama Kuliah", styles: { halign: 'left' } },
            { content: ":", styles: { halign: 'center' } },
            { content: "", styles: { halign: 'center' } },
            { content: "", styles: { halign: 'center' } },
            { content: "", styles: { halign: 'center' } },
            { content: "", styles: { halign: 'center' } },
            { content: "Tahun", styles: { halign: 'left' } },
        ], [
            { content: "Rekam Semester", styles: { halign: 'left' } },
            { content: ":",styles: { halign: 'center' } },
            { content: "", styles: { halign: 'center' } },
            { content: "", styles: { halign: 'center' } },
            { content: "", styles: { halign: 'center' } },
            { content: "", styles: { halign: 'center' } },
            { content: "Semester", styles: { halign: 'left' } },
        ], [
            { content: "Total SKS", styles: { halign: 'left' } },
            { content: ":", styles: { halign: 'center' } },
            { content: "", styles: { halign: 'center' } },
            { content: !totalSKS[totalSKS.length - 3] ? '' : totalSKS[totalSKS.length - 3], styles: { halign: 'center' } },
            { content: !totalSKS[totalSKS.length - 2] ? '' : totalSKS[totalSKS.length - 2], styles: { halign: 'center' } },
            { content: !totalSKS[totalSKS.length - 1] ? '' : totalSKS[totalSKS.length - 1], styles: { halign: 'center' } },
            { content: "SKS", styles: { halign: 'left' } }
        ]],
        startY: 195,
        margin: { left: 24 },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 10 },
            2: { cellWidth: 10 },
            3: { cellWidth: 10 },
            4: { cellWidth: 10 },
            5: { cellWidth: 10 },
            6: { cellWidth: 50 },
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.4,
            lineColor: [0, 0, 0],
            fontStyle: 'bold',
            font: "times"
        },
        theme: "grid",
    });
    doc.setFont("times", "italic");
    doc.text("Ket: - Maksimal Masa Studi 7 tahun (termasuk masa studi yang akan ditempuh)", 25, doc.lastAutoTable.finalY + 4);
    doc.text("        - Sumber data PDPT", 25, doc.lastAutoTable.finalY + 8);

    doc.setTextColor(0, 0, 255);

    doc.textWithLink('www.forlap.dikti.go.id', 63, doc.lastAutoTable.finalY + 8, { url: 'https://www.google.com' });

    const textWidth = doc.getTextWidth('www.forlap.dikti.go.id');
    doc.setLineWidth(0.3);
    doc.line(95, 226, 31 + textWidth, 226);

    doc.setTextColor(0, 0, 0);
    
    doc.setFont("times", "normal");
    doc.text("Telah dilakukan seleksi dan berkas dinyatakan", 25, doc.lastAutoTable.finalY + 16);

    doc.autoTable({
        body: [[
            { content: "Memenuhi Syarat", styles: { halign: 'left',  } },
            { content: "", styles: { halign: 'center', fillColor: [211, 211, 211] } }
        ], [
            { content: "Tidak Memenuhi Syarat", styles: { halign: 'left' } },
            { content: "", styles: { halign: 'center', fillColor: [211, 211, 211] } }
        ]],
        startY: 236,
        margin: { left: 24 },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 10 },
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.4,
            lineColor: [0, 0, 0],
            fontStyle: 'bold',
            font: "times"
        },
        theme: "grid",
    });
    doc.setFont("times", "italic");
    addTextWithLetterSpacing(doc, 'Ket: isi dengan dicentang', 25, doc.lastAutoTable.finalY + 4, 0.1);
    doc.setFont("times", "normal");

    doc.text("Sorong,.............................................", 153, 253, null, null, 'center');
    doc.text("Diketahui Oleh,", 153, 259, null, null, 'center');
    doc.text(".........................................................", 153, 274, null, null, 'center');

    // PAGE BARU
    doc.addPage();

    doc.setFontSize(12);
    doc.text("DAFTAR KONVERSI NILAI MAHASISWA", 105, 10, null, null, 'center');

    doc.setFontSize(10);

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

    console.log(query2[0]);

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

    hasil.push(["", "", "Total SKS", String(recapDoc.totalSKSAsal), "", "Total SKS", String(recapDoc.totalSKSTujuan)]);

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
            cellPadding: 2,
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

    const filename = mahasiswa.dataValues.nama + '-Laporan_Konversi_Nilai-' + Date.now() + '.pdf';

    fs.writeFile(`./tmp/test/${filename}`, doc.output(), 'binary', async (err) => {
        if (err) {
            console.error('Error writing PDF to file:', err);
        } else {
            console.log('PDF successfully written to', filename);
        }
    });

    return filename;
};

module.exports = document;

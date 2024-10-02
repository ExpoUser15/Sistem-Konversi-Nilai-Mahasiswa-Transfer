const { jsPDF } = require('jspdf');
const fs = require('fs');
const proses = require('./prosesDataSemester');
require('jspdf-autotable');

async function test(id) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const prosesData = await proses('MT00000001');

    // Data for "Semesters" table
    const semesterData = prosesData.mkBelum.data;

    semesterData.push(['9', '0', '']);

    // Data for "MK" table (Genap 7, Ganjil 8, and Ganjil 9)
    const subjectsData = prosesData.ganjil.data;

    subjectsData.push([{ content: 'TOTAL', styles: { halign: 'right' } }, { content: prosesData.ganjil.total, styles: { halign: 'left', fontStyle: 'bold' } }]);

    const subjectsData2 = prosesData.genap.data;

    subjectsData2.push([{ content: 'TOTAL', styles: { halign: 'right' } }, { content: prosesData.genap.total, styles: { halign: 'left', fontStyle: 'bold' } }]);

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

    // Move the cursor down to leave space for the next table
    const finalY = doc.autoTable.previous.finalY + 10;
    doc.text("Genap 7", 100, 13);

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

    const filename = '-test-' + Date.now() + '.pdf';

    fs.writeFile(`../tmp/test2/${filename}`, doc.output(), 'binary', async (err) => {
        if (err) {
            console.error('Error writing PDF to file:', err);
        } else {
            console.log('PDF successfully written to', filename);
        }
    });

}

test();
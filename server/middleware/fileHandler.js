const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, `tmp/${file.fieldname}`);
    },
    filename: function (req, file, cb) {
        const tipe = file.originalname.split('.');
        const uniqueSuffix = file.fieldname + '-' + Date.now() +  '.' + tipe[tipe.length - 1];
        cb(null,  uniqueSuffix)
    }
});

const upload = multer({ storage: storage });

const berkasUpload = upload.fields([
    { name: 'kk', maxCount: 1 }, 
    { name: 'ktp', maxCount: 1 },
    { name: 'transkrip', maxCount: 1 },
    { name: 'ijazah', maxCount: 1 },
    { name: 'surat_pindah', maxCount: 1 },
]);

module.exports = berkasUpload;
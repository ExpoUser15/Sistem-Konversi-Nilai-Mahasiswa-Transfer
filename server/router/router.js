const express = require('express');
const { loginController, postLoginController } = require('../controller/loginController');
const handlingCookie = require('../middleware/handlingCookie');
const { usersController, addUsersController, deleteController, updateController } = require('../controller/kaprodi/usersController');
const logController = require('../controller/kaprodi/logController');
const { addMahasiswaController, mahasiswaController, deleteMahasiswaController, updateMahasiswaController, updateBerkasController } = require('../controller/akademik/mahasiswaController');
const { mataKuliahController, addMataKuliahController, deleteMataKuliahController, updateMataKuliahController } = require('../controller/kaprodi/mataKuliahController');
const { validateUserKaprodi, validateUserAkademik } = require('../middleware/validateUsers');
const { notFound } = require('../controller/notFound');
const {berkasUpload} = require('../middleware/fileHandler');
const fileController = require('../controller/fileResponse/filleController');
const { konversiController, addKonversiController, updateKonversiController, deleteKonversiController, deletePreviewController } = require('../controller/kaprodi/konversiController');
const logoutController = require('../controller/logoutController');
const handleDuplicateData = require('../middleware/handleDuplicateData');

const router = express.Router();

router.get('/login', handlingCookie, loginController);
router.post('/logout', logoutController);

// kaprodi router
router.get('/users', handlingCookie, validateUserKaprodi, usersController);
router.get('/log', handlingCookie, validateUserKaprodi, logController);
router.get('/matakuliah', handlingCookie, validateUserKaprodi, mataKuliahController);
router.get('/konversi', handlingCookie, validateUserKaprodi, konversiController);

router.post('/auth', postLoginController);
router.post('/users/add', addUsersController);
router.post('/matakuliah/add', addMataKuliahController);
router.post('/konversi/add/:id', handleDuplicateData, addKonversiController);

router.delete('/users/delete/:id', deleteController);
router.delete('/matakuliah/delete/:id', deleteMataKuliahController);
router.delete('/konversi/delete/:id/:idkonversi', deleteKonversiController);
router.delete('/konversi/riwayat/delete/:id/', deletePreviewController);

router.put('/users/update/:id', updateController);
router.put('/matakuliah/update/:id', updateMataKuliahController);
router.put('/konversi/update/:id/:idkonversi', updateKonversiController);

// akademik router
router.get('/mahasiswa',  mahasiswaController);
// handlingCookie, validateUserAkademik,

router.post('/mahasiswa/add', berkasUpload, addMahasiswaController);

router.delete('/mahasiswa/delete/:id', deleteMahasiswaController);

router.put('/mahasiswa/update/:id', updateMahasiswaController);

router.patch('/mahasiswa/update/:id/berkas/:fileID', berkasUpload, updateBerkasController);

// file router
router.get('/file/:filename', handlingCookie, fileController);
router.get('/file/report/:filename', handlingCookie, fileController);


// routes not found
router.get('*', notFound);
router.post('*', notFound);
router.put('*', notFound);
router.delete('*', notFound);
router.patch('*', notFound);

module.exports = router;
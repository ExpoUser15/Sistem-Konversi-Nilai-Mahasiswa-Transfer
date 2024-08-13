const express = require('express');
const { loginController, postLoginController } = require('../controller/loginController');
const handlingCookie = require('../middleware/handlingCookie');
const { usersController, addUsersController, deleteController, updateController } = require('../controller/kaprodi/usersController');
const logController = require('../controller/kaprodi/logController');
const { addMahasiswaController, mahasiswaController, deleteMahasiswaController, updateMahasiswaController } = require('../controller/akademik/mahasiswaController');
const { mataKuliahController, addMataKuliahController, deleteMataKuliahController, updateMataKuliahController, addKonversiController } = require('../controller/kaprodi/mataKuliahController');
const { validateUserKaprodi, validateUserAkademik } = require('../middleware/validateUsers');
const { notFound } = require('../controller/notFound');
const upload = require('../middleware/fileHandler');
const berkasUpload = require('../middleware/fileHandler');
const fileController = require('../controller/fileResponse/filleController');
// const { addKonversiController } = require('../controller/kaprodi/konversiController');

const router = express.Router();

router.get('/login', handlingCookie, loginController);

// kaprodi router
router.get('/users', handlingCookie, validateUserKaprodi, usersController);
router.get('/log', handlingCookie, validateUserKaprodi, logController);
router.get('/matakuliah', handlingCookie, validateUserKaprodi, mataKuliahController);

router.post('/auth', postLoginController);
router.post('/users/add', addUsersController);
router.post('/matakuliah/add', addMataKuliahController);

router.delete('/users/delete/:id', deleteController);
router.delete('/matakuliah/delete/:id', deleteMataKuliahController);

router.put('/users/update/:id', updateController);
router.put('/matakuliah/update/:id', updateMataKuliahController);

// akademik router
router.get('/mahasiswa', handlingCookie, validateUserAkademik, mahasiswaController);

router.post('/mahasiswa/add', berkasUpload, addMahasiswaController);

router.delete('/mahasiswa/delete/:id', deleteMahasiswaController);

router.put('/mahasiswa/update/:id', updateMahasiswaController);

// file router
router.get('/file/:filename', handlingCookie, fileController);


// routes not found
router.get('*', notFound);

module.exports = router;
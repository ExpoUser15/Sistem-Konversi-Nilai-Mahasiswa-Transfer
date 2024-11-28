const express = require('express');
const { loginController, postLoginController } = require('../controller/loginController');
const handlingCookie = require('../middleware/handlingCookie');
const { usersController, addUsersController, deleteController, updateController, searchingUsers } = require('../controller/kaprodi/usersController');
const { addMahasiswaController, mahasiswaController, deleteMahasiswaController, updateMahasiswaController, updateBerkasController, searchingMahasiswa } = require('../controller/akademik/mahasiswaController');
const { mataKuliahController, addMataKuliahController, deleteMataKuliahController, updateMataKuliahController, searchingMK } = require('../controller/kaprodi/mataKuliahController');
const { validateUserKaprodi, validateUserAkademik } = require('../middleware/validateUsers');
const { notFound } = require('../controller/notFound');
const {berkasUpload, docUpload} = require('../middleware/fileHandler');
const fileController = require('../controller/fileResponse/filleController');
const { konversiController, addKonversiController, updateKonversiController, deleteKonversiController, detailKonversiController, konversiReportController, penempatanController, penempatanMKController, semesterPostController, deleteSpesifikKonversiController, deleteMKPenempatanController, deletePenempatanController, recapController, generatePDFContoller, updateDateController } = require('../controller/kaprodi/konversiController');
const logoutController = require('../controller/logoutController');
const handleDuplicateData = require('../middleware/handleDuplicateData');
const { laporanController, laporanPostController, searchLaporan, transkripPostController, generatePDFContoller2, reviewUploadController } = require('../controller/akademik/laporanController');
const { pimpinanController, addPimpinanController, deletePimpinanController, updatePimpinanController, searchingPimpinan } = require('../controller/kaprodi/pimpinanController');
const { analyticsController } = require('../controller/kaprodi/dashboardController');

const router = express.Router();

router.get('/login', handlingCookie, loginController);
router.get('/logout', logoutController);

// kaprodi router
router.get('/users', handlingCookie, validateUserKaprodi, usersController);
router.get('/matakuliah', handlingCookie, validateUserKaprodi, mataKuliahController);
router.get('/konversi', handlingCookie, validateUserKaprodi, konversiController);
router.get('/konversi/:id', handlingCookie, validateUserKaprodi, konversiReportController);
router.get('/konversi/penempatan/:id', handlingCookie, validateUserKaprodi, penempatanMKController);
router.get('/konversi/semester/:id', handlingCookie, validateUserKaprodi, penempatanController);
router.get('/konversi/detail/:id', handlingCookie, validateUserKaprodi, detailKonversiController);
router.get('/konversi/recap/:id', handlingCookie, validateUserKaprodi, recapController);
router.get('/pimpinan', handlingCookie, validateUserKaprodi, pimpinanController);
router.get('/analisis', handlingCookie, validateUserKaprodi, analyticsController);

router.post('/auth', postLoginController);
router.post('/users/add', handlingCookie, addUsersController);
router.post('/konversi/semester/add/:id', semesterPostController);
router.post('/matakuliah/add', addMataKuliahController);
router.post('/konversi/add/:id', handleDuplicateData, addKonversiController);
router.post('/pimpinan/add', addPimpinanController);

router.delete('/users/delete/:id', deleteController);
router.delete('/matakuliah/delete/:id', deleteMataKuliahController);
router.delete('/konversi/delete/:id/:idkonversi', deleteKonversiController);
router.delete('/konversi/detail/delete/:id/:id_mahasiswa', deleteSpesifikKonversiController);
router.delete('/konversi/semester/delete/:id/:id_mahasiswa/:semester', deleteMKPenempatanController);
router.delete('/konversi/semester/tabel/delete/:penempatan/:id_mahasiswa', deletePenempatanController);
router.delete('/pimpinan/delete/:id', deletePimpinanController);

router.put('/users/update/:id', updateController);
router.put('/matakuliah/update/:id', updateMataKuliahController);
router.put('/konversi/detail/:id', updateKonversiController);
router.put('/pimpinan/update/:id', updatePimpinanController);
router.put('/konversi/update/date/:id', updateDateController);

// akademik router
router.get('/mahasiswa/:type/:page', handlingCookie, mahasiswaController);
router.get('/mahasiswa/laporan', handlingCookie, laporanController);


router.post('/mahasiswa/add', berkasUpload, addMahasiswaController);
router.post('/mahasiswa/upload/:id', docUpload, laporanPostController);
router.post('/mahasiswa/search', searchingMahasiswa);
router.post('/matakuliah/search', searchingMK);
router.post('/pimpinan/search', searchingPimpinan);
router.post('/users/search', searchingUsers);
router.post('/laporan/search', searchLaporan);

router.delete('/mahasiswa/delete/:id', deleteMahasiswaController);

router.put('/mahasiswa/update/:id', updateMahasiswaController);

router.patch('/mahasiswa/update/:id/berkas/:fileID', berkasUpload, updateBerkasController);
router.patch('/mahasiswa/laporan/update/:id', docUpload, laporanPostController);

// file router
router.get('/file/:filename', handlingCookie, fileController);
router.get('/file/report/:id', handlingCookie, generatePDFContoller);
router.get('/file/report/:id/all', handlingCookie, generatePDFContoller2);
router.get('/file/upload/:filename', handlingCookie, fileController);


// routes not found
router.get('*', notFound);
router.post('*', notFound);
router.put('*', notFound);
router.delete('*', notFound);
router.patch('*', notFound);

module.exports = router;
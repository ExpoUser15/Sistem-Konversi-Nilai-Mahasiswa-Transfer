const express = require('express');
const { loginController, postLoginController } = require('../controller/loginController');
const handlingCookie = require('../middleware/handlingCookie');
const { usersController, addUsersController, deleteController, updateController } = require('../controller/kaprodi/usersController');
const router = express.Router();

router.get('/login', handlingCookie, loginController);
router.get('/users', handlingCookie, usersController);

router.post('/auth', postLoginController);
router.post('/users/add', addUsersController);

router.delete('/users/delete/:id', deleteController);

router.put('/users/update/:id', updateController);

module.exports = router;
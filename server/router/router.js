const express = require('express');
const { loginController, postLoginController } = require('../controller/loginController');
const handlingCookie = require('../middleware/handlingCookie');
const router = express.Router();

router.get('/login', handlingCookie, loginController);
router.post('/auth', postLoginController);

module.exports = router;
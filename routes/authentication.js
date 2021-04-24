const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/auth/register');
const LoginController = require('../controllers/auth/login');

const registerCtrl = new RegisterController();
const loginCtrl = new LoginController();

// Register
router.route('/register/request').post(registerCtrl.registerRequest);
router.route('/register/verify').post(registerCtrl.registerVerify);

// Login
router.route('/login').post(loginCtrl.login);

module.exports = router;
const {showLogin, doLogin, logout, showRegister, doRegister, google, googleCallback, showForgetPassword, showResetPassword, doForgetPassword, doResetPassword} = require('../auth/controller');
const {registerValidator, loginValidator} = require('./middleware');
const express = require('express');
const router = express.Router();

router.get('/login', showLogin);
router.post('/login', [loginValidator], doLogin);
router.get('/register', showRegister);
router.post('/register', [registerValidator], doRegister);
router.get('/logout', logout);
router.get('/google', google);
router.get('/google/callback', googleCallback);

router.get('/forgetpassword', showForgetPassword);
router.post('/forgetpassword', doForgetPassword);

router.get('/resetpassword', showResetPassword);
router.post('/resetpassword', doResetPassword);
module.exports = router;

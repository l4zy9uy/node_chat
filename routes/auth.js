const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router
    .get('/register', authController.registerForm)
    .get('/login', authController.loginForm)
    .post('/register', authController.createAccount)
    .post('/login', authController.loginAccount)

module.exports = router;
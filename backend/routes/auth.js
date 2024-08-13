const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router
    .get('/register', authController.registerForm)
    .get('/login', authController.loginForm)
    .get('/', authController.loginForm)
    .post('/register', authController.createAccount)
    .post('/login', passport.authenticate('local', {
}), authController.loginAccount);

module.exports = router;
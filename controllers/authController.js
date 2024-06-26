const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const bcrypt = require('bcrypt');
const User = require("../models/user");

exports.registerForm = asyncHandler(async (req, res, next) => {
    res.render('register.pug');
    next();
});
exports.loginForm = asyncHandler(async (req, res, next) => {
    res.render('login.pug');
    next();
});

exports.createAccount = [
    body("username")
        .isLength({min: 6, max: 32})
        .isString()
        .escape(),
    body("password")
        .isLength({min: 6, max: 32})
        .isAlphanumeric(),
    body("name")
        .isString()
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error_registration_message', 'Registration failed!');
            res.redirect('/register');
        } else {
            const user = new User({
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
            });

            await user.save();
            req.flash('success_message', 'Registration successful!');
            res.redirect('/login'); // Redirect to the login page or another page
        }

    })];
exports.loginAccount = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username}).exec();

        if (!user) {
            const errorMessage = 'Username or password is incorrect!';
            console.log(errorMessage);
            req.flash('error', errorMessage);
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            const errorMessage = 'Username or password is incorrect!';
            console.log(errorMessage);
            req.flash('error', errorMessage);
            return res.redirect('/login');
        }

        req.session.user = {id: user._id, name: user.name};
        console.log(req.session.user.name);
        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'Login failed due to server error.');
        res.redirect('/login');
    }
});

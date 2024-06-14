const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

exports.registerForm = asyncHandler(async (req, res, next) => {
    res.render('register.pug');
});

exports.loginForm = asyncHandler(async (req, res, next) => {
    res.render('login.pug');
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
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
        });

        await user.save();

        try {
            await user.save();
            res.status(201).json({ success: true, message: "Registration successful" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Registration failed" });
        }
    })];
exports.loginAccount = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username, password: req.body.password}).exec();
        if(user !== null) {
            req.session.user = { id: user._id, name: user.name };
            console.log(req.session.user.name);
            res.redirect('/');
        }
        else {
            const errMess = 'username or password is incorrect!';
            console.log(errMess);
            req.flash('error', 'Username or password is incorrect!');  // Set a flash message by passing the key, followed by the value, to req.flash().
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'Login failed due to server error.');
        res.redirect('/login');
    }
});

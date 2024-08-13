const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const passport = require('passport');
const {logger} = require("../app");
const LocalStrategy = require('passport-local').Strategy;

exports.registerForm = asyncHandler(async (req, res) => {
    res.render('register.pug');
});
exports.loginForm = asyncHandler(async (req, res) => {
    console.log('Accessing login form');
    res.render('login.pug');
});

exports.createAccount = [
    body('username')
        .trim()
        .isLength({min: 6, max: 32})
        .withMessage('Username must be between 6 and 32 characters.'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address.'),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long.'),
    body('phone_number')
        .trim()
        .matches(/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/)
        .withMessage('Please provide a valid phone number with country code.'),
    asyncHandler(async (req, res, next) => {
        console.log("Received registration");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({ errors: errors.array() });/*
            req.flash('error_registration_message', 'Registration failed due to input errors!');
            return res.redirect('/register');*/
        }
        console.log("no err");
        const foundUser = await User.findOne({username: req.body.username}).exec();
        if (foundUser) {
            console.log("found");
            /*req.flash('error_registration_message', 'Registration failed: Username already registered.');
            return next(new Error('Validation errors'));*/
            return res.status(409).json({ errors: [{ msg: 'Username already registered.' }] });
        }
        console.log(req.body);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number,
        });
        await user.save();
        console.log(user);

        req.flash('success_message', 'Registration successful!');
        res.redirect('/login');
    })
];

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({username}).exec();
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, {message: 'Username or password is incorrect!'});
            }
            const userSessionDetails = {id: user._id, name: user.name};
            console.log("signed successfully");
            return done(null, userSessionDetails);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    done(null, user);
});


exports.loginAccount =  (req, res) =>  {
    console.log("login...");
    console.log(req.user);

    // Authentication successful
    res.status(200);
};
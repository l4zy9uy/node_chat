const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


exports.registerForm = asyncHandler(async (req, res) => {
    res.render('register.pug');
});
exports.loginForm = asyncHandler(async (req, res) => {
    console.log('Accessing login form');
    res.render('login.pug');
});

exports.createAccount = [
    body("username")
        .isLength({min: 6, max: 32})
        .isString()
        .escape(),
    body("password")
        .isLength({min: 6})
        .isAlphanumeric(),
    body("name")
        .isString()
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        console.error(errors);
        if (!errors.isEmpty()) {
            req.flash('error_registration_message', 'Registration failed due to input errors!');
            return res.redirect('/register');
        }

        // Check if the username already exists
        const foundUser = await User.findOne({username: req.body.username}).exec();
        if (foundUser) {
            req.flash('error_registration_message', 'Registration failed: Username already registered.');
            return res.redirect('/register');
        }

        // Hash password before saving to database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log("hashed: " + hashedPassword);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,  // Use the hashed password
            name: req.body.name,
        });

        await user.save();
        req.flash('success_message', 'Registration successful!');
        res.redirect('/login');
    })
];

exports.loginAccount = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username}).exec();

        if (!user) {
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
        req.session.isAuthenticated = true;
        res.redirect('/channel');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'Login failed due to server error.');
        res.redirect('/login');
    }


});

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username }).exec();
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Username or password is incorrect!' });
            }

            // Here you manually set up the session like in your `loginAccount` function
            const userSessionDetails = { id: user._id, name: user.name }; // Adapt based on actual user model
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
    try {
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
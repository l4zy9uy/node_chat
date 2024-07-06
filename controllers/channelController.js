const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const bcrypt = require('bcrypt');

exports.chatRoom = asyncHandler(async (req, res) => {
    if (req.session.isAuthenticated) {
        // If the user is authenticated, proceed to the next middleware
        res.render('channel.pug');
    } else {
        // If the user is not authenticated, redirect to the login page
        res.redirect('/login');
    }
});
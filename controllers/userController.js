const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

exports.onGetAllUsers = asyncHandler(async (req, res, next) => {

});
exports.onGetUserById = asyncHandler(async (req, res, next) => { });
exports.onCreateUser = [
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
        })

        await user.save();

        return res.status(201).json({ success: true, user });
    })];
exports.onDeleteUserById = asyncHandler(async (req, res, next) => { });

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

exports.onGetAllUsers = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ success: false, errors: errors.array() });
    }

    const users = await User.find();
    return res.status(200).json({success: true, users});
});
exports.onGetUserById = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            // Instead of throwing an error, send a 404 response
            return res.status(404).json({ success: false, error: "No user with this id found" });
        }
        console.log(user);
        return res.status(200).json({ success: true, user });
    } catch (err) {
        // Pass errors to the error handler
        next(err);
    }
});
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

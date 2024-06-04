const asyncHandler = require("express-async-handler");

exports.onGetAllUsers = asyncHandler(async (req, res, next) => { });
exports.onGetUserById = asyncHandler(async (req, res, next) => { });
exports.onCreateUser = asyncHandler(async (req, res, next) => { });
exports.onDeleteUserById = asyncHandler(async (req, res, next) => { });

const asyncHandler = require("express-async-handler");

exports.getMessage = asyncHandler(async (req, res, next) => { });
exports.postMessage = asyncHandler(async (req, res, next) => { });
exports.getRecentConversation = asyncHandler(async (req, res, next) => { });
exports.getConversationByRoomId = asyncHandler(async (req, res, next) => { });
exports.markConversationReadByRoomId = asyncHandler(async (req, res, next) => { });


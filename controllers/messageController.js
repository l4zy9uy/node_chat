const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const mongoose = require('mongoose');

exports.getMessage = asyncHandler(async (req, res) => {
    const messages = await Message.find({}).populate('user', 'name').exec();
    const response = messages.map(message => {
        if (message.user) {
            return {
                name: message.user.name,
                message: message.content
            };
        } else {
            // Handle case where user is null
            return {
                name: 'Unknown',
                message: message.content
            };
        }
    });
    res.send(response);
});

exports.postMessage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.body.userId).exec();
    const message = new Message({
        user: new mongoose.Types.ObjectId(user),
        content: req.body.message,
        time: req.body.time
    });
    await message.save();
    req.io.emit('message', {name: user.name, message: message.content});
    res.sendStatus(200);
});

exports.getRecentConversation = asyncHandler(async (req, res, next) => { });
exports.getConversationByRoomId = asyncHandler(async (req, res, next) => { });
exports.markConversationReadByRoomId = asyncHandler(async (req, res, next) => { });


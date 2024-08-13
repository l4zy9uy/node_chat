const asyncHandler = require("express-async-handler");

exports.chatRoom = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        // If the user is authenticated, proceed to the next middleware
        res.render('channel.pug');
    }
});
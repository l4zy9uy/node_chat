const mongoose = require('mongoose');
const { io, httpServer,logger } = require("./app");
const dotenv = require('dotenv');
dotenv.config();

// Constants for the server
const mongoDb = process.env.DB_URI;
const port = process.env.PORT || "8080";

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDb);
}

// Socket.io Events
io.on('connection', (socket) => {
    console.log('A user connected');
    try {
        // Access the user object from the session passport data
        let user = socket.request.session.passport.user;
        logger.info("user info: " + socket.request.user);
        // Log the entire session to your logger for info
        logger.info("body: " + socket.request.body);
        if (user) {
            logger.info(`User ID: ${user.id}, Name: ${user.name}`);
            io.emit('user', { user_id: user.id });
        } else {
            console.log("No user found in session.");
        }
    } catch (e) {
        console.log("Error accessing the session:", e);
    }
});


// Server Initialization
httpServer.listen(port, () => {
    console.log(`Express server listening on ${port}`);
});

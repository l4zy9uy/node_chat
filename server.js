const mongoose = require('mongoose');
const { io, httpServer } = require("./app");
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
    console.log('a user connected');
    try {
        let user = socket.request.session.user;
        console.log(`user: ${user.id}`);
        io.emit('user', {user_id: user.id});
    } catch (e) {
        console.log(e);
    }
});

// Server Initialization
httpServer.listen(port, () => {
    console.log(`Express server listening on ${port}`);
});

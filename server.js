const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const Server = require('socket.io').Server;
const logger = require("morgan");
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
dotenv.config();

// Constants for the server
const mongoDb = process.env.DB_URI;
const port = process.env.PORT || "8080";

//Routers
const indexRouter = require('./routes/index');
const messageRouter = require('./routes/message');
const authRouter = require('./routes/auth');

// View and Static File Setup
app.set('view-engine', 'pug');
app.set("port", port);
app.use(express.static(__dirname));

// Login and Body Parsing
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Server and Socket.io setup
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Session Configuration
const sessionMiddleware = session({
    secret: 'your secret',
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

// Flash Messages
app.use(flash());
app.use((req, res, next) => {
    req.io = io;
    res.locals.error = req.flash('error');
    res.locals.success_message = req.flash('success_message');
    res.locals.error_registration_message = req.flash('error_registration_message');
    next();
});

// Routes
//app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/messages", messageRouter);


main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDb);
}

io.engine.use(sessionMiddleware);

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

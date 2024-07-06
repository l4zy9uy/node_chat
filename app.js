const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const Server = require('socket.io').Server;
const logger = require("morgan");
const session = require('express-session');
const flash = require('connect-flash');
const port = process.env.PORT || "8080";

// Routers
const messageRouter = require('./routes/message');
const authRouter = require('./routes/auth');
const channelRouter = require("./routes/channel");

// View and Static File Setup
app.set('view-engine', 'pug');
app.set("port", port);
//app.use(express.static(__dirname));

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
app.use("/", authRouter);
app.use("/messages", messageRouter);
app.use("/channel", channelRouter);

io.engine.use(sessionMiddleware);

module.exports = {
    app,
    httpServer,
    io
};

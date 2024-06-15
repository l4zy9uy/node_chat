const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const {Server: Server} = require('socket.io');
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const logger = require("morgan");
require('dotenv').config();
const mongoDb = process.env.DB_URI;
const port = process.env.PORT || "8080";
const session = require('express-session');
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const authRouter = require('./routes/auth');

app.set('view-engine', 'pug');
app.set("port", port);

app.use(logger("dev"));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
    req.io = io;
    next();
});

const sessionMiddleware = session({
    secret: 'your secret',
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success_message = req.flash('success_message');
    res.locals.error_registration_message = req.flash('error_registration_message');
    next();
});

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/messages", messageRouter);

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDb);
}

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

httpServer.listen(port, () => {
    console.log(`Express server listening on ${port}`);
});

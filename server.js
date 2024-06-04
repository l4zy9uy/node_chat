const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const { Server: Server } = require('socket.io');
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const logger = require("morgan");

const mongoDb = "mongodb+srv://hoanghuudon02hp:donkahp123@cluster0.zlih6e8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const Message = mongoose.model('Message_test', { name: String, message: String });
const port = process.env.PORT || "8080";

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const conversationRouter = require('./routes/conversation');
app.set("port", port);

app.use(logger("dev"));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/conversation", conversationRouter);

app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find({});
        res.send(messages);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post('/messages', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        io.emit('message', req.body);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
});

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDb);
}

io.on('connection', () => {
    console.log('a user is connected');
});

httpServer.listen(port, () => {
    console.log(`Express server listening on ${port}`);
});

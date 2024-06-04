const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const mongoDb = "mongodb+srv://hoanghuudon02hp:donkahp123@cluster0.zlih6e8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const Message = mongoose.model('Message_test', { name: String, message: String });

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

httpServer.listen(8080, () => {
    console.log('Express server listening on 8080');
});

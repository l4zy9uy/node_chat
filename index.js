const express = require('express');
const { createServer } = require('node:http');
const { fileURLToPath} = require('node:url');
const {dirname, join} = require('node:path');
const { Server } = require('socket.io');

const index = express();
const server = createServer(index);
const io = new Server(server, {connectionStateRecovery: {}});


index.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});


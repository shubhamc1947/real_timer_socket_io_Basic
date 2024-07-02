// http://localhost:3000/socket-info  gives socket info on get request to the client
//http://localhost:3000/admin we can print the data on the server side as well


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const socketInfo = {};

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

io.on('connection', socket => {
    socketInfo[socket.id] = { rooms: [] };
    console.log('User connected: ' + socket.id);

    socket.on('send-msg', (msg, room) => {
        console.log('Message received:', msg);
        if (room.trim() === "") {
            socket.broadcast.emit('recv-msg', msg);
        } else {
            socket.to(room).emit('recv-msg', msg);
        }
    });

    socket.on('real-time-send', (msg) => {
        console.log('Real-time message:', msg);
        socket.broadcast.emit('real-time-recv', msg);
    });

    socket.on('join-room', (room) => {
        if (room.trim() !== "") {
            socket.join(room);
            socketInfo[socket.id].rooms.push(room);
            console.log('User joined room:', room);
        }
    });

    socket.on('disconnect', () => {
        delete socketInfo[socket.id];
        console.log('User disconnected: ' + socket.id);
    });
});

app.get('/socket-info', (req, res) => {
    res.json(socketInfo);
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

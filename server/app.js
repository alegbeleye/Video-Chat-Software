const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ['POST', 'GET'],
      allowedHeaders: '*',
      credentials: true,
  }
});

const users = {};

io.on('connection', socket => {
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);

    socket.on('disconnect', () => {
        socket.broadcast.emit("userLeft")
        delete users[socket.id];
    })

    socket.on('sentChat', chat => {
      io.to(chat.to).emit('recievedChat', chat);
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from, username:data.username});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', {signal:data.signal, username:data.username});
    })
});

server.listen(8000, () => console.log('server is running on port 8000'));
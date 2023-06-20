const express = require("express");
const app = express();
const cors = require('cors');
const route = require('./routes');
const http = require('http');
const {Server} = require('socket.io');
const chatSocket = require('./controller/chatController');

app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

const server = http.createServer(app);

const PORT = 8080;

route(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
    debug: true,
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    chatSocket.sendMessage(socket, io);

    socket.on("disconnect", () => {
        console.log("User disconnected")
    })
})

server.listen(PORT, () => {
    console.log('Server is running on 8080');
})
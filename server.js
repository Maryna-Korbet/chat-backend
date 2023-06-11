const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const {DB_HOST, PORT} = process.env;

const app = express();

const {createMessage, getAll} = require("./controlers/message");

app.use(cors());

const http = require("http").Server(app);
const socket = require("socket.io")(http, {cors: ({origin: "http://localhost:3000"})});

global.onlineUsers = new Map();

socket.on("connection", (user)=>{
    user.emit("changeOnline", onlineUsers.size);
    user.on("addUser", async (data) => {
        onlineUsers.set(user.id, data.name);
        user.emit("changeOnline", onlineUsers.size); 
        user.broadcast.emit("changeOnline", onlineUsers.size);
        const result = await getAll();
        user.emit("messagesList", result);
    });
    user.on("newMessage", async (data) => {
        const result = await createMessage(data);
        user.emit("oneNewMessage", result);
        user.broadcast.emit("oneNewMessage", result);
    });
    user.on("disconnect", () => {
        onlineUsers.delete(user.id);
        user.broadcast.emit("changeOnline", onlineUsers.size);
    })
});

mongoose.set('strictQuery', false)
.connect(DB_HOST)
.then(()=> {
    http.listen(PORT, () => {
        console.log('Database connect success')
    })
})
.catch(error => {
    console.log(error.message)
    process.exit(1)
})





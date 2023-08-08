require('dotenv').config();
const express=require('express');
const app=express();
const handel=require('./middlewares/errorHandel');
const data=require('./dummyData/data');
const mongoDb=require('./config/db');
const userRoutes=require('./Routes/userRoutes');
const chatRoutes=require('./Routes/chatRoutes');
const messageRoutes=require('./Routes/messageRoutes');
mongoDb();
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("API is working");
})
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
app.use(handel);
const port=process.env.PORT;
const server=app.listen(port,(req,res)=>{
    console.log("server running in the port");
})
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
    })
    io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connection");
    })
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("userjoined roomm"+room);
    })
    socket.on('typing', (room) => { socket.in(room).emit("typing") });
    socket.on('stop typing', (room) => { socket.in(room).emit("stop typing") });
    socket.on('new message', (newMessage) => {
            var chat = newMessage.chat;
            if (!chat.users) return console.log('not defined users');
            chat.users.forEach(user => {
                if (user._id === newMessage.sender._id) {
                    return;
                }
                socket.in(user._id).emit("message recieved",newMessage);    
            })
            
    })
    socket.off("setup", () => {
        console.log("disconnected");
        socket.leave(userData._id);
    })
})


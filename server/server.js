const { instrument } = require("@socket.io/admin-ui");
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080', "https://admin.socket.io"],
        credentials: true
    },
})

const users = {};

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('sendMessage', (message, room) => {
       if(room === ""){
        socket.broadcast.emit('receiveMessage', {message: message, name: users[socket.id]})
       }else{
        socket.to(room).emit("receiveMessage", {message: message, name: users[socket.id]})
       }
    })
    socket.on('joinRoom', (room, name, cb) => {
        socket.join(room);
        cb(`${name} joined ${room}`);
    })

    socket.on('newUser', (room, name) => {
        users[socket.id] = name;
        if(room === ""){
            socket.broadcast.emit('userConnected', name)
           }else{
            //socket.join(room);
            socket.to(room).emit("userConnected", name)
        }
        console.log(users);
    })
})

instrument(io, { auth: false,  mode: "development", })  
 


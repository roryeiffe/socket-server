const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const PORT = process.env.PORT || 5000
const {getUsers, addUser, getUser, deleteUser} = require('./users');

//Initialize new socket.io instance and pass the http server to it
const io = require('socket.io')(http, {cors: {
    origin: "*",
    methods: ["GET", "POST"]}
  })

app.use(cors())


io.on('connection', (socket) => {
  socket.on("login", ({name, room}, callback) => {
    console.log(name, room);
    const {user, error} = addUser(socket.id, name, room);
    if(error) return callback(error);
    socket.join(user.room);
    // emit the notification:
    socket.in(room).emit('notification', {title: 'Someone\'s here', description: `${user.name} just landed`});
    // emit the list of users to everyone but the sender:
    io.in(room).emit('users', getUsers(room));
    callback("success");
  
  })
  socket.on("sendMessage", message => {
    console.log(message);
    // get the user from the socket id:
    const user = getUser(socket.id);
    socket.in(user.room).emit('message', {user: user.name, text: message});  
  })
  socket.on("disconnect", () => {
    const user = deleteUser(socket.id);
    if(user) {
        socket.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` });
        io.in(room).emit('users', getUsers(room));
    }
  
  })
  socket.on("hello", () => {
    console.log("Hello World");
  })
})


app.get('/', (req, res) => {
  req.send('Server is up and running') 
})


http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
})
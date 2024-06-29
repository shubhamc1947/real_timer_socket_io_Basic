const io = require('socket.io')(3000, {
  cors: {
      origin: ["http://localhost:5173"], 
      methods: ["GET", "POST"],
      credentials: true  
  }
});

io.on("connection", socket => {
  console.log(socket.id);

  socket.on("send-msg", (msg, room) => {
    console.log(msg)
      if (room === "") {
          socket.broadcast.emit('recv-msg', msg);
      } else {
          socket.to(room).emit('recv-msg', msg);
      }
  });
  socket.on('real-time-send',(msg)=>{
    console.log(msg)
    socket.broadcast.emit("real-time-recv",(msg));
  })
  socket.on('join-room', (room) => {
      socket.join(room);
  });
});

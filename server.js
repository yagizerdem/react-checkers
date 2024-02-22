const Queue = require('./Queue');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const { connected } = require('process');
const cors = require("cors");


const PORT = process.env.PORT || 5500;
const app = express();
const server = http.createServer(app);
app.use(cors());
const io = socketIo(server); // in case server and client run on different urls

app.use(express.static('public'));

const allPlayers = {}
const queue = new Queue()
var playerCount = 0 ;
var loop = null;

io.on('connection', (socket) => {
  console.log('client connected: ', socket.id);
  const newPlayer = {
    socketid:socket.id,
    opponentsocketid:undefined,
    name:undefined
  }
  allPlayers[newPlayer.socketid] = newPlayer
  playerCount++
  socket.on('disconnect', (reason) => {
    console.log(reason);
    if(allPlayers[socket.id]!= null){
      io.to(allPlayers[socket.id].opponentsocketid).emit('leavemathc')
    }
    delete allPlayers[socket.id]
    playerCount--
    if(playerCount <2 && loop != null){
      clearInterval(loop)
      loop = null
    }
  });
  socket.on('findmatch',(username)=>{
    allPlayers[socket.id].name = username
    queue.enqueue(allPlayers[socket.id])
    if(playerCount >= 2 && loop == null){
      loop = setInterval(match , 100) 
    }
  })
  socket.on('movepiece',(dto)=>{
    io.to(allPlayers[socket.id].opponentsocketid).emit('movepiece',dto)
  })
  socket.on('switchturn',()=>{
    io.to(allPlayers[socket.id].opponentsocketid).emit('switchturn')
  })
  socket.on('sendchat',(data)=>{
    io.to(allPlayers[socket.id].opponentsocketid).emit('recievechat',data)
  })
  socket.on('gameend',(data)=>{
    io.to(allPlayers[socket.id].opponentsocketid).emit('gameend',data)
  })



  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
});
socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
});

});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log('Server running on Port ', PORT);
});


function match(){
    const player1 = queue.dequeue()
    if(allPlayers[player1.socketid] == undefined) return

    const player2 = queue.dequeue()
    if(allPlayers[player2.socketid] == undefined){
      queue.enqueue(player1)
      return
    }
    // match found
    player1.opponentsocketid = player2.socketid
    player2.opponentsocketid = player1.socketid

    io.to(player1.socketid).emit('matchfound',{main:player1,opponent:player2 ,color: 'white'})
    io.to(player2.socketid).emit('matchfound',{main:player2,opponent:player1 , color:'black'})

    if(queue.size() < 2){
      clearInterval(loop)
      loop = null
    }
}
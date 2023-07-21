import express,{Request,Response,Express} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import {Server, Socket} from 'socket.io'
import crypto from 'crypto'
import './Room'
import { generateWords } from './generateWords'
import { PlayerState, RoomState,Player } from './types'
import { endGameHander, joinRoomHander, updateRoomHandler } from './roomUpdate'
const app: Express = express()
const serverHttp = http.createServer(app);
app.use(cors())

class Room{
  players: Array<Player> = []
  status:"waiting"|"started" = "waiting"
  startTime: number = 0
  roomId: string
  words: string

  constructor(id:string,words: string){
    this.roomId = id
    this.startTime = new Date().getTime()
    this.words = words
  }

  addPlayer(player:Player) {
    this.players.push(player)
  }

}

// class Player{
//   isPlaying: boolean = false
// 	isReady: boolean = false
//   score: number = 0
//   finishTime: number = 0
//   accuracy: number = 0
//   id: string 
//   room: Room
//   constructor(id: string, room: Room) {
//     this.id = id
//     this.room = room
//   }
// }
export const playerRooms: PlayerState = {};
export const rooms: RoomState = {};

const io = new Server(serverHttp,{cors: {
  origin: "*"
}})  

// io.on("connection", (socket:Socket) => {
//   console.log("Hwllo");
//   console.log(socket.id);
  
  
// })

export var publicIO = io.of('/public') 

var privateIO = io.of('/private')


dotenv.config()


var onlineUserCount = 0;
var playerInRoom = new Map<Player,Room>()
var currentRoom = new Room(crypto.randomBytes(8).toString("hex"),generateWords("words").join(' '))


publicIO.on('connection',(socket:Socket) => {
  onlineUserCount++
  console.log("user joined with id: ",socket.id);
  console.log("Online players: ",onlineUserCount);
  
  
  socket.on('joinRandomRoom',(user,sendWords) => {
      console.log(user);
      
    var player:Player = user
    

    playerInRoom.set(player,currentRoom)
    currentRoom.addPlayer(player);

    socket.join(currentRoom.roomId);

    console.log("player with id:",player.id,"joined room with id:",currentRoom.roomId);
    // let tempSet = new Set(currentRoom.players)
    
    // currentRoom.players = currentRoom.players.filter(player => { 
    //   if (tempSet.has(player)) {
    //       tempSet.delete(player)
    //       return true
    //   } else return false
    // })
    rooms[currentRoom.roomId] = {
      players: [...currentRoom.players,user],
      toType: currentRoom.words,
      inGame: false,
      winner: null,
    };
    if (currentRoom.players.length >= 2) {
      sendWords([currentRoom.words,true,currentRoom.roomId,player.id]);
      rooms[currentRoom.roomId].inGame = true;
      socket.in(currentRoom.roomId).emit("start game");

      currentRoom.startTime = new Date().getTime();
      publicIO.in(currentRoom.roomId).emit("start game");
      currentRoom = new Room(crypto.randomBytes(8).toString("hex"),generateWords("words").join(' '));
      
      // socket.emit("words generated", currentRoom.words)
    } else {
      sendWords([currentRoom.words,false,currentRoom.roomId,player.id]);
    }
 
  })


  joinRoomHander(socket)
  updateRoomHandler(socket)
  endGameHander(socket)

  socket.on('disconnect',() => onlineUserCount--);
})

privateIO.on('connection',(socket) => {
  console.log(socket.id,'private');

})

app.get('/', (req: Request, res: Response) => res.send('Hello World!'))


serverHttp.listen(8080, () => console.log(`Example app listening on port 8080!`))



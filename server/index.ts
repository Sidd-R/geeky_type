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
  roomDif: 1|2|3
  constructor(id:string,words: string,roomDif: 1|2|3){
    this.roomId = id
    this.startTime = new Date().getTime()
    this.words = words
    this.roomDif = roomDif
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
var currentRoom:Array<Room> = [new Room(crypto.randomBytes(8).toString("hex"),generateWords("words").join(' '),1),new Room(crypto.randomBytes(8).toString("hex"),generateWords("words").join(' '),2),new Room(crypto.randomBytes(8).toString("hex"),generateWords("words").join(' '),3)]


publicIO.on('connection',(socket:Socket) => {
  onlineUserCount++
  console.log("user joined with id: ",socket.id);
  console.log("Online players: ",onlineUserCount);
  
  
  socket.on('joinRandomRoom',(user,diff,sendWords) => {
      console.log(user);
    let curRoomIndex = diff-1
    var player:Player = user
    

    // playerInRoom.set(player,currentRoom)
    currentRoom[curRoomIndex].addPlayer(player);

    socket.join(currentRoom[curRoomIndex].roomId);

    console.log("player with id:",player.id,"joined room with id:",currentRoom[curRoomIndex].roomId);
    
    rooms[currentRoom[curRoomIndex].roomId] = {
      players: [...currentRoom[curRoomIndex].players,user],
      toType: currentRoom[curRoomIndex].words,
      inGame: false,
      winner: null,
    };
    if (currentRoom[curRoomIndex].players.length >= 2) {
      sendWords([currentRoom[curRoomIndex].words,true,currentRoom[curRoomIndex].roomId,player.id]);
      rooms[currentRoom[curRoomIndex].roomId].inGame = true;
      socket.in(currentRoom[curRoomIndex].roomId).emit("start game");

      currentRoom[curRoomIndex].startTime = new Date().getTime();
      publicIO.in(currentRoom[curRoomIndex].roomId).emit("start game");
      currentRoom[curRoomIndex] = new Room(crypto.randomBytes(8).toString("hex"),generateWords("words").join(' '),currentRoom[curRoomIndex].roomDif);
      
      // socket.emit("words generated", currentRoom[curRoomIndex].words)
    } else {
      sendWords([currentRoom[curRoomIndex].words,false,currentRoom[curRoomIndex].roomId,player.id]);
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



import express,{Request,Response,Express} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import {Server, Socket} from 'socket.io'
import crypto from 'crypto'
import './Room'
import { generateWords } from './generateWords'
import { PlayerState, RoomState,Player } from './types'
import { endGameHander, updateRoomHandler } from './publicRoomHandlers'
import errorHandler from './middleware/errorMiddleware'
import {userRoutes} from './routes/userRoutes'
import {testRoutes} from './routes/testRoutes'
import connectDB from "./config/db";
import helmet from 'helmet'

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB();

const app: Express = express();

const allowedOrigins = [
    // "'self'",
    "https://geeky-type.vercel.app/",
    "https://geeky-type-git-master-sidd-r.vercel.app/",
    "https://geeky-type-5pshpnone-sidd-r.vercel.app/"
  ]

// app.use(cors({
//   origin: (origin, callback) => {
//     // Check if the origin is in the allowedOrigins array
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET','POST']
// }));

// app.use(helmet())
app.use(helmet.contentSecurityPolicy(
  {
    useDefaults: true,
    directives: {
      "script-src": allowedOrigins,
      "style-src": null,
    },
  }
))

const serverHttp = http.createServer(app);

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use("/api/user",userRoutes)
app.use("/api/test",testRoutes)
app.use(errorHandler)

class Room{
  players: Array<Player> = []
  status:"waiting"|"started" = "waiting"
  startTime: number = 0
  roomId: string
  words: string
  roomDif: "1"|"2"|"3"
  constructor(id:string,words: string,roomDif: "1"|"2"|"3"){
    this.roomId = id
    this.startTime = new Date().getTime()
    this.words = words
    this.roomDif = roomDif
  }

  addPlayer(player:Player) {
    this.players.push(player)
  }

}

export const playerRooms: PlayerState = {};
export const rooms: RoomState = {};
const ROOM_SIZE = 3;

const io = new Server(serverHttp,{cors: {origin:"*"}
//   {
//   origin: (origin, callback) => {
//     // Check if the origin is in the allowedOrigins array
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ["GET", "POST"],
// }
})  

// io.on("connection", (socket:Socket) => {
//   console.log("Hwllo");
//   console.log(socket.id);
  
  
// })

export var publicIO = io.of('/public') 

export var privateIO = io.of('/private')




var onlineUserCount = 0;
var currentRoom:Array<Room> = [new Room(crypto.randomBytes(8).toString("hex"),generateWords("1").join(' '),"1"),new Room(crypto.randomBytes(8).toString("hex"),generateWords("2").join(' '),"2"),new Room(crypto.randomBytes(8).toString("hex"),generateWords("3").join(' '),"3")]


publicIO.on('connection',(socket:Socket) => {
  onlineUserCount++
  console.log("user joined with id:",socket.id);
  console.log("Online players: ",onlineUserCount);
  
  
  socket.on('joinRandomRoom',(user,diff,sendWords) => {
      // console.log(user);
    let curRoomIndex = parseInt(diff)-1
    var player:Player = user
    

    // playerInRoom.set(player,currentRoom)
    currentRoom[curRoomIndex].addPlayer(player);

    socket.join(currentRoom[curRoomIndex].roomId);

    console.log("player with id:",player.id,"diff: ",diff," \njoined room with id:",currentRoom[curRoomIndex].roomId,"and diff: ", curRoomIndex);
    
    rooms[currentRoom[curRoomIndex].roomId] = {
      players: [...currentRoom[curRoomIndex].players,user],
      toType: currentRoom[curRoomIndex].words,
      inGame: false,
      winner: null,
    };

    if (currentRoom[curRoomIndex].players.length >= 1) {
      console.log("room",currentRoom[curRoomIndex].roomId,"timeout started");

      setTimeout(()=> {
        
        if (currentRoom[curRoomIndex].players.length < ROOM_SIZE) {
          console.log("Starting game for room",currentRoom[curRoomIndex].roomId,"without full players");
          
          publicIO.in(currentRoom[curRoomIndex].roomId).emit("start game");
          currentRoom[curRoomIndex] = new Room(crypto.randomBytes(8).toString("hex"),generateWords(diff).join(' '),currentRoom[curRoomIndex].roomDif);
        }
      },25000)
    }

    if (currentRoom[curRoomIndex].players.length >= ROOM_SIZE) {
      sendWords([currentRoom[curRoomIndex].words,true,currentRoom[curRoomIndex].roomId,player.id]);
      rooms[currentRoom[curRoomIndex].roomId].inGame = true;
      publicIO.in(currentRoom[curRoomIndex].roomId).emit("start game");
      console.log("Starting game for room",currentRoom[curRoomIndex].roomId,"with full players");
      

      // currentRoom[curRoomIndex].startTime = new Date().getTime();
      publicIO.in(currentRoom[curRoomIndex].roomId).emit("start game");
      currentRoom[curRoomIndex] = new Room(crypto.randomBytes(8).toString("hex"),generateWords(diff).join(' '),currentRoom[curRoomIndex].roomDif);
      
      // socket.emit("words generated", currentRoom[curRoomIndex].words)
    } else {
      sendWords([currentRoom[curRoomIndex].words,false,currentRoom[curRoomIndex].roomId,player.id]);
    }
 
  })


  // joinRoomHander(socket)
  updateRoomHandler(socket)
  endGameHander(socket)

  socket.on('disconnect',() => {
    onlineUserCount--
    console.log("user with id:",socket.id,"has left");
    console.log("Online players: ",onlineUserCount);
  });
})

privateIO.on('connection',(socket) => {
  console.log(socket.id,'private');

})

app.get('/', (req: Request, res: Response) => res.send('Hello World!'))


serverHttp.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
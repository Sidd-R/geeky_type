import express,{Request,Response,Express} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import {Server, Socket} from 'socket.io'
const app: Express = express()
const serverHttp = http.createServer(app)

const io = new Server(serverHttp,{cors: {
  origin: [
    "http://localhost:3000",
  ]
}})  

export const publicIO = io.of('/public') 

export const privateIO = io.of('/private')


app.use(cors())
dotenv.config()


var onlineUserCount = 0
// var playerInRoom = new Map<Player,Room>()
// var currentRoom = new Room()

publicIO.on('connection',(socket:Socket) => {
  onlineUserCount++
  console.log(socket.id);
  
  socket.on('joinRandomRoom',(data) => {
     
  console.log(socket.id,"hiii", data);

    // if (currentRoom.players.length >= 5) {
    //   currentRoom = new Room()
    //   currentRoom.addPlayer(new Player(socket.id,currentRoom))
    // }
  })
  socket.on('disconnect',() => onlineUserCount--)
})

privateIO.on('connection',(socket) => {
  console.log(socket.id);

})

app.get('/', (req: Request, res: Response) => res.send('Hello World!'))


app.listen(8080, () => console.log(`Example app listening on port 8080!`))
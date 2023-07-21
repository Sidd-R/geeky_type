import express,{Request,Response,Express} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import {Server} from 'socket.io'
 // const express = require('express')
const app: Express = express()
const serverHttp = http.createServer(app)
export const io = new Server(serverHttp,{cors: {
  origin: [
    "http://localhost:3000",
  ]
}})  

app.use(cors())
dotenv.config()


io.on('connection',(socket) => {

})

app.get('/', (req: Request, res: Response) => res.send('Hello World!'))


app.listen(3456, () => console.log(`Example app listening on port 3456!`))
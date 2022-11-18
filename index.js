// Exportacion de todas la variables necesarias
const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose")
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
require('dotenv').config()

const app = express()
const socket = require('socket.io')

// Seteando el server

app.use(cors())
app.use(express.json())

// Defininiemdo las rutas

app.use('/api/auth', userRoutes)
app.use('/api/messages', messageRoutes)

// Conectandome a la DB

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(process.env.MONGO_URL, options)
    .then(() => console.log("Conectado a la DB"))
    .catch(e => console.log('Error DB ' + e))

// Inciando el server local

const server = app.listen(process.env.PORT, () => {
    console.log(`Server connected on PORT ${process.env.PORT}`)
})

// Incializando socket

const io = socket(server, {
    cors:{
        origin:"http://localhost:3000",
        credentials: true,
    }
})

global.onlineUsers = new Map()

io.on('connection', (socket) => {

    global.chatSocket = socket
    socket.on('add-user', (userId)=> {
        onlineUsers.set(userId, socket.id)
    })

    socket.on('send-msg', (data) => {

      const sendUserSocket = onlineUsers.get(data.to)

      if(sendUserSocket){
        socket.to(sendUserSocket).emit('msg-recieve', data.message)
      }
    })
})


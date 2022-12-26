const express = require('express');
const http = require('http')
const path = require('path');
const socket = require('socket.io');
const passport = require('passport');
const mongoose = require('mongoose')
const usersRouter = require('./src/routes/users')
const chats = require('./src/routes/chats')
const searchUsersRouter = require('./src/routes/searchusers')
const cors = require('cors');
const User = require('./src/models/user')

const port = process.env.PORT || 5000
const app = express();


mongoose.connect('mongodb+srv://karnok:Karnok146!@cluster0.areqn.mongodb.net/chatty?retryWrites=true&w=majority');

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Must first load the models
require('./src/models/user');
require('./src/models/chat');
require('./src/models/group');

// Pass the global passport object into the configuration function
require('./src/lib/passport.js')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Allows our Angular application to make HTTP requests to Express application
app.use(cors());


//Routes
app.use(usersRouter)
app.use(searchUsersRouter)
app.use(chats)

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
const server =app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const io = socket(server, {
    cors: {
      origin: "https://chattykks.vercel.app",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      console.log(data)
      const sendUserSocket = onlineUsers.get(data.to);
      console.log(sendUserSocket)
      if (sendUserSocket) {
const chat = {text: data.text, users:[data.from, data.to], sendBy:data.from}
        socket.to(sendUserSocket).emit("msg-recieve", chat);
      }
    });
  });

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const messagesRef = admin.database().ref('messages');
  messagesRef.once('value', (snapshot) => {
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push(childSnapshot.val());
    });
    res.render('index', { messages: messages });
  });
});


// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    // Save the message to Firebase Realtime Database
    const messagesRef = admin.database().ref('messages');
    messagesRef.push({ message: msg });

    // Emit the message to all connected sockets
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


  const admin = require('firebase-admin');

  const serviceAccount = require('./hackster-82fa2-firebase-adminsdk-139hh-cba3809411.json'); // Replace with your actual service account key
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://hackster-82fa2.firebaseio.com/' // Replace with your actual Firebase Database URL
  });
  
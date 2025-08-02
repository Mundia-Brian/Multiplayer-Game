
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.netlify.app', 'https://your-app-name.onrender.com']
    : ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const users = {}; // In-memory user storage

// REST endpoint for user login
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });
  users[username] = { username, score: 0 };
  return res.json({ success: true, username });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

// Game namespaces
const games = ['tic-tac-toe', 'trivia', 'drawing', 'card', 'dice'];

games.forEach(game => {
  const namespace = io.of(`/${game}`);
  namespace.on('connection', (socket) => {
    console.log(`[${game}] user connected: ${socket.id}`);
    socket.on('play', (data) => {
      socket.broadcast.emit('play', data);
    });
  });
});

io.on('connection', (socket) => {
  console.log('general connection established');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

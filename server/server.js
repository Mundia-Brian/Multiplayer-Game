
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:8080', 'https://game.web-designs.store'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // For debugging, allow all origins temporarily
    if (process.env.NODE_ENV === 'development' || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Add a root route to show server is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'Multiplayer Game Server is running!',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      login: 'POST /login',
      socket: 'WebSocket connection available'
    }
  });
});

const users = {}; // In-memory user storage
const gameRooms = {}; // Game rooms storage
const activeGames = {}; // Active game sessions

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// REST endpoint for user login
app.post('/login', (req, res) => {
  console.log('Login request received:', req.body);
  console.log('Headers:', req.headers);
  
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });
  users[username] = { username, score: 0 };
  console.log('User logged in:', username);
  return res.json({ success: true, username });
});

// Handle 404 errors - use Express's built-in handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableRoutes: ['/', '/health', '/login'],
    message: 'This is the backend API server. Frontend should be accessed via Netlify.'
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true
});

// Game namespaces and their handlers
const games = ['tic-tac-toe', 'trivia', 'drawing', 'dice', 'word-guess', 'rock-paper-scissors'];

games.forEach(game => {
  const namespace = io.of(`/${game}`);
  
  namespace.on('connection', (socket) => {
    console.log(`✅ [${game}] user connected: ${socket.id}`);
    console.log(`Transport: ${socket.conn.transport.name}`);
    
    let currentRoom = null;
    let currentUser = null;
    
    // Join game room
    socket.on('joinGame', (data) => {
      currentUser = data.user;
      const roomId = data.roomId || `room_${Date.now()}`;
      currentRoom = roomId;
      
      socket.join(roomId);
      
      // Initialize room if it doesn't exist
      if (!gameRooms[roomId]) {
        gameRooms[roomId] = {
          game: game,
          players: [],
          state: getInitialGameState(game),
          createdAt: Date.now()
        };
      }
      
      // Add player to room
      const player = {
        id: socket.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        joinedAt: Date.now()
      };
      
      gameRooms[roomId].players.push(player);
      
      // Notify other players
      socket.to(roomId).emit('playerJoined', player);
      
      // Send current game state to new player
      socket.emit('gameState', gameRooms[roomId].state);
      
      // Send player list
      socket.emit('playerList', gameRooms[roomId].players);
      
      console.log(`🎮 [${game}] ${currentUser.username} joined room ${roomId}`);
    });
    
    // Game-specific event handlers
    switch(game) {
      case 'tic-tac-toe':
        handleTicTacToe(socket, namespace);
        break;
      case 'trivia':
        handleTrivia(socket, namespace);
        break;
      case 'drawing':
        handleDrawing(socket, namespace);
        break;
      case 'dice':
        handleDice(socket, namespace);
        break;
      case 'word-guess':
        handleWordGuess(socket, namespace);
        break;
      case 'rock-paper-scissors':
        handleRockPaperScissors(socket, namespace);
        break;
    }
    
    // Chat messages
    socket.on('chatMessage', (data) => {
      const message = {
        username: currentUser?.username || 'Anonymous',
        text: data.text,
        timestamp: Date.now()
      };
      
      socket.to(currentRoom).emit('chatMessage', message);
      socket.emit('chatMessage', message); // Echo back to sender
    });
    
    // Disconnect handling
    socket.on('disconnect', (reason) => {
      console.log(`❌ [${game}] disconnected: ${socket.id}, Reason: ${reason}`);
      
      if (currentRoom && gameRooms[currentRoom]) {
        // Remove player from room
        gameRooms[currentRoom].players = gameRooms[currentRoom].players.filter(p => p.id !== socket.id);
        
        // Notify other players
        socket.to(currentRoom).emit('playerLeft', socket.id);
        
        // Clean up empty rooms
        if (gameRooms[currentRoom].players.length === 0) {
          delete gameRooms[currentRoom];
          console.log(`🗑️ [${game}] Room ${currentRoom} cleaned up`);
        }
      }
    });
    
    socket.on('error', (error) => {
      console.log(`❌ [${game}] Socket error: ${socket.id}`, error);
    });
  });
});

// Game-specific handlers
function handleTicTacToe(socket, namespace) {
  socket.on('makeMove', (data) => {
    const { row, col } = data;
    const room = getRoomBySocket(socket);
    
    if (room && room.state.board && !room.state.board[row][col]) {
      // Make the move
      room.state.board[row][col] = room.state.currentPlayer;
      
      // Check for win
      const winner = checkTicTacToeWinner(room.state.board);
      if (winner) {
        room.state.gameOver = true;
        room.state.winner = winner;
      } else if (isBoardFull(room.state.board)) {
        room.state.gameOver = true;
        room.state.winner = 'tie';
      } else {
        // Switch players
        room.state.currentPlayer = room.state.currentPlayer === 'X' ? 'O' : 'X';
      }
      
      // Broadcast updated state
      namespace.to(getRoomId(socket)).emit('gameState', room.state);
    }
  });
  
  socket.on('resetGame', () => {
    const room = getRoomBySocket(socket);
    if (room) {
      room.state = getInitialGameState('tic-tac-toe');
      namespace.to(getRoomId(socket)).emit('gameState', room.state);
    }
  });
}

function handleTrivia(socket, namespace) {
  socket.on('selectAnswer', (data) => {
    const room = getRoomBySocket(socket);
    if (room) {
      // Handle trivia answer
      const isCorrect = data.answer === 'B'; // Sample correct answer
      room.state.scores[socket.id] = (room.state.scores[socket.id] || 0) + (isCorrect ? 10 : 0);
      
      namespace.to(getRoomId(socket)).emit('gameState', room.state);
    }
  });
}

function handleDrawing(socket, namespace) {
  socket.on('draw', (data) => {
    // Broadcast drawing data to other players
    socket.to(getRoomId(socket)).emit('draw', data);
  });
  
  socket.on('clearCanvas', () => {
    // Broadcast clear canvas to other players
    socket.to(getRoomId(socket)).emit('clearCanvas');
  });
}

function handleDice(socket, namespace) {
  socket.on('rollDice', (data) => {
    const room = getRoomBySocket(socket);
    if (room) {
      room.state.scores[socket.id] = (room.state.scores[socket.id] || 0) + data.result;
      namespace.to(getRoomId(socket)).emit('gameState', room.state);
    }
  });
}

function handleWordGuess(socket, namespace) {
  socket.on('submitGuess', (data) => {
    const room = getRoomBySocket(socket);
    if (room) {
      const isCorrect = data.guess.toLowerCase() === room.state.word.toLowerCase();
      if (isCorrect) {
        room.state.scores[socket.id] = (room.state.scores[socket.id] || 0) + 50;
        room.state.gameOver = true;
        room.state.winner = socket.id;
      }
      namespace.to(getRoomId(socket)).emit('gameState', room.state);
    }
  });
}

function handleRockPaperScissors(socket, namespace) {
  socket.on('makeChoice', (data) => {
    const room = getRoomBySocket(socket);
    if (room) {
      room.state.choices[socket.id] = data.choice;
      
      // If both players have made choices, determine winner
      const choices = Object.values(room.state.choices);
      if (choices.length === 2) {
        const winner = determineRPSWinner(choices[0], choices[1]);
        room.state.gameOver = true;
        room.state.winner = winner;
      }
      
      namespace.to(getRoomId(socket)).emit('gameState', room.state);
    }
  });
}

// Utility functions
function getInitialGameState(gameType) {
  switch(gameType) {
    case 'tic-tac-toe':
      return {
        board: [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ],
        currentPlayer: 'X',
        gameOver: false,
        winner: null
      };
    case 'trivia':
      return {
        currentQuestion: 0,
        scores: {},
        gameOver: false
      };
    case 'drawing':
      return {
        canvasData: null
      };
    case 'dice':
      return {
        scores: {},
        gameOver: false
      };
    case 'word-guess':
      return {
        word: 'EXAMPLE',
        scores: {},
        gameOver: false,
        drawer: null
      };
    case 'rock-paper-scissors':
      return {
        choices: {},
        gameOver: false,
        winner: null
      };
    default:
      return {};
  }
}

function checkTicTacToeWinner(board) {
  // Check rows, columns, and diagonals
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
      return board[i][0];
    }
    if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
      return board[0][i];
    }
  }
  if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
    return board[0][2];
  }
  return null;
}

function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== ''));
}

function determineRPSWinner(choice1, choice2) {
  if (choice1 === choice2) return 'tie';
  
  const rules = {
    'rock': 'scissors',
    'paper': 'rock',
    'scissors': 'paper'
  };
  
  return rules[choice1] === choice2 ? choice1 : choice2;
}

function getRoomBySocket(socket) {
  const roomId = getRoomId(socket);
  return roomId ? gameRooms[roomId] : null;
}

function getRoomId(socket) {
  const rooms = Array.from(socket.rooms);
  return rooms.find(room => room !== socket.id);
}

// General connection handler
io.on('connection', (socket) => {
  console.log('✅ General connection established:', socket.id);
  console.log('Transport:', socket.conn.transport.name);
  
  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', socket.id, 'Reason:', reason);
  });
  
  socket.on('error', (error) => {
    console.log('❌ Socket error:', socket.id, error);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
});

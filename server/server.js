
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
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
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
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });
  users[username] = { username, score: 0 };
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
  console.log('Allowed origins:', allowedOrigins);
});

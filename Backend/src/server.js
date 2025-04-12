const app = require('./app');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const http = require('http');


const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

io.use((socket, next) => {
  const authToken = socket.handshake.auth.token;
  if (!authToken) {
    console.log('No token provided');
    return next(new Error('Authentication error'));
  }

  const token = authToken.replace(/^Bearer\s+/i, '');
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification failed:', err.message);
      return next(new Error('Authentication error'));
    }
    
    if (!decoded?.userId) {
      console.log('Token missing user ID');
      return next(new Error('Authentication error'));
    }
    
    socket.user = {
      id: decoded.userId.toString(),
      role: decoded.role,
      username: decoded.username
    };
    
    console.log(`Authenticated user: ${socket.user.id}`);
    next();
  });
});


io.on('connection', (socket) => {
  console.log(`User ${socket.user.id} connected`);
  socket.join(socket.user.id);

  socket.on('disconnect', () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});

app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
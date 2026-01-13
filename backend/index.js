
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const http = require('http'); 
const { Server } = require('socket.io'); 
const notificationRoutes = require('./routes/notificationRoutes');

const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const bidRoutes = require('./routes/bidRoutes');

dotenv.config();
connectDB();

const app = express();


const server = http.createServer(app); 

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", 
    credentials: true,
  },
});


app.set('io', io);

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(`User Joined Room: ${userData._id}`);
    socket.emit('connected');
  });

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED');
  });
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // <--- CRITICAL
const connectDB = require('./config/db');
const http = require('http'); 
const { Server } = require('socket.io'); 

const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();
connectDB();

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app); 

// ⬇️ THIS IS THE CRITICAL PART FOR VERCEL DEPLOYMENT ⬇️
const allowedOrigins = [
  "http://localhost:5173",
  "https://gig-flow-87273hgo4-harsh-mehtas-projects-64ee88d3.vercel.app", // Your Vercel URL
  // If you have a different Vercel URL, add it here too
  "https://gigflow.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Required for cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
// ⬆️ END OF CRITICAL PART ⬆️

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
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
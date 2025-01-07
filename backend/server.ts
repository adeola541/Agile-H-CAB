import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDB } from './config/database';
import WebSocketService from './services/websocket';
import rideRoutes from './routes/ride.routes';
import userRoutes from './routes/user.routes';
import driverRoutes from './routes/driver.routes';
import messageRoutes from './routes/message.routes';
import { errorHandler } from './middleware/error';

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
const webSocketService = new WebSocketService(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/rides', rideRoutes);
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/messages', messageRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

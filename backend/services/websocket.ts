import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import Driver from '../models/Driver';
import Message from '../models/Message';

export default class WebSocketService {
  private io: Server;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  private connectedDrivers: Map<string, string> = new Map(); // driverId -> socketId

  constructor(server: HTTPServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this.setupAuthentication();
    this.setupEventHandlers();
  }

  private setupAuthentication() {
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.user = decoded;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const userId = socket.data.user.id;
      const userType = socket.data.user.type; // 'user' or 'driver'

      // Store connection
      if (userType === 'driver') {
        this.connectedDrivers.set(userId, socket.id);
      } else {
        this.connectedUsers.set(userId, socket.id);
      }

      // Handle location updates
      socket.on('location:update', async (data) => {
        if (userType === 'driver') {
          try {
            await Driver.findByIdAndUpdate(userId, {
              location: {
                type: 'Point',
                coordinates: [data.longitude, data.latitude],
              },
              lastUpdated: new Date(),
            });

            // Broadcast location to relevant users
            this.broadcastDriverLocation(userId, data);
          } catch (error) {
            console.error('Error updating driver location:', error);
          }
        }
      });

      // Handle messages
      socket.on('message:send', async (data) => {
        try {
          const message = await Message.create({
            rideId: data.rideId,
            senderId: userId,
            receiverId: data.receiverId,
            content: data.content,
            type: data.type,
          });

          // Send to recipient
          const recipientSocketId = this.getRecipientSocketId(data.receiverId);
          if (recipientSocketId) {
            this.io.to(recipientSocketId).emit('message:received', message);
          }

          // Confirm to sender
          socket.emit('message:sent', message);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('message:error', { error: 'Failed to send message' });
        }
      });

      // Handle ride status updates
      socket.on('ride:statusUpdate', (data) => {
        const { rideId, status, location } = data;
        this.broadcastRideStatus(rideId, status, location);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (userType === 'driver') {
          this.connectedDrivers.delete(userId);
        } else {
          this.connectedUsers.delete(userId);
        }
      });
    });
  }

  private getRecipientSocketId(recipientId: string): string | undefined {
    return this.connectedUsers.get(recipientId) || this.connectedDrivers.get(recipientId);
  }

  private broadcastDriverLocation(driverId: string, location: any) {
    // Broadcast to users who are waiting for this driver
    this.io.emit(`driver:${driverId}:location`, location);
  }

  private broadcastRideStatus(rideId: string, status: string, location?: any) {
    this.io.emit(`ride:${rideId}:status`, { status, location });
  }

  // Public methods for external use
  public broadcastToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  public broadcastToDriver(driverId: string, event: string, data: any) {
    const socketId = this.connectedDrivers.get(driverId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  public broadcastToAll(event: string, data: any) {
    this.io.emit(event, data);
  }
}

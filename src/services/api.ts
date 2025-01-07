import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Socket instance
let socket: Socket | null = null;

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and MongoDB errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Redirect to login
      return Promise.reject(new Error('Authentication expired. Please login again.'));
    }
    
    // Handle MongoDB validation errors
    if (error.response?.status === 422) {
      return Promise.reject(new Error(error.response.data.message || 'Validation failed'));
    }
    
    // Handle MongoDB duplicate key errors
    if (error.response?.status === 409) {
      return Promise.reject(new Error('This record already exists'));
    }
    
    return Promise.reject(error);
  }
);

// Socket connection
export const connectSocket = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) return null;

  socket = io(API_URL, {
    auth: { token },
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

// API Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/users/register', userData);
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
};

export const rideService = {
  createRide: async (rideData: any) => {
    const response = await api.post('/rides', rideData);
    return response.data;
  },

  updateRideStatus: async (rideId: string, status: string) => {
    const response = await api.patch(`/rides/${rideId}/status`, { status });
    return response.data;
  },

  getRideHistory: async () => {
    const response = await api.get('/rides/history');
    return response.data;
  },

  rateRide: async (rideId: string, rating: number, comment: string) => {
    const response = await api.post(`/rides/${rideId}/rate`, { rating, comment });
    return response.data;
  },

  getNearbyDrivers: async (latitude: number, longitude: number) => {
    const response = await api.get('/drivers/nearby', {
      params: { latitude, longitude },
    });
    return response.data;
  },
};

export const messageService = {
  getMessages: async (rideId: string) => {
    const response = await api.get(`/messages/${rideId}`);
    return response.data;
  },

  sendMessage: async (messageData: any) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  markAsRead: async (messageIds: string[]) => {
    const response = await api.post('/messages/read', { messageIds });
    return response.data;
  },

  subscribeToMessages: (rideId: string, callback: (message: any) => void) => {
    if (!socket) return null;

    socket.on(`message:${rideId}`, callback);
    return () => {
      socket.off(`message:${rideId}`, callback);
    };
  },
};

export const locationService = {
  updateLocation: (location: { latitude: number; longitude: number }) => {
    if (!socket) return;
    socket.emit('location:update', location);
  },

  subscribeToDriverLocation: (driverId: string, callback: (location: any) => void) => {
    if (!socket) return null;

    socket.on(`driver:${driverId}:location`, callback);
    return () => {
      socket.off(`driver:${driverId}:location`, callback);
    };
  },
};

export default api;

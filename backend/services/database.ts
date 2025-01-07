import mongoose from 'mongoose';
import User from '../models/User';
import Ride from '../models/Ride';
import Message from '../models/Message';
import Driver from '../models/Driver';

// User operations
export const createUser = async (userData: any) => {
  const user = new User(userData);
  return await user.save();
};

export const getUser = async (userId: string) => {
  return await User.findById(userId);
};

export const updateUser = async (userId: string, userData: any) => {
  return await User.findByIdAndUpdate(userId, userData, { new: true });
};

// Ride operations
export const createRide = async (rideData: any) => {
  const ride = new Ride(rideData);
  return await ride.save();
};

export const getRide = async (rideId: string) => {
  return await Ride.findById(rideId);
};

export const updateRideStatus = async (rideId: string, status: string) => {
  return await Ride.findByIdAndUpdate(rideId, { status }, { new: true });
};

export const getUserRides = async (userId: string) => {
  return await Ride.find({ userId }).sort({ createdAt: -1 });
};

// Message operations
export const createMessage = async (messageData: any) => {
  const message = new Message(messageData);
  return await message.save();
};

export const getMessages = async (rideId: string) => {
  return await Message.find({ rideId }).sort({ createdAt: 1 });
};

// Real-time operations using MongoDB Change Streams
export const subscribeToMessages = (rideId: string, callback: (messages: any[]) => void) => {
  const changeStream = Message.watch([
    { $match: { 'fullDocument.rideId': rideId } }
  ]);

  changeStream.on('change', async (change) => {
    const messages = await getMessages(rideId);
    callback(messages);
  });

  return () => changeStream.close(); // Return cleanup function
};

export const subscribeToDriverLocation = (driverId: string, callback: (location: any) => void) => {
  const changeStream = Driver.watch([
    { $match: { 'fullDocument._id': new mongoose.Types.ObjectId(driverId) } }
  ]);

  changeStream.on('change', async (change) => {
    const driver = await Driver.findById(driverId);
    if (driver) {
      callback(driver.currentLocation);
    }
  });

  return () => changeStream.close(); // Return cleanup function
};

export const updateDriverLocation = async (driverId: string, location: any) => {
  return await Driver.findByIdAndUpdate(
    driverId,
    { currentLocation: location },
    { new: true }
  );
};

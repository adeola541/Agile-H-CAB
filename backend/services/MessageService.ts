import Message, { IMessage } from '../models/Message';
import { Types } from 'mongoose';

export class MessageService {
  static async createMessage(messageData: Partial<IMessage>) {
    try {
      const message = await Message.create(messageData);
      return message;
    } catch (error) {
      throw error;
    }
  }

  static async getMessages(rideId: string) {
    try {
      return await Message.find({ rideId })
        .sort({ createdAt: 1 })
        .select('-__v');
    } catch (error) {
      throw error;
    }
  }

  static async markAsRead(messageIds: string[], userId: string) {
    try {
      await Message.updateMany(
        {
          _id: { $in: messageIds },
          receiverId: userId,
        },
        { read: true }
      );
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  static async getUnreadCount(userId: string) {
    try {
      return await Message.countDocuments({
        receiverId: userId,
        read: false,
      });
    } catch (error) {
      throw error;
    }
  }
}

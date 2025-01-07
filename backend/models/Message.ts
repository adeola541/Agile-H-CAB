import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  rideId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'location';
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
  senderId: { type: Schema.Types.ObjectId, required: true },
  receiverId: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'image', 'location'],
    default: 'text',
  },
  read: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.model<IMessage>('Message', MessageSchema);

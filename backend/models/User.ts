import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  defaultPaymentMethod?: string;
  preferredLanguage?: string;
  notificationSettings: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    rideUpdates: boolean;
    promotions: boolean;
    security: boolean;
  };
  rating?: number;
  totalRides?: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: String,
  defaultPaymentMethod: String,
  preferredLanguage: { type: String, default: 'en' },
  notificationSettings: {
    pushEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: true },
    rideUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    security: { type: Boolean, default: true },
  },
  rating: { type: Number, default: 0 },
  totalRides: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

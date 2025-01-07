import mongoose, { Schema, Document } from 'mongoose';

export interface IRide extends Document {
  userId: mongoose.Types.ObjectId;
  driverId?: mongoose.Types.ObjectId;
  pickup: {
    location: {
      type: string;
      coordinates: number[];
    };
    address: string;
    instructions?: string;
  };
  destination: {
    location: {
      type: string;
      coordinates: number[];
    };
    address: string;
    instructions?: string;
  };
  status: 'pending' | 'searching' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  fare: {
    base: number;
    distance: number;
    time: number;
    surge?: number;
    total: number;
    currency: string;
  };
  paymentMethod: string;
  scheduledFor?: Date;
  completedAt?: Date;
  distance?: number;
  duration?: number;
  rating?: {
    user?: number;
    driver?: number;
    userComment?: string;
    driverComment?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const RideSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
  pickup: {
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, required: true },
    instructions: String,
  },
  destination: {
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, required: true },
    instructions: String,
  },
  status: {
    type: String,
    enum: ['pending', 'searching', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  fare: {
    base: { type: Number, required: true },
    distance: { type: Number, required: true },
    time: { type: Number, required: true },
    surge: Number,
    total: { type: Number, required: true },
    currency: { type: String, default: 'CFA' },
  },
  paymentMethod: { type: String, required: true },
  scheduledFor: Date,
  completedAt: Date,
  distance: Number,
  duration: Number,
  rating: {
    user: { type: Number, min: 1, max: 5 },
    driver: { type: Number, min: 1, max: 5 },
    userComment: String,
    driverComment: String,
  },
}, {
  timestamps: true,
});

// Create geospatial indexes for location-based queries
RideSchema.index({ 'pickup.location': '2dsphere' });
RideSchema.index({ 'destination.location': '2dsphere' });

export default mongoose.model<IRide>('Ride', RideSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    type: 'comfort' | 'executive' | 'max';
    features: string[];
  };
  location: {
    type: string;
    coordinates: number[];
  };
  status: 'available' | 'busy' | 'offline';
  rating: number;
  totalRides: number;
  documents: {
    license: string;
    insurance: string;
    registration: string;
    backgroundCheck: string;
    expiryDates: {
      license: Date;
      insurance: Date;
      registration: Date;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: { type: String, required: true },
  vehicleInfo: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['comfort', 'executive', 'max'], required: true },
    features: [String],
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline',
  },
  rating: { type: Number, default: 0 },
  totalRides: { type: Number, default: 0 },
  documents: {
    license: String,
    insurance: String,
    registration: String,
    backgroundCheck: String,
    expiryDates: {
      license: Date,
      insurance: Date,
      registration: Date,
    },
  },
}, {
  timestamps: true,
});

// Create geospatial index for location-based queries
DriverSchema.index({ location: '2dsphere' });

export default mongoose.model<IDriver>('Driver', DriverSchema);

import { Timestamp, GeoPoint } from 'firebase/firestore';
import { Types } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
  defaultPaymentMethod?: string;
  preferredLanguage?: string;
  notificationSettings?: NotificationSettings;
  rating?: number;
  totalRides?: number;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  rideUpdates: boolean;
  promotions: boolean;
  security: boolean;
}

export interface Driver {
  _id: Types.ObjectId;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  profilePicture: string;
  vehicleInfo: VehicleInfo;
  location: Location;
  lastUpdated: Date;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  totalRides: number;
  documents: DriverDocuments;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  type: 'comfort' | 'executive' | 'max';
  features: string[];
}

export interface DriverDocuments {
  license: string;
  insurance: string;
  registration: string;
  backgroundCheck: string;
  expiryDates: {
    license: Date;
    insurance: Date;
    registration: Date;
  };
}

export interface Ride {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId;
  driverId?: Types.ObjectId;
  pickup: Location;
  destination: Location;
  status: RideStatus;
  fare: {
    base: number;
    distance: number;
    time: number;
    surge?: number;
    total: number;
    currency: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
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
}

export type RideStatus =
  | 'pending'
  | 'searching'
  | 'accepted'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Message {
  _id: Types.ObjectId;
  id: string;
  rideId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'location';
  timestamp: Date;
  read: boolean;
}

export interface PaymentMethod {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId;
  type: 'card' | 'mobile_money' | 'cash';
  details: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    provider?: string;
  };
  isDefault: boolean;
  createdAt: Date;
}

export interface Promotion {
  _id: Types.ObjectId;
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usageCount: number;
  conditions?: {
    minFare?: number;
    maxDiscount?: number;
    userType?: 'new' | 'existing' | 'all';
    rideType?: string[];
  };
}

export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

import Ride, { IRide } from '../models/Ride';
import Driver from '../models/Driver';
import User from '../models/User';
import { Types } from 'mongoose';

export class RideService {
  static async createRide(rideData: Partial<IRide>) {
    try {
      // Calculate fare
      const fare = await this.calculateFare(
        rideData.pickup.location.coordinates,
        rideData.destination.location.coordinates
      );

      const ride = await Ride.create({
        ...rideData,
        fare,
        status: 'pending',
      });

      // Find nearby drivers
      const nearbyDrivers = await this.findNearbyDrivers(
        rideData.pickup.location.coordinates,
        5000 // 5km radius
      );

      return { ride, nearbyDrivers };
    } catch (error) {
      throw error;
    }
  }

  static async findNearbyDrivers(coordinates: number[], maxDistance: number) {
    try {
      return await Driver.find({
        status: 'available',
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: coordinates,
            },
            $maxDistance: maxDistance,
          },
        },
      }).select('-password');
    } catch (error) {
      throw error;
    }
  }

  static async calculateFare(pickup: number[], destination: number[]) {
    // Basic fare calculation
    const baseRate = 500; // CFA
    const perKmRate = 100; // CFA
    const perMinRate = 50; // CFA

    // Calculate distance in kilometers
    const distance = await this.calculateDistance(pickup, destination);
    
    // Estimate time in minutes
    const estimatedTime = distance * 3; // Rough estimate: 3 minutes per km

    // Calculate fare components
    const baseFare = baseRate;
    const distanceFare = distance * perKmRate;
    const timeFare = estimatedTime * perMinRate;

    // Check for surge pricing
    const surgeFactor = await this.checkSurgePricing(pickup);

    return {
      base: baseFare,
      distance: distanceFare,
      time: timeFare,
      surge: surgeFactor > 1 ? surgeFactor : undefined,
      total: (baseFare + distanceFare + timeFare) * surgeFactor,
      currency: 'CFA',
    };
  }

  static async calculateDistance(pickup: number[], destination: number[]) {
    // Haversine formula for calculating distance between coordinates
    const [lat1, lon1] = pickup;
    const [lat2, lon2] = destination;
    const R = 6371; // Earth's radius in km

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  static async checkSurgePricing(location: number[]) {
    try {
      // Count active rides in the area
      const activeRides = await Ride.countDocuments({
        'pickup.location': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: location,
            },
            $maxDistance: 5000, // 5km radius
          },
        },
        status: { $in: ['pending', 'searching', 'accepted'] },
      });

      // Count available drivers
      const availableDrivers = await Driver.countDocuments({
        status: 'available',
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: location,
            },
            $maxDistance: 5000,
          },
        },
      });

      // Calculate surge factor based on demand/supply ratio
      if (availableDrivers === 0) return 2.0; // Maximum surge
      const ratio = activeRides / availableDrivers;
      if (ratio > 2) return 2.0;
      if (ratio > 1.5) return 1.75;
      if (ratio > 1) return 1.5;
      if (ratio > 0.75) return 1.25;
      return 1.0;
    } catch (error) {
      console.error('Error checking surge pricing:', error);
      return 1.0; // Default to no surge if error
    }
  }

  static async updateRideStatus(rideId: string, status: string, driverId?: string) {
    try {
      const update: any = { status };
      if (driverId) {
        update.driverId = driverId;
      }
      if (status === 'completed') {
        update.completedAt = new Date();
      }

      const ride = await Ride.findByIdAndUpdate(rideId, update, { new: true });
      return ride;
    } catch (error) {
      throw error;
    }
  }

  static async getRideHistory(userId: string) {
    try {
      return await Ride.find({ userId })
        .sort({ createdAt: -1 })
        .populate('driverId', 'firstName lastName profilePicture rating')
        .select('-__v');
    } catch (error) {
      throw error;
    }
  }

  static async rateRide(rideId: string, rating: number, comment: string, isDriver: boolean) {
    try {
      const ride = await Ride.findById(rideId);
      if (!ride) throw new Error('Ride not found');

      const ratingField = isDriver ? 'rating.user' : 'rating.driver';
      const commentField = isDriver ? 'rating.userComment' : 'rating.driverComment';

      await Ride.findByIdAndUpdate(rideId, {
        $set: {
          [ratingField]: rating,
          [commentField]: comment,
        },
      });

      // Update user/driver average rating
      const targetId = isDriver ? ride.userId : ride.driverId;
      const Model = isDriver ? User : Driver;

      const rides = await Ride.find({
        [isDriver ? 'userId' : 'driverId']: targetId,
        'rating.driver': { $exists: true },
      });

      const avgRating =
        rides.reduce((acc, r) => acc + (isDriver ? r.rating?.user || 0 : r.rating?.driver || 0), 0) /
        rides.length;

      await Model.findByIdAndUpdate(targetId, { rating: avgRating });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

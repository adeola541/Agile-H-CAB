import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  GeoPoint,
} from 'firebase/firestore';

// User-related operations
export const createUser = async (userId: string, userData: any) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Ride-related operations
export const createRide = async (rideData: any) => {
  try {
    const rideRef = doc(collection(db, 'rides'));
    await setDoc(rideRef, {
      ...rideData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return rideRef.id;
  } catch (error) {
    console.error('Error creating ride:', error);
    throw error;
  }
};

export const updateRideStatus = async (rideId: string, status: string) => {
  try {
    await updateDoc(doc(db, 'rides', rideId), {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating ride status:', error);
    throw error;
  }
};

export const getRide = async (rideId: string) => {
  try {
    const rideDoc = await getDoc(doc(db, 'rides', rideId));
    return rideDoc.exists() ? rideDoc.data() : null;
  } catch (error) {
    console.error('Error getting ride:', error);
    throw error;
  }
};

export const getUserRides = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'rides'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user rides:', error);
    throw error;
  }
};

// Driver-related operations
export const updateDriverLocation = async (driverId: string, location: { latitude: number; longitude: number }) => {
  try {
    await updateDoc(doc(db, 'drivers', driverId), {
      location: new GeoPoint(location.latitude, location.longitude),
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating driver location:', error);
    throw error;
  }
};

export const subscribeToDriverLocation = (driverId: string, callback: (location: any) => void) => {
  return onSnapshot(doc(db, 'drivers', driverId), (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        lastUpdated: data.lastUpdated,
      });
    }
  });
};

// Chat-related operations
export const createMessage = async (rideId: string, messageData: any) => {
  try {
    const messageRef = doc(collection(db, 'rides', rideId, 'messages'));
    await setDoc(messageRef, {
      ...messageData,
      createdAt: Timestamp.now(),
    });
    return messageRef.id;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const subscribeToMessages = (rideId: string, callback: (messages: any[]) => void) => {
  const q = query(
    collection(db, 'rides', rideId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

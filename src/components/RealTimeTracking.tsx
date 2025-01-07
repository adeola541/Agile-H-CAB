import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { decode } from '@mapbox/polyline';
import { subscribeToDriverLocation, updateDriverLocation } from '../backend/services/database';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const RealTimeTracking = ({ 
  driverId,
  destination,
  pickup,
  onLocationUpdate 
}) => {
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const watchId = useRef(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        getLocation();
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "H-Cab Location Permission",
            message: "H-Cab needs access to your location to provide ride services",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          Alert.alert(
            "Location Permission Denied",
            "H-Cab needs location access to function properly. Please enable it in your settings."
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const location = { latitude, longitude };
        setCurrentLocation(location);
        onLocationUpdate(location);

        // If this is the driver's app, update their location
        if (auth.currentUser?.uid === driverId) {
          updateDriverLocation(driverId, location);
        }
      },
      error => {
        console.error('Error getting location:', error);
        Alert.alert(
          "Location Error",
          "Unable to get your current location. Please check your device settings."
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    watchId.current = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const location = { latitude, longitude };
        setCurrentLocation(location);
        onLocationUpdate(location);

        // If this is the driver's app, update their location
        if (auth.currentUser?.uid === driverId) {
          updateDriverLocation(driverId, location);
        }
      },
      error => console.error('Error watching location:', error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
  };

  const getRouteDirections = async (startLoc, destinationLoc) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}&key=AIzaSywZl3Fc-1dqRbkbczzxltxzAy8INlnUfdP`
      );
      const json = await response.json();
      
      if (json.routes.length) {
        const points = decode(json.routes[0].overview_polyline.points);
        const coords = points.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setRouteCoordinates(coords);

        // Fit map to show entire route
        const coordinates = coords.map(coord => ({
          latitude: coord.latitude,
          longitude: coord.longitude,
        }));
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error getting route directions:', error);
      Alert.alert(
        "Route Error",
        "Unable to get route directions. Please try again."
      );
    }
  };

  useEffect(() => {
    requestLocationPermission();
    
    // Subscribe to driver location updates if this is the user's app
    if (auth.currentUser?.uid !== driverId) {
      const unsubscribe = subscribeToDriverLocation(driverId, (location) => {
        setDriverLocation(location);
      });
      return () => {
        unsubscribe();
        if (watchId.current) {
          Geolocation.clearWatch(watchId.current);
        }
      };
    }
    
    return () => {
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, [driverId]);

  useEffect(() => {
    if (currentLocation && destination) {
      getRouteDirections(currentLocation, destination);
    }
  }, [currentLocation, destination]);

  if (!currentLocation) return null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...currentLocation,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}>
        {/* User's current location */}
        <Marker
          coordinate={currentLocation}
          title="You are here"
          pinColor="#1A73E8"
        />

        {/* Driver's location */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Driver"
            pinColor="#34A853">
            <View style={styles.driverMarker}>
              <View style={styles.driverDot} />
            </View>
          </Marker>
        )}

        {/* Pickup location */}
        {pickup && (
          <Marker
            coordinate={pickup}
            title="Pickup"
            pinColor="#4285F4"
          />
        )}

        {/* Destination */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="#EA4335"
          />
        )}

        {/* Route line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#1A73E8"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  driverMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(52, 168, 83, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34A853',
  },
});

export default RealTimeTracking;

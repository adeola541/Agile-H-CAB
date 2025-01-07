import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Ionicons';
import RealTimeTracking from '../../components/RealTimeTracking';

const vehicleTypes = [
  {
    id: 'comfort',
    name: 'Comfort',
    image: require('../../assets/images/car1.png'),
    price: 'CFA150',
    eta: '5 min away',
  },
  {
    id: 'executive',
    name: 'Executive',
    image: require('../../assets/images/car2.png'),
    price: 'CFA250',
    eta: '8 min away',
  },
  {
    id: 'max',
    name: 'Max',
    image: require('../../assets/images/car3.png'),
    price: 'CFA350',
    eta: '3 min away',
  },
];

const BookRideScreen = ({ navigation }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[0]);
  const [driverLocation, setDriverLocation] = useState(null);

  // Simulate driver movement
  useEffect(() => {
    if (pickup) {
      const simulateDriverMovement = setInterval(() => {
        setDriverLocation(prev => {
          if (!prev) return pickup;
          return {
            latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
            longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
          };
        });
      }, 3000);

      return () => clearInterval(simulateDriverMovement);
    }
  }, [pickup]);

  const handleLocationUpdate = (location) => {
    if (!pickup) {
      setPickup(location);
    }
  };

  const handleBooking = () => {
    navigation.navigate('DriverInfo', {
      driver: {
        name: 'David Brown',
        avatar: require('../../assets/images/driver-avatar.jpg'),
        rating: 4.8,
        vehicle: selectedVehicle,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <RealTimeTracking
          driverLocation={driverLocation}
          destination={destination}
          pickup={pickup}
          onLocationUpdate={handleLocationUpdate}
        />
      </View>

      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Your location"
          onPress={(data, details = null) => {
            setPickup({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
          }}
          query={{
            key: 'AIzaSywZl3Fc-1dqRbkbczzxltxzAy8INlnUfdP',
            language: 'en',
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInput: styles.textInput,
          }}
        />

        <GooglePlacesAutocomplete
          placeholder="Where to?"
          onPress={(data, details = null) => {
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
          }}
          query={{
            key: 'AIzaSywZl3Fc-1dqRbkbczzxltxzAy8INlnUfdP',
            language: 'en',
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInput: styles.textInput,
          }}
        />
      </View>

      <ScrollView style={styles.vehicleList} horizontal>
        {vehicleTypes.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.id}
            style={[
              styles.vehicleItem,
              selectedVehicle.id === vehicle.id && styles.selectedVehicle,
            ]}
            onPress={() => setSelectedVehicle(vehicle)}>
            <Image source={vehicle.image} style={styles.vehicleImage} />
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <Text style={styles.vehiclePrice}>{vehicle.price}</Text>
            <Text style={styles.vehicleEta}>{vehicle.eta}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!pickup || !destination) && styles.disabledButton,
          ]}
          onPress={handleBooking}
          disabled={!pickup || !destination}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  autocompleteContainer: {
    flex: 0,
    marginHorizontal: 0,
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  vehicleList: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  vehicleItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginRight: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    alignItems: 'center',
  },
  selectedVehicle: {
    borderColor: '#1A73E8',
    borderWidth: 2,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehiclePrice: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: 'bold',
  },
  vehicleEta: {
    fontSize: 12,
    color: '#666',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    backgroundColor: '#1A73E8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookRideScreen;

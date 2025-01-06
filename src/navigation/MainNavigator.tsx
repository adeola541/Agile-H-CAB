import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// TODO: Import actual screens once created
const HomeScreen = () => null;
const BookingScreen = () => null;
const ProfileScreen = () => null;

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;

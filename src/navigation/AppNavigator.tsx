import React from 'react';
import { Animated, Easing } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';

import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import NumberVerification from '../screens/auth/NumberVerification';
import HomeScreen from '../screens/home/HomeScreen';
import BookRideScreen from '../screens/booking/BookRideScreen';
import ScheduleRideScreen from '../screens/booking/ScheduleRideScreen';
import IntroductionScreen from '../screens/onboarding/IntroductionScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import DriverInfoScreen from '../screens/driver/DriverInfoScreen';
import ChatScreen from '../screens/chat/ChatScreen';

const Stack = createStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 200,
    easing: Easing.linear,
  },
};

const customTransition = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: config,
    close: closeConfig,
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Introduction"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000000' },
          ...customTransition,
        }}>
        <Stack.Screen 
          name="Introduction" 
          component={IntroductionScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen 
          name="NumberVerification" 
          component={NumberVerification}
          options={{
            ...TransitionPresets.ModalPresentationIOS,
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            ...TransitionPresets.FadeFromBottomAndroid,
          }}
        />
        <Stack.Screen 
          name="BookRide" 
          component={BookRideScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen 
          name="ScheduleRide" 
          component={ScheduleRideScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen 
          name="DriverInfo" 
          component={DriverInfoScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handleBookRide = () => {
    navigation.navigate('BookRide');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/images/traffic-bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <SafeAreaView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>H-Cab</Text>
          </View>
          
          <View style={styles.mainContent}>
            <Text style={styles.title}>Welcome to H-Cab</Text>
            <Text style={styles.subtitle}>Your ride, your way</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleBookRide}>
                <Text style={styles.buttonText}>Book a ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1A73E8',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Love my ride, love my life',
    description: 'Cars are the ultimate symbol of freedom, independence and individuality. They offer the freedom to go anywhere, whenever it suits and with whom one chooses.',
    author: '- Sarah Redshaw',
    image: require('../../assets/images/car1.png'),
  },
  {
    title: 'Love at first drive',
    description: 'The car trip can draw the family together, as it was in the days before television when parents and children actually talked to each other.',
    author: '- Andrew H. Malcolm',
    image: require('../../assets/images/car2.png'),
  },
  {
    title: 'Your perfect partner',
    description: 'They can be your partner on vacations and business.',
    author: '',
    image: require('../../assets/images/car3.png'),
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('SignUp');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={onboardingData[currentIndex].image}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{onboardingData[currentIndex].title}</Text>
        <Text style={styles.description}>{onboardingData[currentIndex].description}</Text>
        {onboardingData[currentIndex].author && (
          <Text style={styles.author}>{onboardingData[currentIndex].author}</Text>
        )}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1 ? 'GO' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1B1E',
  },
  image: {
    width: width,
    height: height * 0.5,
  },
  contentContainer: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 24,
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    marginRight: 8,
  },
  paginationDotActive: {
    opacity: 1,
    width: 20,
  },
  button: {
    backgroundColor: '#2D68FF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;

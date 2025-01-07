import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  ImageBackground,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../assets/images/car1.png'),
    title: 'Love my ride, love my life',
    description:
      'Cars are the ultimate symbol of freedom, independence and individualism. They offer the freedom to "go anywhere," whenever it suits and with whom one chooses.',
    author: '- Sarah Redshaw',
  },
  {
    id: '2',
    image: require('../../assets/images/car2.png'),
    title: 'Love at first drive',
    description:
      'The car trip can draw the family together, as it was in the days before television when parents and children actually talked to each other.',
    author: '- Andrew H. Malcolm',
  },
  {
    id: '3',
    image: require('../../assets/images/car3.png'),
    title: 'Your perfect ride awaits',
    description: 'They can be your partner on vacations and business.',
    author: '',
  },
];

const IntroductionScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    const titleOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
    });

    const titleTranslate = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, -50],
    });

    return (
      <Animated.View style={[styles.slide, { transform: [{ scale }] }]}>
        <ImageBackground source={item.image} style={styles.image}>
          <View style={styles.contentOverlay}>
            <Animated.View
              style={{
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslate }],
              }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              {item.author ? <Text style={styles.author}>{item.author}</Text> : null}
            </Animated.View>
          </View>
        </ImageBackground>
      </Animated.View>
    );
  };

  const Paginator = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.5, 1],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          const width = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity,
                  transform: [{ scale }],
                  width,
                },
              ]}
              key={index}
            />
          );
        })}
      </View>
    );
  };

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Add fade out animation before navigation
      Animated.timing(scrollX, {
        toValue: currentIndex * width + width,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate('SignUp');
      });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        scrollEventThrottle={16}
      />
      <Paginator />
      <TouchableOpacity
        style={[
          styles.button,
          currentIndex === slides.length - 1 && styles.getStartedButton,
        ]}
        onPress={scrollTo}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    height,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  contentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    justifyContent: 'flex-end',
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'left',
    fontStyle: 'italic',
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    position: 'absolute',
    bottom: 100,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 8,
  },
  lastDot: {
    marginRight: 0,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#1A73E8',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: width - 60,
  },
  getStartedButton: {
    backgroundColor: '#1A73E8',
    transform: [{ scale: 1.1 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default IntroductionScreen;

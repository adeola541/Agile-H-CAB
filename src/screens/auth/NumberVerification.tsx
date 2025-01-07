import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const NumberVerification = ({ navigation }) => {
  const [code, setCode] = useState('');

  const handleNumberPress = (num: string) => {
    if (code.length < 4) {
      setCode(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
  };

  const handleVerify = () => {
    if (code.length === 4) {
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Number Verification</Text>
        <Text style={styles.subtitle}>
          Enter the verification code we just sent to your phone number.
        </Text>
      </View>

      <View style={styles.codeContainer}>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={styles.codeBox}>
            <Text style={styles.codeText}>{code[index] || ''}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, code.length === 4 && styles.activeButton]}
        onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify Now</Text>
      </TouchableOpacity>

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <TouchableOpacity
            key={num}
            style={styles.key}
            onPress={() => handleNumberPress(num.toString())}>
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.key}>
          <Text style={styles.keyText}></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.key}
          onPress={() => handleNumberPress('0')}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={handleDelete}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#1A73E8',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  codeBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#1A73E8',
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8',
  },
  verifyButton: {
    backgroundColor: '#1A73E8',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    opacity: 0.5,
  },
  activeButton: {
    opacity: 1,
  },
  verifyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  key: {
    width: '30%',
    aspectRatio: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  keyText: {
    fontSize: 24,
    color: '#000',
  },
});

export default NumberVerification;

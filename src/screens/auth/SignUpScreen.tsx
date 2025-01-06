import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+237');
  const navigation = useNavigation();

  const handleSignUp = () => {
    // TODO: Implement sign up logic
    console.log('Sign up with:', { email, phoneNumber });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur. Ac pulvinar eros duis ultrices non
          tincidunque a mauris id.
        </Text>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            style={styles.input}
          />

          <View style={styles.phoneContainer}>
            <Input
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              style={styles.input}
            />
            <Text style={styles.countryCode}>{countryCode}</Text>
          </View>

          <Button
            title="Sign Up"
            onPress={handleSignUp}
            style={styles.button}
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an Account?</Text>
            <Button
              title="Log In"
              onPress={handleLogin}
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D68FF',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 30,
    lineHeight: 24,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  input: {
    marginBottom: 20,
  },
  phoneContainer: {
    position: 'relative',
  },
  countryCode: {
    position: 'absolute',
    right: 15,
    top: '50%',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2D68FF',
    marginTop: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: 'transparent',
  },
  loginButtonText: {
    color: '#2D68FF',
  },
});

export default SignUpScreen;

// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { API_URL } from '../utility/constant';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackMsg, setSnackMsg] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setSnackMsg('Passwords do not match!');
      return;
    }

    // Simulate DB save
    // await AsyncStorage.setItem('user_name', name);
    // await AsyncStorage.setItem('user_email', email);
    // await AsyncStorage.setItem('user_password', password);

    try {
      const response = await fetch(API_URL+'/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error(`Server responded ${response.status}`);
      }

      setSnackMsg('Signup successful! Redirecting...');
      setTimeout(() => navigation.navigate('Login'), 1500);
    } catch (error) {
      console.log('Error:', error);
      setSnackMsg('Something went wrong!');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Sign Up
      </Text>

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSignup} style={styles.button}>
        Sign Up
      </Button>
      <Button onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Button>

      <Snackbar
        visible={!!snackMsg}
        onDismiss={() => setSnackMsg('')}
        duration={2000}
      >
        {snackMsg}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: { marginBottom: 20 },
  input: { width: '90%', marginBottom: 12 },
  button: { width: '90%', marginTop: 12 },
});

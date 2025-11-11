// src/screens/LoginScreen.tsx
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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  const handleLogin = async () => {
    // Replace with your backend API / DB logic
    if (email === '' || password === '') {
      setSnackVisible(true);
      return;
    }

    // simulate DB check
    // const savedEmail = await AsyncStorage.getItem('user_email');
    // const savedPassword = await AsyncStorage.getItem('user_password');

    try {
          const response = await fetch(API_URL+'/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({  email, password }),
          });
    
          if (!response.ok) {
            throw new Error(`Server responded ${response.status}`);
          }
          navigation.navigate('Main');
        } catch (error) {
          console.log('Error:', error);
          setSnackVisible(true);
        }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Login</Text>
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
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign up
      </Button>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}
      >
        Invalid email or password.
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { marginBottom: 20 },
  input: { width: '90%', marginBottom: 12 },
  button: { width: '90%', marginTop: 12 },
});

/* eslint-disable react-native/no-inline-styles */
// src/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import LoginScreen from './auth/LoginScreen';
import SignupScreen from './auth/SignupScreen';
import { RootStackParamList } from './utility/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Main Screen 🎉</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  );
}

// src/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './auth/LoginScreen';
import SignupScreen from './auth/SignupScreen';
import MainScreen from './pages/MainScreen';
import { RootStackParamList } from './utility/navigation';
import LeftEyeTestScreen from './pages/color-vision/LeftEyeTestScreen';
import ColorVisionTestScreen from './pages/color-vision/ColorVisionTestScreen';
import RightEyeTestScreen from './pages/color-vision/RightEyeTestScreen';
import TestScoresScreen from './pages/scores/TestScoresScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="ColorVisionTest" component={ColorVisionTestScreen} />
      <Stack.Screen name="LeftEyeTest" component={LeftEyeTestScreen} />
      <Stack.Screen name="RightEyeTest" component={RightEyeTestScreen} />
      <Stack.Screen name="TestScores" component={TestScoresScreen} />
    </Stack.Navigator>
  );
}

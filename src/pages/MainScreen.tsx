/* eslint-disable react-native/no-inline-styles */
// src/screens/MainScreen.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utility/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export default function MainScreen({ navigation }: Props) {
  const [userName, setUserName] = useState<string>('');

  // 🧠 Load username when the screen mounts
  useEffect(() => {
    const loadUser = async () => {
      const storedName = await AsyncStorage.getItem('user_name');
      if (storedName) setUserName(storedName);
    };
    loadUser();
  }, []);

  // ✅ Test buttons (same as in Kivy)
  const tests = [
    { name: 'Distance Vision Test', route: 'DistanceVision' },
    { name: 'Near Vision Test', route: 'NearVision' },
    { name: 'Color Vision Test', route: 'ColorVisionTest' },
    { name: 'Contrast Sensitivity Test', route: 'ContrastTest' },
    { name: 'Amsler Grid Test', route: 'AmslerTest' },
    { name: 'Stereopsis Test', route: 'StereopsisTest' },
    { name: 'Scores', route: 'TestScores' },
  ];

  const handleNavigate = (route: string) => {
    navigation.navigate(route as never);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.root}>
      {/* 💠 Background matches translucent bright blue */}
      <View style={styles.backgroundOverlay} />

      {/* 🪪 Welcome Section */}
      <Card style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>
          Hello {userName || 'User'}!{'\n'}Welcome to EyeDoc 👁️
        </Text>
      </Card>

      {/* 🧩 Tests Section */}
      <Card style={styles.testsCard}>
        <Text style={styles.sectionTitle}>Vision Tests</Text>

        <View style={styles.buttonsLayout}>
          {tests.map(test => (
            <Button
              key={test.name}
              mode="contained"
              style={styles.testButton}
              labelStyle={{ color: 'white', fontWeight: '600' }}
              onPress={() => handleNavigate(test.route)}
            >
              {test.name}
            </Button>
          ))}
        </View>

        <Button
          mode="outlined"
          textColor="#0d6efd"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 124, 255, 0.15)', // translucent bright blue
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 124, 255, 0.15)',
  },
  welcomeCard: {
    backgroundColor: '#3399FF',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  testsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 3,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  testButton: {
    backgroundColor: '#3399FF',
    marginVertical: 6,
    borderRadius: 12,
  },
  logoutButton: {
    marginTop: 25,
    borderRadius: 12,
  },
});

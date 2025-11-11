// src/screens/MainScreen.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utility/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export default function MainScreen({ navigation }: Props) {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem('user_name');
      if (name) setUserName(name);
    };
    loadUserName();
  }, []);

  const tests = [
    'Distance Vision Test',
    'Near Vision Test',
    'Color Vision Test',
    'Contrast Sensitivity Test',
    'Amsler Grid Test',
    'Stereopsis Test',
    'Scores',
  ];

  const handleTestPress = (test: string) => {
    console.log(`Navigating to ${test}`);
    // you can later navigate to specific test screens
  };

  return (
    <ScrollView style={styles.container}>
      {/* Translucent blue-like background via Paper theme */}
      <Card style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>
          Hello {userName || 'User'}!{'\n'}Welcome to EyeDoc 👁️
        </Text>
      </Card>

      <Card style={styles.testsCard}>
        <Text style={styles.sectionTitle}>Vision Tests</Text>

        {tests.map((test) => (
          <Button
            key={test}
            mode="contained"
            style={styles.testButton}
            onPress={() => handleTestPress(test)}
          >
            {test}
          </Button>
        ))}

        <Button
          mode="outlined"
          textColor="#0d6efd"
          style={styles.logoutBtn}
          onPress={async () => {
            await AsyncStorage.clear();
            navigation.navigate('Login');
          }}
        >
          Logout
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 124, 255, 0.15)', // translucent bright blue
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#3498db',
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  testsCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
  testButton: {
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#3498db',
  },
  logoutBtn: {
    marginTop: 20,
    borderRadius: 10,
  },
});

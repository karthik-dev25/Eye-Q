import React, { useState } from 'react';
import { View,Image, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  RadioButton,
  Button,
  Card,
  Provider,
  Dialog,
  Portal,
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../utility/constant';

export default function StereopsisTestScreen() {
  const [q1, setQ1] = useState<string>('');
  const [q2, setQ2] = useState<string>('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogText, setDialogText] = useState('');

  const handleSubmit = async () => {
    let score = 0;

    // Q1 scoring logic
    if (q1 === '1') score = 1;
    else if (q1 === '2') score = 2;
    else if (q1 === '3') score = 3;
    else if (q1 === '4+') score = 0;

    // Q2 logic
    if (q2 === 'No') score = 0;

    const remark = score === 3 ? 'Excellent' : 'Action Needed';

    setDialogText(`Result: ${score} points\nRemark: ${remark}`);
    setDialogVisible(true);

    try {
      const userId = await AsyncStorage.getItem('user_id');

      if (userId) {
        await axios.post(API_URL + '/testscore', {
          userId,
          testName: 'Stereopsis Test',
          testTotalScore: 3,
          testScore: score,
          remark: remark,
        });
      }
    } catch (err: any) {
      console.log('Error saving stereopsis score:', err.message);
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Stereopsis Test</Text>

        <Image
          source={require("../../assets/lang.jpg")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Q1 */}
        <Text style={styles.question}>
          How many figures is the patient able to identify?
        </Text>

        <RadioButton.Group onValueChange={val => setQ1(val)} value={q1}>
          <Card style={styles.card}>
            {['1', '2', '3', '4+'].map(opt => (
              <View key={opt} style={styles.optionRow}>
                <RadioButton value={opt} />
                <Text style={styles.optionText}>{opt}</Text>
              </View>
            ))}
          </Card>
        </RadioButton.Group>

        {/* Q2 */}
        <Text style={styles.question}>
          Are the images clearly identifiable by the patient?
        </Text>

        <RadioButton.Group onValueChange={val => setQ2(val)} value={q2}>
          <Card style={styles.card}>
            {['Yes', 'No'].map(opt => (
              <View key={opt} style={styles.optionRow}>
                <RadioButton value={opt} />
                <Text style={styles.optionText}>{opt}</Text>
              </View>
            ))}
          </Card>
        </RadioButton.Group>

        <Button
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!q1 || !q2}
        >
          Submit
        </Button>

        {/* Dialog */}
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          >
            <Dialog.Title>Stereopsis Test Result</Dialog.Title>
            <Dialog.Content>
              <Text>{dialogText}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 260,
    marginVertical: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  optionText: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#1e88e5',
    paddingVertical: 8,
  },
});

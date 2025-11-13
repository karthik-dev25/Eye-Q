/* eslint-disable react-native/no-inline-styles */
// src/screens/LeftEyeTestScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Image, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, Dialog, Portal, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utility/navigation';
import { pdfImages } from '../utility/constant';

type Props = NativeStackScreenProps<RootStackParamList, 'LeftEyeTest'>;

export default function LeftEyeTestScreen({ navigation }: Props) {
  const correctAnswers = [
    '12', '8', '29', '5', '3', '15', '74', '6', '45', '5', '7', '16', '73', '', '', '26', '42'
  ];

  // images loaded via require(...)
  const images = useMemo(() => pdfImages, []);

  const totalQuestions = Math.min(correctAnswers.length, images.length);

  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [dialogIsResult, setDialogIsResult] = useState<boolean>(false);
  const [dialogText, setDialogText] = useState<string>('');

  useEffect(() => {
    setDialogText(
      'Instructions for the Left Eye Color Vision Test:\n\n' +
      '1. Cover your right eye.\n2. Focus on the image.\n3. Enter the number visible.\n4. Leave blank if nothing is visible.'
    );
    setDialogVisible(true);
    setDialogIsResult(false);
  }, []);

  const checkAnswer = () => {
    if (index < totalQuestions) {
      if (answer.trim() === correctAnswers[index]) {
        setScore(s => s + 1);
      }
    }

    const next = index + 1;

    if (next < totalQuestions) {
      setIndex(next);
      setAnswer('');
    } else {
      endQuiz();
    }
  };

  const endQuiz = async () => {
    const finalScore = score + (answer.trim() === correctAnswers[index] ? 1 : 0);

    let remark = '';
    let text = '';

    if (finalScore === totalQuestions) {
      remark = 'Excellent';
      text = `You scored ${finalScore} out of ${totalQuestions}.\nPerfect color vision!`;
    } else {
      remark = 'Needs Attention';
      text = `You scored ${finalScore} out of ${totalQuestions}.\nPossible color vision issue — consider seeing an eye specialist.`;
    }

    setDialogText(text);
    setDialogIsResult(true);
    setDialogVisible(true);

    try {
      const email = await AsyncStorage.getItem('user_email');
      if (email) {
        await axios.post('http://10.0.2.2:8080/api/tests/colorvision/left', {
          email,
          left_eye_score: finalScore,
          left_eye_remark: remark,
        });
      }
    } catch (err: any) {
      console.warn('Failed to save left-eye result:', err?.message ?? err);
    }
  };

  const onDialogOk = () => {
    setDialogVisible(false);
    if (dialogIsResult) {
      navigation.navigate('ColorVisionTest' as never);
    }
  };

  if (images.length === 0) {
    return (
      <Provider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No images found!</Text>
          <Button onPress={() => navigation.goBack()}>Back</Button>
        </View>
      </Provider>
    );
  }

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Left Eye Color Vision Test</Text>
        <Text style={styles.question}>
          Question {Math.min(index + 1, totalQuestions)} of {totalQuestions}
        </Text>

        {index < images.length && (
          <Image
            source={images[index]}  // IMPORTANT: require() goes directly here
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <TextInput
          label="Enter the number you see"
          value={answer}
          onChangeText={setAnswer}
          mode="outlined"
          style={styles.input}
        />

        <Button mode="contained" onPress={checkAnswer} style={styles.button}>
          Submit
        </Button>

        <Button onPress={() => navigation.navigate('Main')} style={styles.backButton}>
          Exit
        </Button>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={onDialogOk}>
            <Dialog.Title>{dialogIsResult ? 'Test Complete' : 'Instructions'}</Dialog.Title>
            <Dialog.Content>
              <Text>{dialogText}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={onDialogOk}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  question: { marginVertical: 10, fontSize: 16 },
  image: { width: 320, height: 320, marginVertical: 10 },
  input: { width: '90%', marginVertical: 10 },
  button: { width: '90%', marginVertical: 10, backgroundColor: '#2196F3' },
  backButton: { marginTop: 10 },
});

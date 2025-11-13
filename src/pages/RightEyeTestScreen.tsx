// src/screens/RightEyeTestScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Image, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, Dialog, Portal, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utility/navigation';
import { pdfImages } from '../utility/constant';

type Props = NativeStackScreenProps<RootStackParamList, 'RightEyeTest'>;

export default function RightEyeTestScreen({ navigation }: Props) {
  // correct answers (same length expected as number of test images)
  const correctAnswers = [
    '12', '8', '29', '5', '3', '15', '74', '6', '45', '5', '7', '16', '73', '', '', '26', '42'
  ];

  // Use imported images (array of require(...) results). They are synchronous.
  const images = useMemo(() => pdfImages, []);

  // Use the minimum length so we won't crash if answers/images mismatch
  const totalQuestions = Math.min(correctAnswers.length, images.length);

  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [dialogIsResult, setDialogIsResult] = useState<boolean>(false);
  const [dialogText, setDialogText] = useState<string>('');

  // show instructions when screen mounts
  useEffect(() => {
    setDialogText(
      'Instructions for the Right Eye Color Vision Test:\n\n' +
      '1. Cover your left eye.\n2. Focus on the image.\n3. Enter the number visible.\n4. Leave blank if nothing is visible.'
    );
    setDialogIsResult(false);
    setDialogVisible(true);
  }, []);

  const checkAnswer = () => {
    // protect against out-of-bounds
    if (index >= totalQuestions) {
      // nothing to check
      return;
    }

    const trimmed = answer.trim();

    if (trimmed === correctAnswers[index]) {
      setScore((s) => s + 1);
    }

    const next = index + 1;
    if (next < totalQuestions) {
      setIndex(next);
      setAnswer('');
    } else {
      // finish
      endQuiz();
    }
  };

  const endQuiz = async () => {
    const finalScore = score + (answer.trim() === correctAnswers[index] ? 1 : 0);
    console.log(finalScore)
    // Note: if you already counted current answer inside checkAnswer before calling endQuiz,
    // avoid double counting (above line checks final answer only if endQuiz called without count).
    // In this implementation checkAnswer triggers endQuiz after counting current answer,
    // so here we use the already-set score.
    const usedScore = score; // score already reflects correct answers up to this point

    let remark = '';
    let text = '';

    if (usedScore === totalQuestions) {
      remark = 'Excellent';
      text = `You scored ${usedScore} out of ${totalQuestions}.\nPerfect color vision!`;
    } else {
      remark = 'Needs Attention';
      text = `You scored ${usedScore} out of ${totalQuestions}.\nPossible red-green color deficiency.`;
    }

    setDialogText(text);
    setDialogIsResult(true);
    setDialogVisible(true);

    // persist to backend (best-effort)
    try {
      const email = await AsyncStorage.getItem('user_email');
      if (email) {
        await axios.post('http://10.0.2.2:8080/api/tests/colorvision/right', {
          email,
          right_eye_score: usedScore,
          right_eye_remark: remark,
        });
      }
    } catch (err: any) {
      console.warn('Failed to save right-eye result:', err?.message ?? err);
    }
  };

  // Dialog OK handler
  const onDialogOk = () => {
    setDialogVisible(false);
    if (dialogIsResult) {
      // when result dialog is dismissed, navigate back to ColorVisionTest screen
      navigation.navigate('ColorVisionTest' as never);
    }
  };

  // Safety: if there are no images, show message
  if (images.length === 0) {
    return (
      <Provider>
        <View style={styles.emptyContainer}>
          <Text>No images found for the test. Please add images to assets/pdf_images.</Text>
          <Button onPress={() => navigation.goBack()}>Back</Button>
        </View>
      </Provider>
    );
  }

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Right Eye Color Vision Test</Text>
        <Text style={styles.question}>
          Question {Math.min(index + 1, totalQuestions)} of {totalQuestions}
        </Text>

        {/* IMPORTANT: pass require(...) result directly to source (not {uri: ...}) */}
        {index < images.length && (
          <Image source={images[index]} style={styles.image} resizeMode="contain" />
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
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
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
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  question: { marginVertical: 10, fontSize: 16 },
  image: { width: 320, height: 320, marginVertical: 10 },
  input: { width: '90%', marginVertical: 10 },
  button: { width: '90%', marginVertical: 10, backgroundColor: '#2196F3' },
  backButton: { marginTop: 10 },
});

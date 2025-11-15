/* eslint-disable react-native/no-inline-styles */
// src/pages/nearvision/NearVisionLeftScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Card,
  Dialog,
  Portal,
  Provider,
  TextInput,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utility/navigation';
import { nvImages } from '../../utility/constant';
import { saveTestScore } from '../../utility/api';

type Props = NativeStackScreenProps<RootStackParamList, 'NearVisionLeft'>;

const MAX_QUESTIONS = 6;
const TOTAL_SCORE = 6;

const SyllablePools: Record<string, string[]> = {
  Tamil: [
    'ப',
    'ந',
    'ர',
    'ன',
    'ந்',
    'பூ',
    'நா',
    'அ',
    'நி',
    'ஆ',
    'த்',
    'ம',
    'ர்',
    'ல்',
    'ஹ்',
    'க்',
    'பு',
    'ா',
    'ஜா',
  ],
  Hindi: [
    'भा',
    'आ',
    'द',
    'ने',
    'पू',
    'जा',
    'र',
    'त',
    'ह',
    'ना',
    'म',
    'द',
    'अ',
    'नं',
    'ता',
    'जी',
    'ग',
    'पुर',
  ],
  Telugu: [
    'భా',
    'ఆ',
    'న',
    'పూ',
    'జ',
    'అ',
    'ంద్',
    'గ',
    'హ్మ',
    'ద్',
    'నే',
    'తా',
    'జీ',
    'రత్',
    'నా',
    'పూర్',
  ],
};

const CorrectAnswers: Record<string, Record<number, string>> = {
  English: {
    1: 'bharat',
    2: 'anand',
    3: 'pooja',
    4: 'ahmed',
    5: 'netaji',
    6: 'nagpur',
  },
  Tamil: {
    1: 'பரத்',
    2: 'ஆனந்த்',
    3: 'பூஜா',
    4: 'அஹ்மத்',
    5: 'நிர்மல்',
    6: 'நாக்பூர்',
  },
  Hindi: {
    1: 'भारत',
    2: 'आनंद',
    3: 'पूजा',
    4: 'अहमद',
    5: 'नेताजी',
    6: 'नागपुर',
  },
  Telugu: {
    1: 'భారత్',
    2: 'ఆనంద్',
    3: 'పూజ',
    4: 'అహ్మద్',
    5: 'నేతాజీ',
    6: 'నాగపూర్',
  },
};

export default function NearVisionLeftScreen({ navigation, route }: Props) {
  const language = route.params?.language ?? 'English';

  const images = useMemo(
    () => nvImages[language as keyof typeof nvImages] || nvImages.English,
    [language],
  );

  const [current, setCurrent] = useState<number>(1);
  const [answerEnglish, setAnswerEnglish] = useState<string>('');
  const [nonEnglishBuffer, setNonEnglishBuffer] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogText, setDialogText] = useState('');

  useEffect(() => {
    setCurrent(1);
    setAnswerEnglish('');
    setNonEnglishBuffer([]);
    setScore(0);
  }, [language]);

  const displayImage = images[current - 1];
  const addSyllable = (s: string) =>
    setNonEnglishBuffer(p => (p.length < 10 ? [...p, s] : p));
  const backspace = () => setNonEnglishBuffer(p => p.slice(0, -1));
  const clearBuffer = () => setNonEnglishBuffer([]);

  const getUserAnswer = () =>
    language === 'English'
      ? answerEnglish.trim().toLowerCase()
      : nonEnglishBuffer.join('').trim();

  const checkAndNext = async () => {
    const ans = getUserAnswer();
    const expected = (CorrectAnswers as any)[language]?.[current] ?? '';
    console.log(ans, expected, ans === expected);
    if (language === 'English') {
      if (ans === expected) setScore(s => s + 1);
    } else {
      if (ans === expected) setScore(s => s + 1);
    }

    if (current < MAX_QUESTIONS) {
      setCurrent(c => c + 1);
      setAnswerEnglish('');
      clearBuffer();
    } else {
      await finishTest();
    }
  };

  const finishTest = async () => {
    const remark = score === TOTAL_SCORE ? 'Excellent' : 'Needs Attention';
    const resultText =
      score === TOTAL_SCORE
        ? `You scored ${score} out of ${TOTAL_SCORE}. Near vision normal.`
        : `You scored ${score} out of ${TOTAL_SCORE}. Consider seeing a specialist.`;

    setDialogText(resultText);
    setDialogVisible(true);

    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        await saveTestScore({
          userId,
          testName: `Near Vision - Left Eye (${language})`,
          testTotalScore: TOTAL_SCORE,
          testScore: score,
          remark,
        });
      }
    } catch (err) {
      console.warn('save score failed:', err);
    }
  };

  const onDialogOk = () => {
    setDialogVisible(false);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const syllables = SyllablePools[language] || [];

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Near Vision — Left Eye ({language})</Text>

        <Card style={styles.card}>
          <Image
            source={displayImage}
            style={styles.image}
            resizeMode="contain"
          />
        </Card>

        <View style={{ marginTop: 12 }}>
          <Text>
            Question {current} of {MAX_QUESTIONS}
          </Text>
        </View>

        {language === 'English' ? (
          <TextInput
            label="Type what you see"
            value={answerEnglish}
            onChangeText={setAnswerEnglish}
            mode="outlined"
            style={{ marginTop: 12 }}
          />
        ) : (
          <>
            <Card style={{ padding: 8, marginTop: 12 }}>
              <Text style={{ fontSize: 24, textAlign: 'center' }}>
                {nonEnglishBuffer.join('')}
              </Text>
            </Card>

            <View style={styles.keypadRow}>
              {syllables.map(s => (
                <Button
                  key={s}
                  mode="contained"
                  onPress={() => addSyllable(s)}
                  style={styles.keyBtn}
                >
                  {s}
                </Button>
              ))}
            </View>

            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <Button
                mode="outlined"
                onPress={backspace}
                style={{ marginRight: 8 }}
              >
                ⌫
              </Button>
              <Button mode="outlined" onPress={clearBuffer}>
                Clear
              </Button>
            </View>
          </>
        )}

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Button
            mode="contained"
            onPress={checkAndNext}
            style={{ flex: 1, marginRight: 8 }}
          >
            {current < MAX_QUESTIONS ? 'Submit & Next' : 'Finish'}
          </Button>
          <Button
            mode="outlined"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              })
            }
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
        </View>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={onDialogOk}>
            <Dialog.Title>Result</Dialog.Title>
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
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  card: { marginTop: 12, padding: 8 },
  image: { width: '100%', height: 240 },
  keypadRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  keyBtn: { margin: 4, minWidth: 80 },
});

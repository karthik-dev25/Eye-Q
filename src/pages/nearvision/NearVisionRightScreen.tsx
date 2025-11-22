/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import { saveTestScore } from '../../utility/api';

type Props = NativeStackScreenProps<RootStackParamList, 'NearVisionLeft'>;

const MAX_QUESTIONS = 6;
const TOTAL_SCORE = 6;

// Correct mm → px conversion for near-vision
const NV_FONT_SIZES: any = {
  1: 80,  // N36
  2: 54,  // N24
  3: 40,  // N18
  4: 26,  // N12
  5: 22,  // N10
  6: 14,  // N6
};
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
    1: 'Bharat',
    2: 'Anand',
    3: 'Pooja',
    4: 'Ahmed',
    5: 'Netaji',
    6: 'Nagpur',
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

export default function NearVisionRightScreen({ navigation, route }: Props) {
  const language = route.params?.language ?? 'English';

  const [current, setCurrent] = useState(1);
  const [answerEnglish, setAnswerEnglish] = useState('');
  const [nonEnglishBuffer, setNonEnglishBuffer] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogText, setDialogText] = useState('');

  const showWord = CorrectAnswers[language]?.[current] || '';

  useEffect(() => {
    setCurrent(1);
    setAnswerEnglish('');
    setNonEnglishBuffer([]);
    setScore(0);
  }, [language]);

  const getUserAnswer = () =>
    language === 'English'
      ? answerEnglish.trim()
      : nonEnglishBuffer.join('').trim();

  const checkAndNext = async () => {
    const ans = getUserAnswer();
    const expected = CorrectAnswers[language]?.[current] ?? '';
    if (ans === expected) setScore(s => s + 1);
    if (current < MAX_QUESTIONS) {
      setCurrent(c => c + 1);
      setAnswerEnglish('');
      setNonEnglishBuffer([]);
    } else {
      let lastAns = ans === expected ? score +1 : score;
      setScore(s => s + 1)
      await finishTest(lastAns);
    }
  };

  const finishTest = async (testScore:any) => {
    let resultMessage = '';
    console.log(testScore)

    if (testScore === 6) {
      resultMessage =
        "✔️ Normal Near Vision (N6)\n\n" +
        "Advice: Your near vision is within normal limits.\n" +
        "Eye Care Note: Visit an eye care professional once a year.\n";
    } else if (testScore >= 4) {
      resultMessage =
        "⚠️ Reduced Near Vision (N10–N12)\n\n" +
        "Advice: You may have difficulty with reading or near work.\n" +
        "Eye Care Note: A detailed eye examination is recommended.\n";
    } else {
      resultMessage =
        "❗ Severely Reduced Near Vision (N18+)\n\n" +
        "Advice: Immediate near correction is likely needed.\n" +
        "Eye Care Note: Consult an optometrist as soon as possible.\n";
    }

    resultMessage +=
      "This test is a screening tool. Visit an Eye Care Practitioner for a complete examination.";

    setDialogText(resultMessage);
    setDialogVisible(true);

    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        await saveTestScore({
          userId,
          testName: `Near Vision - Right Eye (${language})`,
          testTotalScore: TOTAL_SCORE.toString(),
          testScore: score.toString(),
          remarkTitle: score === 6 ? 'Normal' : score >= 4 ? 'Reduced' : 'Severe',
          remark:resultMessage,
        });
      }
    } catch {}
  };

  const onDialogOk = () => {
    setDialogVisible(false);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Near Vision — Right Eye ({language})</Text>

        {/* Dynamic near-vision word */}
        <Card style={styles.card}>
          <Text style={{ fontSize: NV_FONT_SIZES[current], fontWeight: 'bold', textAlign: 'center' }}>
            {showWord}
          </Text>
        </Card>

        <Text style={{ marginTop: 12 }}>
          Question {current} of {MAX_QUESTIONS}
        </Text>

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
              {(SyllablePools[language] || []).map(s => (
                <Button key={s} mode="contained" onPress={() => setNonEnglishBuffer(p => [...p, s])} style={styles.keyBtn}>
                  {s}
                </Button>
              ))}
            </View>

            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <Button mode="outlined" onPress={() => setNonEnglishBuffer(p => p.slice(0, -1))} style={{ marginRight: 8 }}>
                ⌫
              </Button>
              <Button mode="outlined" onPress={() => setNonEnglishBuffer([])}>
                Clear
              </Button>
            </View>
          </>
        )}

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Button mode="contained" onPress={checkAndNext} style={{ flex: 1, marginRight: 8 }}>
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
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  card: { marginTop: 12, padding: 16, alignItems: 'center' },
  keypadRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  keyBtn: { margin: 4, minWidth: 80 },
});

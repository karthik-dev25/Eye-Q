/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utility/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RightEyeDV'>;

const SLOAN = ['C', 'D', 'H', 'K', 'N', 'O', 'R', 'S', 'V', 'Z'];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// ✅ FIXED medically-correct Tumbling-E pattern from your image
const TUMBLING_E_LEVELS = [
  // LEVEL 1
  [{ letter: 'E', rotate: '270deg' }],

  // LEVEL 2
  [
    { letter: 'E', rotate: '180deg' },
    { letter: 'E', rotate: '90deg' },
  ],

  // LEVEL 3
  [
    { letter: 'E', rotate: '270deg' },
    { letter: 'E', rotate: '0deg' },
    { letter: 'E', rotate: '180deg' },
  ],

  // LEVEL 4
  [
    { letter: 'E', rotate: '270deg' },
    { letter: 'E', rotate: '180deg' },
    { letter: 'E', rotate: '0deg' },
    { letter: 'E', rotate: '270deg' },
  ],

  // LEVEL 5
  [
    { letter: 'E', rotate: '180deg' },
    { letter: 'E', rotate: '270deg' },
    { letter: 'E', rotate: '0deg' },
    { letter: 'E', rotate: '270deg' },
    { letter: 'E', rotate: '90deg' },
  ],

  // LEVEL 6
  [
    { letter: 'E', rotate: '180deg' },
    { letter: 'E', rotate: '270deg' },
    { letter: 'E', rotate: '0deg' },
    { letter: 'E', rotate: '270deg' },
    { letter: 'E', rotate: '270deg' },
    { letter: 'E', rotate: '0deg' },
  ],

  // LEVEL 7
  [
    { letter: 'E', rotate: '180deg' },
    { letter: 'E', rotate: '0deg' },
    { letter: 'E', rotate: '270deg' },
    { letter: 'E', rotate: '270deg' },
    { letter: 'E', rotate: '90deg' },
    { letter: 'E', rotate: '0deg' },
    { letter: 'E', rotate: '90deg' },
  ],
];

export default function RightEyeDV({ route, navigation }: Props) {
  const testType = route.params.testType;

  const fontSizes = [110, 66, 44, 33, 22, 17, 11];
  const counts = [1, 2, 3, 4, 5, 6, 7];

  const [level, setLevel] = useState(0);
  const [generated, setGenerated] = useState<string[]>([]);
  const [lastCorrect, setLastCorrect] = useState(0);

  const pickRandom = (arr: any[], count: number) =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, count);

  const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  const generateRow = () => {
    const count = counts[level];

    if (testType === 'Sloan Letters') {
      setGenerated(shuffle(pickRandom(SLOAN, count)));
    } else if (testType === 'Numbers') {
      setGenerated(shuffle(pickRandom(DIGITS, count)));
    } else if (testType === 'Tumbling E') {
      return;
    }
  };

  useEffect(() => {
    generateRow();
  }, [level]);

  const onCorrect = () => {
    if (level === 6) {
      showResults();
    } else {
      setLevel(level + 1);
    }
    setLastCorrect(level + 1);
  };

  const onWrong = () => showResults();

  const showResults = () => {
    navigation.navigate('DVResults', {
      lastCorrect,
      eye: 'Right',
      testType,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Right Eye Test - {testType}</Text>
      <Text style={styles.subtitle}>Level {level + 1} / 7</Text>

      <View style={styles.row}>
        {/* Sloan + Numbers */}
        {testType !== 'Tumbling E' && (
          <Text
            style={{
              fontSize: fontSizes[level],
              textAlign: 'center',
              fontWeight: '900',
              fontFamily: 'Sloan',
            }}
          >
            {generated.join('  ')}
          </Text>
        )}

        {/* Tumbling E – always render E but rotated */}
        {testType === 'Tumbling E' &&
          TUMBLING_E_LEVELS[level].map((item, idx) => (
            <Text
              key={idx}
              style={{
                fontSize: fontSizes[level],
                marginHorizontal: 6,
                transform: [{ rotate: item.rotate }],
                fontWeight: 'bold',
                fontFamily: 'Sloan',
              }}
            >
              {item.letter}
            </Text>
          ))}
      </View>

      <Button mode="contained" onPress={onCorrect} style={styles.btn}>
        Correct
      </Button>

      <Button mode="contained" onPress={onWrong} style={styles.btnWrong}>
        Wrong
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'center', marginVertical: 30 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { textAlign: 'center', marginTop: 8 },
  btn: { marginTop: 20 },
  btnWrong: { marginTop: 10, backgroundColor: 'red' },
});

/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Portal, Dialog } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utility/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DistanceVisionTest'>;

export default function DistanceVisionTestScreen({ navigation }: Props) {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const chooseTestType = () => {
    navigation.navigate('DVTestTypeSelect', {
      onSelect: (testName: string) => {
        setSelectedTest(testName);
        setShowGuide(true); // Show popup once selected
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distance Vision Test</Text>

      <Text style={styles.sub}>
        {selectedTest ? `Selected: ${selectedTest}` : 'Select Test Type'}
      </Text>

      <Card style={styles.card}>
        <Button mode="contained" onPress={chooseTestType} style={styles.btn}>
          Select Test Type
        </Button>

        {selectedTest && (
          <>
            <Button
              mode="contained"
              style={styles.btn}
              onPress={() =>
                navigation.navigate('RightEyeDV', { testType: selectedTest })
              }
            >
              Right Eye Test
            </Button>

            <Button
              mode="contained"
              style={styles.btn}
              onPress={() =>
                navigation.navigate('LeftEyeDV', { testType: selectedTest })
              }
            >
              Left Eye Test
            </Button>
          </>
        )}
      </Card>

      {/* ---------- INSTRUCTIONS POPUP ---------- */}
      <Portal>
        <Dialog visible={showGuide} onDismiss={() => setShowGuide(false)}>
          <Dialog.Title>Read Before Starting</Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontSize: 15, lineHeight: 22 }}>
              ● If you are using glasses or contact lenses, please wear them
              during this test.{'\n\n'}● This helps us check whether your
              current prescription is correct or not.{'\n\n'}● Hold your mobile
              phone at a distance of{' '}
              <Text style={{ fontWeight: 'bold' }}>2 meters</Text> from you.
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setShowGuide(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  sub: { fontSize: 16, textAlign: 'center', marginVertical: 6 },
  card: {
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    backgroundColor: '#fff',
    elevation: 3,
  },
  btn: { marginVertical: 10 },
});

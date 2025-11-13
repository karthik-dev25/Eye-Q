import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utility/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ColorVisionTest'>;

export default function ColorVisionTestScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>

      {/* Screen Title */}
      <Text style={styles.title}>Color Vision Test</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Attend the right eye test before attending the left eye test.
      </Text>

      {/* Card with two buttons */}
      <Card style={styles.card}>
        <Card.Content>

          <Button
            mode="contained"
            style={styles.testBtn}
            onPress={() => navigation.navigate('RightEyeTest')}
          >
            Right Eye Test
          </Button>

          <Button
            mode="contained"
            style={styles.testBtn}
            onPress={() => navigation.navigate('LeftEyeTest')}
          >
            Left Eye Test
          </Button>

        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 25,
    backgroundColor: 'rgba(0, 124, 255, 0.20)', // translucent bright blue
  },
  topBar: {
    height: 50,
    justifyContent: 'flex-start',
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 30,
    marginTop: 10,
  },
  card: {
    marginTop: 10,
    padding: 20,
    borderRadius: 15,
  },
  testBtn: {
    marginVertical: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
});

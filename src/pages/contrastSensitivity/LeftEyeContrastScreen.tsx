/* eslint-disable react-native/no-inline-styles */
// src/pages/contrast/LeftEyeContrastScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Text, Button, Card, Dialog, Portal, Provider, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";
import { contrastImages } from "../../utility/constant";
import { saveTestScore } from "../../utility/api";

type Props = NativeStackScreenProps<RootStackParamList, "LeftEyeContrast">;

const CORRECT_ANSWERS = [
  "VRS","KDR","NHC","SOK","SCN","OZV","CNH","ZOK",
  "NOD","VHR","CDN","ZSV","KCH","ODK","RSZ","HVR"
];

const QUESTION_POINTS = Array.from({ length: CORRECT_ANSWERS.length }, (_, i) => Math.round(0.15 * i * 100) / 100);

export default function LeftEyeContrastScreen({ navigation }: Props) {
  const [index, setIndex] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogText, setDialogText] = useState("");

  useEffect(() => {
    setIndex(0); setInput(""); setScore(0);
  }, []);

  const sanitize = (s: string) => s.replace(/[^A-Za-z]/g, "").toUpperCase();

  const handleSubmit = async () => {
    const userInput = sanitize(input);
    const correct = CORRECT_ANSWERS[index].toUpperCase();
    const sortedUser = userInput.split("").sort().join("");
    const sortedCorrect = correct.split("").sort().join("");

    if (sortedUser === sortedCorrect) {
      const pts = QUESTION_POINTS[index] ?? 0;
      setScore(prev => Math.round((prev + pts) * 100) / 100);
    }

    setInput("");
    if (index + 1 < CORRECT_ANSWERS.length) {
      setIndex(index + 1);
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const remark = score > 11.7 ? "excellent" : score > 8.25 ? "good" : "requires attention";
    const resultText = `You scored ${score} out of 18\n${remark === "excellent" ? "Great news!" : remark === "good" ? "You're doing well." : "Please consult an eye specialist."}`;

    setDialogText(resultText);
    setDialogVisible(true);

    // Save result
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        await saveTestScore({
          userId,
          testName: "Contrast Sensitivity - Left Eye",
          testTotalScore: 18,
          testScore: score,
          remark,
        });
      }
    } catch (err) {
      console.warn("saveTestScore failed:", err);
    }
  };

  const onDialogOk = () => {
    setDialogVisible(false);
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  };

  const currentImage = contrastImages[index];

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Left Eye Contrast Sensitivity Test</Text>

        <Card style={styles.card}>
          <Image source={currentImage} style={styles.image} resizeMode="contain" />
        </Card>

        <Text style={{ marginTop: 8 }}>Question {index + 1} of {CORRECT_ANSWERS.length}</Text>
        <Text style={{ marginTop: 4 }}>Points: {QUESTION_POINTS[index]}</Text>

        <TextInput label="Enter the letters visible to you" value={input} onChangeText={setInput} mode="outlined" style={{ marginTop: 12 }} />

        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <Button mode="contained" onPress={handleSubmit} style={{ flex: 1, marginRight: 8 }}>
            {index + 1 < CORRECT_ANSWERS.length ? "Submit" : "Finish"}
          </Button>
          <Button mode="outlined" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Main" }] })} style={{ flex: 1 }}>
            Cancel
          </Button>
        </View>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={onDialogOk}>
            <Dialog.Title>Test Complete</Dialog.Title>
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
  container: { padding: 16, backgroundColor: "#fff", flexGrow: 1 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 8 },
  card: { marginTop: 12, padding: 8 },
  image: { width: "100%", height: 260 },
});

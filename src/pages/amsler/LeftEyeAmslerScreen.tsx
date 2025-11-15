/* eslint-disable dot-notation */
/* eslint-disable react-native/no-inline-styles */
// src/pages/amsler/LeftEyeAmslerScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import {
  Text,
  RadioButton,
  Checkbox,
  Button,
  Dialog,
  Portal,
  Provider,
  Title,
  Paragraph,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";
import { API_URL } from "../../utility/constant";

type Props = NativeStackScreenProps<RootStackParamList, "LeftEyeAmsler">;

const AmslerImage = require("../../assets/amsler_grid/A_G_image.png");

export default function LeftEyeAmslerScreen({ navigation }: Props) {
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<Record<string, boolean>>({
    Straight: false,
    Wavy: false,
    Curved: false,
    Distorted: false,
  });
  const [q4, setQ4] = useState<string | null>(null);
  const [q5, setQ5] = useState<string | null>(null);
  const [q6, setQ6] = useState<string | null>(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [resultText, setResultText] = useState("");
  const [resultTitle, setResultTitle] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setDialogVisible(true);
      setResultTitle("Instructions");
      setResultText(
        "1. Cover your right eye and focus on the center dot.\n" +
          "2. Keep the phone at arm's length.\n" +
          "3. Only focus on the black dot in the center.\n" +
          "4. Answer the questions below."
      );
    }, 250);
  }, []);

  const toggleQ3 = (key: string) => {
    setQ3((prev) => {
      const newState = { ...prev };
      if (key === "Straight") {
        const willBe = !prev["Straight"];
        newState["Straight"] = willBe;
        if (willBe) {
          newState["Wavy"] = false;
          newState["Curved"] = false;
          newState["Distorted"] = false;
        }
      } else {
        const willBe = !prev[key];
        newState[key] = willBe;
        if (willBe) newState["Straight"] = false;
      }
      return newState;
    });
  };

  const calculatePointsAndSave = async () => {
    let points = 0;
    if (q1 === "Yes") points += 1;
    if (q2 === "Yes") points += 1;
    if (q3["Straight"]) points += 1;
    if (q4 === "No") points += 1;
    if (q5 === "No") points += 1;
    if (q6 === "No") points += 1;

    const remark = points === 6 ? "excellent" : "requires attention";

    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        await axios.post(`${API_URL}/testscore`, {
          userId,
          testName: "AmslerGrid-Left",
          testTotalScore: 6,
          testScore: points,
          remark,
        });
      }
    } catch (err: any) {
      console.log("Error saving left-eye amsler:", err?.message ?? err);
    }

    setResultTitle("Test Results");
    setResultText(`You scored ${points}/6.\n\n${remark === "excellent"
      ? "Your grid looks normal."
      : "Some changes were detected — please consult an eye specialist."
    }`);
    setDialogVisible(true);
    (onDialogDismissLeft as any).nextRoute = "AmslerGridTest";
  };

  const onDialogDismissLeft = () => {
    setDialogVisible(false);
    const nextRoute = (onDialogDismissLeft as any).nextRoute;
    if (nextRoute) navigation.replace(nextRoute);
    (onDialogDismissLeft as any).nextRoute = null;
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Title>Left Eye Test</Title>
          <View style={{ width: 64 }} />
        </View>

        <Image source={AmslerImage} style={styles.image} resizeMode="contain" />

        <View style={styles.questionBlock}>
          <Text style={styles.qTitle}>1. Can you see the center dot clearly?</Text>
          <RadioButton.Group onValueChange={(v) => setQ1(v)} value={q1 ?? ""}>
            <View style={styles.radioRow}>
              <RadioButton.Item label="Yes" value="Yes" />
              <RadioButton.Item label="No" value="No" />
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.questionBlock}>
          <Text style={styles.qTitle}>2. While focusing on the center dot, can you see all four corners and edges?</Text>
          <RadioButton.Group onValueChange={(v) => setQ2(v)} value={q2 ?? ""}>
            <View style={styles.radioRow}>
              <RadioButton.Item label="Yes" value="Yes" />
              <RadioButton.Item label="No" value="No" />
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.questionBlock}>
          <Text style={styles.qTitle}>3. Are all the lines straight, or do any appear wavy, curved, or distorted?</Text>
          <View style={styles.checkboxColumn}>
            {["Straight", "Wavy", "Curved", "Distorted"].map((opt) => (
              <View key={opt} style={styles.checkboxRow}>
                <Checkbox
                  status={q3[opt] ? "checked" : "unchecked"}
                  onPress={() => toggleQ3(opt)}
                />
                <Text style={{ marginLeft: 8 }}>{opt}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.questionBlock}>
          <Text style={styles.qTitle}>4. Is there any area where the lines are missing or appear blurry?</Text>
          <RadioButton.Group onValueChange={(v) => setQ4(v)} value={q4 ?? ""}>
            <View style={styles.radioRow}>
              <RadioButton.Item label="Yes" value="Yes" />
              <RadioButton.Item label="No" value="No" />
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.questionBlock}>
          <Text style={styles.qTitle}>5. Does any part of the grid look darker or faded compared to the rest?</Text>
          <RadioButton.Group onValueChange={(v) => setQ5(v)} value={q5 ?? ""}>
            <View style={styles.radioRow}>
              <RadioButton.Item label="Yes" value="Yes" />
              <RadioButton.Item label="No" value="No" />
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.questionBlock}>
          <Text style={styles.qTitle}>6. Is the size or shape of any area on the grid different?</Text>
          <RadioButton.Group onValueChange={(v) => setQ6(v)} value={q6 ?? ""}>
            <View style={styles.radioRow}>
              <RadioButton.Item label="Yes" value="Yes" />
              <RadioButton.Item label="No" value="No" />
            </View>
          </RadioButton.Group>
        </View>

        <Button mode="contained" style={styles.submitBtn} onPress={calculatePointsAndSave}>
          Submit Answers
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={onDialogDismissLeft}>
          <Dialog.Title>{resultTitle}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{resultText}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDialogDismissLeft}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", paddingBottom: 40 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  image: { width: "100%", height: 320, marginVertical: 12, borderRadius: 8 },
  questionBlock: { marginTop: 12 },
  qTitle: { fontWeight: "600", marginBottom: 8 },
  radioRow: { flexDirection: "row", alignItems: "center" },
  checkboxColumn: { flexDirection: "column" },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  submitBtn: { marginTop: 18 },
});

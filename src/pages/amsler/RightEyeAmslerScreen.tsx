/* eslint-disable react-native/no-inline-styles */
/* eslint-disable dot-notation */
// src/pages/amsler/RightEyeAmslerScreen.tsx
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

type Props = NativeStackScreenProps<RootStackParamList, "RightEyeAmsler">;

// static require for image
const AmslerImage = require("../../assets/amsler_grid/A_G_image.png");

export default function RightEyeAmslerScreen({ navigation }: Props) {
  // radio answers store 'Yes' | 'No' | null
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

  // show instruction dialog on enter
  useEffect(() => {
    setTimeout(() => {
      setDialogVisible(true);
      setResultTitle("Instructions");
      setResultText(
        "1. Cover your left eye and focus on the center dot.\n" +
          "2. Keep the phone at arm's length.\n" +
          "3. Only focus on the black dot in the center.\n" +
          "4. Answer the questions below."
      );
    }, 250);
  }, []);

  const toggleQ3 = (key: string) => {
    // Special rule: if "Straight" is selected, uncheck others; if any other selected, uncheck Straight.
    setQ3((prev) => {
      const newState = { ...prev };
      if (key === "Straight") {
        // toggle Straight; if it becomes true, clear others
        const willBe = !prev["Straight"];
        newState["Straight"] = willBe;
        if (willBe) {
          newState["Wavy"] = false;
          newState["Curved"] = false;
          newState["Distorted"] = false;
        }
      } else {
        // toggle some other; if becomes true, clear Straight
        const willBe = !prev[key];
        newState[key] = willBe;
        if (willBe) newState["Straight"] = false;
      }
      return newState;
    });
  };

  const calculatePointsAndSave = async (moveToLeftAfter = true) => {
    let points = 0;
    if (q1 === "Yes") points += 1;
    if (q2 === "Yes") points += 1;
    if (q3["Straight"]) points += 1; // matches original logic (Straight==good)
    if (q4 === "No") points += 1; // Q4: "Is any area missing or blurry?" -> No = good
    if (q5 === "No") points += 1; // "darker or faded?" -> No = good
    if (q6 === "No") points += 1; // "size or shape different?" -> No = good

    const remark = points === 6 ? "excellent" : "requires attention";

    // attempt to save to backend
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        await axios.post(`${API_URL}/testscore`, {
          userId,
          testName: "AmslerGrid-Right",
          testTotalScore: 6,
          testScore: points,
          remark,
        });
      }
    } catch (err: any) {
      console.log("Error saving right-eye amsler:", err?.message ?? err);
    }

    // show result dialog then navigate
    setResultTitle("Test Results");
    setResultText(`You scored ${points}/6.\n\n${remark === "excellent"
      ? "Your grid looks normal."
      : "Some changes were detected — please consult an eye specialist."
    }`);
    setDialogVisible(true);

    // after closing dialog navigate to left test (like original flow)
    // we will navigate when dialog closed and if moveToLeftAfter is true
    // store flag in closure by navigation callback below
    // Attach a callback to handle navigation after dialog dismissal
    // We will set a param so the dialog's OK button handles the navigation.
    // (Handled below in onDismiss).
    (onDialogDismiss as any).nextRoute = moveToLeftAfter ? "LeftEyeAmsler" : "AmslerGridTest";
  };

  // helper to read nextRoute stored on function
  const onDialogDismiss = () => {
    setDialogVisible(false);
    const nextRoute = (onDialogDismiss as any).nextRoute;
    if (nextRoute) {
      navigation.replace(nextRoute); // replace ensures no back-stack to test screens
    }
    (onDialogDismiss as any).nextRoute = null;
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Title>Right Eye Test</Title>
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

        <Button
          mode="contained"
          style={styles.submitBtn}
          onPress={() => calculatePointsAndSave(true)}
        >
          Submit Answers
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={onDialogDismiss}>
          <Dialog.Title>{resultTitle}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{resultText}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDialogDismiss}>OK</Button>
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

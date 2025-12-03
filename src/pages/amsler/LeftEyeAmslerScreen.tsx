/* eslint-disable dot-notation */
/* eslint-disable react-native/no-inline-styles */
/* LeftEyeAmslerScreen.tsx */
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
import Slider from "@react-native-community/slider";
import Svg, { Line, Rect, Circle } from "react-native-svg";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";
import { API_URL } from "../../utility/constant";

type Props = NativeStackScreenProps<RootStackParamList, "LeftEyeAmsler">;

export default function LeftEyeAmslerScreen({ navigation }: Props) {
  // questionnaire states
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

  // calibration & grid
  const [step, setStep] = useState<"calibration" | "amsler">("calibration");
  const [lineWidthPx, setLineWidthPx] = useState<number>(200); // slider-controlled px for 5 cm line
  const [oneCmInPx, setOneCmInPx] = useState<number | null>(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [resultText, setResultText] = useState("");
  const [resultTitle, setResultTitle] = useState("");

  // defaults for grid
  const LINE_COUNT = 21; // 21 lines -> 20 cells across (centered)
  // derived:
  const GRID_SIZE = oneCmInPx ? oneCmInPx * 10 : 0; // 10cm grid
  const CELL_SIZE = oneCmInPx ? oneCmInPx * 0.5 : 0; // 0.5cm cell (approx 1 degree)

  useEffect(() => {
    // instructions dialog on mount
    setTimeout(() => {
      setDialogVisible(true);
      setResultTitle("Instructions");
      setResultText(
        "1. Cover your right eye and focus on the center dot.\n" +
          "2. Keep the phone at arm's length (~30-40 cm).\n" +
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

  const confirmCalibration = () => {
    // lineWidthPx corresponds to 5 cm on screen -> 1 cm = lineWidthPx / 5
    const oneCm = lineWidthPx / 5;
    setOneCmInPx(oneCm);
    setStep("amsler");
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
      } else {
        // optional: handle missing userId
        console.warn("No user_id in AsyncStorage; skipping API save.");
      }
    } catch (err: any) {
      console.log("Error saving left-eye amsler:", err?.message ?? err);
    }

    setResultTitle("Test Results");
    setResultText(
      `You scored ${points}/6.\n\n${
        remark === "excellent"
          ? "Your grid looks normal."
          : "Some changes were detected — please consult an eye specialist."
      }`
    );
    setDialogVisible(true);
    (onDialogDismissLeft as any).nextRoute = "AmslerGridTest";
  };

  const onDialogDismissLeft = () => {
    setDialogVisible(false);
    const nextRoute = (onDialogDismissLeft as any).nextRoute;
    if (nextRoute) navigation.replace(nextRoute);
    (onDialogDismissLeft as any).nextRoute = null;
  };

  // Rendered grid (on-screen) using react-native-svg so it matches expected appearance
  const renderSvgGrid = () => {
    if (!oneCmInPx) return null;
    const size = GRID_SIZE;
    const cell = CELL_SIZE;
    const lines = Array.from({ length: LINE_COUNT });

    const dotRadius = Math.max(1, oneCmInPx * 0.15);
    const center = size / 2;

    return (
      <Svg width={size} height={size}>
        <Rect x={0} y={0} width={size} height={size} fill="white" />
        {lines.map((_, i) => {
          const pos = i * cell;
          return (
            <React.Fragment key={i}>
              <Line x1={pos} y1={0} x2={pos} y2={size} stroke="black" strokeWidth={1} />
              <Line x1={0} y1={pos} x2={size} y2={pos} stroke="black" strokeWidth={1} />
            </React.Fragment>
          );
        })}
        <Circle cx={center} cy={center} r={dotRadius} fill="black" />
      </Svg>
    );
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Title>Left Eye Amsler</Title>
          <View style={{ width: 64 }} />
        </View>

        {/* CALIBRATION */}
        {step === "calibration" && (
          <>
            <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 12 }}>
              Adjust the line to exactly 5 cm using a physical ruler
            </Text>

            <View style={{ alignItems: "center", marginVertical: 24 }}>
              <View style={{ width: lineWidthPx, height: 4, backgroundColor: "black" }} />
            </View>

            <Slider
              style={{ width: "100%" }}
              minimumValue={100}
              maximumValue={800}
              value={lineWidthPx}
              onValueChange={(value:any) => setLineWidthPx(value)}
            />

            <Button mode="contained" onPress={confirmCalibration} style={{ marginTop: 20 }}>
              Confirm & Show Amsler Grid
            </Button>
          </>
        )}

        {/* AMSLER GRID + QUESTIONS */}
        {step === "amsler" && (
          <>
            <Text style={{ marginBottom: 8, textAlign: "center" }}>
              Hold phone at 30–40 cm • Cover one eye • Look at the central dot
            </Text>

            <View style={{ alignSelf: "center", marginVertical: 12 }}>{renderSvgGrid()}</View>

            <Button mode="outlined" onPress={() => setStep("calibration")} style={{ marginBottom: 12 }}>
              Re-calibrate
            </Button>

            {/* Questions: kept your UI */}
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
              <Text style={styles.qTitle}>
                2. While focusing on the center dot, can you see all four corners and edges?
              </Text>
              <RadioButton.Group onValueChange={(v) => setQ2(v)} value={q2 ?? ""}>
                <View style={styles.radioRow}>
                  <RadioButton.Item label="Yes" value="Yes" />
                  <RadioButton.Item label="No" value="No" />
                </View>
              </RadioButton.Group>
            </View>

            <View style={styles.questionBlock}>
              <Text style={styles.qTitle}>
                3. Are all the lines straight, or do any appear wavy, curved, or distorted?
              </Text>
              <View style={styles.checkboxColumn}>
                {["Straight", "Wavy", "Curved", "Distorted"].map((opt) => (
                  <View key={opt} style={styles.checkboxRow}>
                    <Checkbox status={q3[opt] ? "checked" : "unchecked"} onPress={() => toggleQ3(opt)} />
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
          </>
        )}
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
  container: { padding: 16, backgroundColor: "#fff", paddingBottom: 48 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  questionBlock: { marginTop: 12 },
  qTitle: { fontWeight: "600", marginBottom: 8 },
  radioRow: { flexDirection: "row", alignItems: "center" },
  checkboxColumn: { flexDirection: "column" },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  submitBtn: { marginTop: 18 },
});

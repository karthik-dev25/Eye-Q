/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable dot-notation */
/* eslint-disable react-native/no-inline-styles */
/* LeftEyeAmslerScreen.tsx */
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, PixelRatio, Dimensions } from "react-native";
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
import Svg, { Line, Rect, Circle } from "react-native-svg";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";
import { API_URL } from "../../utility/constant";

type Props = NativeStackScreenProps<RootStackParamList, "LeftEyeAmsler">;

export default function LeftEyeAmslerScreen({ navigation }: Props) {
  // question states
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
          "2. Hold the phone at ~30–40 cm from your eye.\n" +
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
    const remarkMessage = `You scored ${points}/6.\n\n${
        remark === "excellent"
          ? "Your grid looks normal."
          : "Some changes were detected — please consult an eye specialist."
      }`

    setResultTitle("Test Results");
    setResultText(remarkMessage);
    setDialogVisible(true);
     try {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        await axios.post(`${API_URL}/testscore`, {
          userId,
          testName: "AmslerGrid-Left",
          testTotalScore: "6",
          testScore: points,
          remarkTitle:remark,
          remark:remarkMessage,
        });
      } else {
        console.warn("No user_id in AsyncStorage; skipping API save.");
      }
    } catch (err: any) {
      console.log("Error saving left-eye amsler:", err?.message ?? err);
    }
    (onDialogDismissLeft as any).nextRoute = "AmslerGridTest";
  };

  const onDialogDismissLeft = () => {
    setDialogVisible(false);
    const nextRoute = (onDialogDismissLeft as any).nextRoute;
    if (nextRoute) navigation.replace(nextRoute);
    (onDialogDismissLeft as any).nextRoute = null;
  };

  // ---------- Fixed metrics in MILLIMETERS ----------
  // cell size = 5 mm (user requested)
  const CELL_MM = 5; // mm
  const CELLS_PER_SIDE = 20; // 20 cells -> 21 lines
  const GRID_MM = CELL_MM * CELLS_PER_SIDE; // 100 mm = 10 cm

  // convert mm to pixels using device DPI
  const { width: screenW } = Dimensions.get("window");
  const devicePixelRatio = PixelRatio.get(); // e.g., 3
  const approxDpi = devicePixelRatio * 160; // baseline mdpi = 160
  const mmToPx = (mm: number) => (approxDpi / 25.4) * mm; // floating px

  const GRID_PX = useMemo(() => Math.round(mmToPx(GRID_MM)), [devicePixelRatio]);
  const CELL_PX = useMemo(() => mmToPx(CELL_MM), [devicePixelRatio]); // keep float for positions
  const DOT_RADIUS_PX = useMemo(() => Math.max(1, Math.round(mmToPx(1.5))), [devicePixelRatio]); // ~1.5mm dot

  // stroke width (in px), keep fractional for crisp layout; ensure at least 0.5px
  const strokeW = useMemo(() => Math.max(0.5, mmToPx(0.15)), [devicePixelRatio]); // ~0.15 mm stroke
  const halfStroke = strokeW / 2;

  // compute a scale so the grid fits available width (with some padding)
  const maxAvailableWidth = Math.max(200, screenW - 32); // keep minimal width
  const fitScale = GRID_PX > maxAvailableWidth ? maxAvailableWidth / GRID_PX : 1;

  const LINES_COUNT = CELLS_PER_SIDE + 1; // 21

  const renderSvgGrid = () => {
    const size = GRID_PX;
    const cell = CELL_PX;
    const lines = Array.from({ length: LINES_COUNT });
    // We'll expand viewBox by strokeW (so viewBox width = size + strokeW)
    const vbWidth = size + strokeW;
    const vbHeight = size + strokeW;

    // positions are offset by halfStroke so outermost strokes are inside the viewBox
    return (
      <Svg
        width={Math.round(vbWidth * fitScale)}
        height={Math.round(vbHeight * fitScale)}
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* background */}
        <Rect x={0} y={0} width={vbWidth} height={vbHeight} fill="white" />
        {lines.map((_, i) => {
          const pos = i * cell + halfStroke; // <-- offset by half stroke
          return (
            <React.Fragment key={i}>
              <Line
                x1={pos}
                y1={halfStroke}
                x2={pos}
                y2={size + halfStroke}
                stroke="black"
                strokeWidth={strokeW}
              />
              <Line
                x1={halfStroke}
                y1={pos}
                x2={size + halfStroke}
                y2={pos}
                stroke="black"
                strokeWidth={strokeW}
              />
            </React.Fragment>
          );
        })}
        {/* center dot: center is (size/2 + halfStroke) */}
        <Circle cx={size / 2 + halfStroke} cy={size / 2 + halfStroke} r={DOT_RADIUS_PX} fill="black" />
      </Svg>
    );
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container} horizontal={false}>
        <View style={styles.topBar}>
          <Title>Left Eye Amsler</Title>
          <View style={{ width: 64 }} />
        </View>

        <Text style={{ marginBottom: 8, textAlign: "center" }}>
          Hold phone at 30–40 cm • Cover one eye • Look at the central dot
        </Text>

        <View style={{ alignItems: "center", paddingVertical: 12 }}>
          {renderSvgGrid()}
        </View>

        <Button mode="outlined" onPress={() => { /* fixed grid - no action */ }} style={{ marginBottom: 12 }}>
          Grid: 20×20 cells · cell = 5 mm
        </Button>

        {/* Questions UI */}
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
      </ScrollView>
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

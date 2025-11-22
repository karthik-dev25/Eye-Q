/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { View, StyleSheet, Image } from "react-native";

// Use your actual image paths
type Rotation = "0deg" | "90deg" | "180deg" | "270deg";

// Use your actual image paths
const TUMBLING_E: Record<Rotation, any> = {
  "0deg": require("../../assets/tumbling/tumbling_e_0.png"),
  "90deg": require("../../assets/tumbling/tumbling_e_90.png"),
  "180deg": require("../../assets/tumbling/tumbling_e_180.png"),
  "270deg": require("../../assets/tumbling/tumbling_e_270.png"),
};

// Medically correct rotation sequence
const TUMBLING_E_LEVELS: Rotation[][] = [
  ["270deg"],
  ["180deg", "90deg"],
  ["270deg", "0deg", "180deg"],
  ["270deg", "180deg", "0deg", "270deg"],
  ["180deg", "270deg", "0deg", "270deg", "90deg"],
  ["180deg", "270deg", "0deg", "270deg", "270deg", "0deg"],
  ["180deg", "0deg", "270deg", "270deg", "90deg", "0deg", "90deg"],
];

export default function TumblingEView({
  level,
  fontSize,
}: {
  level: number;
  fontSize: number;
}) {
  return (
    <View style={styles.row}>
      {TUMBLING_E_LEVELS[level].map((rot: Rotation, idx: number) => (
        <View key={idx} style={{ width: fontSize, height: fontSize }}>
          <Image
            source={TUMBLING_E[rot]} // ✔ No error now
            style={{
              width: 150,
              height: 150,
              resizeMode: "contain",
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
});

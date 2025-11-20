/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../utility/constant";

type Props = NativeStackScreenProps<RootStackParamList, "DVResults">;

export default function DVResults({ route, navigation }: Props) {
  const { lastCorrect, eye , testType } = route.params;

  console.log(lastCorrect)

  // Map lastCorrect → Vision Value (6/x)
  const vision = useMemo(() => {
    switch (lastCorrect) {
      case 7:
        return "6/6";
      case 6:
        return "6/9";
      case 5:
        return "6/12";
      case 4:
        return "6/18";
      case 3:
        return "6/24";
      case 2:
        return "6/36";
      case 1:
        return "6/60";
      default:
        return "6/60";
    }
  }, [lastCorrect]);

  // Generate appropriate message
  const { resultTitle, message } = useMemo(() => {
    if (vision === "6/6") {
      return {
        resultTitle: "Normal Distance Vision",
        message:
          "Your distance vision is normal (6/6). No significant refractive error is detected. Continue routine yearly eye check-ups.",
      };
    }
    if (vision === "6/9" || vision === "6/12") {
      return {
        resultTitle: "Slightly Reduced Vision",
        message:
          "Your vision is slightly reduced. Early refractive changes may be present. Schedule an eye check to confirm.",
      };
    }
    if (vision === "6/18" || vision === "6/24") {
      return {
        resultTitle: "Moderately Reduced Vision",
        message:
          "Your vision is moderately reduced and may affect daily activities. An eye examination is recommended.",
      };
    }
    if (vision === "6/36" || vision === "6/60") {
      return {
        resultTitle: "Severely Reduced Vision",
        message:
          "Your vision is significantly reduced. Visit an eye hospital soon for evaluation.",
      };
    }

    return {
      resultTitle: "Severely Reduced Vision",
      message:
        "Your distance vision is very low (<6/60). Immediate consultation is recommended.",
    };
  }, [vision]);

  // Map lastCorrect score
  const finalScore = vision;

  const saveTestScore = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        await axios.post(API_URL + "/testscore", {
          userId,
          testName: `${eye} Eye Distance Vision ${testType}`,
          testTotalScore: "6/6", // max lastCorrect score
          testScore: finalScore,
          remarkTitle:resultTitle,
          remark: message,
        });
      }
    } catch (err: any) {
      console.warn("Failed to save vision test score:", err?.message ?? err);
    }
  };

  // Auto-save when screen loads
  useEffect(() => {
    saveTestScore();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{eye} Eye Vision Result</Text>

      <Text style={styles.visionValue}>Vision: {vision}</Text>

      <Text style={styles.resultTitle}>{resultTitle}</Text>

      <Text style={styles.message}>{message}</Text>

      <Text style={styles.disclaimer}>
        Disclaimer: This is a screening test and does not replace a clinical eye
        examination.
      </Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("Main")}
        style={styles.btn}
      >
        Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: "center", fontWeight: "bold" },
  visionValue: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultTitle: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#1976D2",
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    fontStyle: "italic",
  },
  btn: { marginTop: 35 },
});

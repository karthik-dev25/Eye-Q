/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";
import { TumblingE } from "../../utility/constant";

type Props = NativeStackScreenProps<RootStackParamList, "LeftEyeDV">;

const SLOAN = ["C", "D", "H", "K", "N", "O", "R", "S", "V", "Z"];

export default function LeftEyeDV({ route, navigation }: Props) {
  const testType = route.params.testType;

  const fontSizes = [72, 60, 48, 36, 30, 24];
  const counts = [1, 2, 3, 4, 5, 6];

  const [level, setLevel] = useState(0);
  const [generated, setGenerated] = useState<string[]>([]);
  const [angles, setAngles] = useState<number[]>([]);
  const [lastCorrect, setLastCorrect] = useState(0);

  const generateRow = () => {
    let count = counts[level];

    if (testType === "Sloan Letters") {
      setGenerated(shuffle(pickRandom(SLOAN, count)));
    } else if (testType === "Numbers") {
      const nums = shuffle(pickRandom("0123456789".split(""), count));
      setGenerated(nums);
    } else {
      const ang = [];
      for (let i = 0; i < count; i++)
        ang.push([0, 90, 180, 270][Math.floor(Math.random() * 4)]);

      setAngles(ang);
    }
  };

  useEffect(() => {
    generateRow();
  }, [level]);

  const pickRandom = (arr: any[], count: number) =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, count);

  const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  const onCorrect = () => {
    setLastCorrect(level + 1);
    if (level + 1 === 6) {
      showResults();
    } else setLevel(level + 1);
  };

  const onWrong = () => showResults();

  const showResults = () => {
    navigation.navigate("DVResults", {
      lastCorrect,
      eye: "right",
      testType,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Right Eye Test - {testType}</Text>
      <Text style={styles.subtitle}>Level {level + 1} / 6</Text>

      <View style={styles.row}>
        {testType !== "Tumbling E" ? (
          <Text style={{ fontSize: fontSizes[level], textAlign: "center" }}>
            {generated.join(" ")}
          </Text>
        ) : (
          angles.map((a, idx) => (
            <Image
              key={idx}
              source={TumblingE[a]}
              style={{
                width: fontSizes[level],
                height: fontSizes[level],
                marginHorizontal: 4,
              }}
            />
          ))
        )}
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
  row: { flexDirection: "row", justifyContent: "center", marginVertical: 30 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  subtitle: { textAlign: "center", marginTop: 8 },
  btn: { marginTop: 20 },
  btnWrong: { marginTop: 10, backgroundColor: "red" },
});

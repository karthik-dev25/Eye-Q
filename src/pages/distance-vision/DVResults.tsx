import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "DVResults">;

export default function DVResults({ route, navigation }: Props) {
  const { lastCorrect, eye, testType } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{eye.toUpperCase()} Eye Result</Text>

      <Text style={styles.score}>
        Last Correct Level: {lastCorrect === 0 ? "None" : lastCorrect}
      </Text>

      <Text style={styles.testType}>Test: {testType}</Text>

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
  score: { fontSize: 18, marginTop: 20, textAlign: "center" },
  testType: { fontSize: 16, marginVertical: 10, textAlign: "center" },
  btn: { marginTop: 30 },
});

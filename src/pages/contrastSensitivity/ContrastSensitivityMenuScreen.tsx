/* eslint-disable react-native/no-inline-styles */
// src/pages/contrast/ContrastSensitivityMenuScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "ContrastSensitivityMenu">;

export default function ContrastSensitivityMenuScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contrast Sensitivity Test</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Attend right eye test before left eye test.</Text>
        </Card.Content>

        <Card.Actions style={{ justifyContent: "center" }}>
          <Button
            mode="contained"
            onPress={() => navigation.replace("RightEyeContrast")}
            style={{ marginRight: 8 }}
          >
            Right Eye Test
          </Button>
          <Button mode="contained" onPress={() => navigation.replace("LeftEyeContrast")}>
            Left Eye Test
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 12 },
  card: { padding: 8, marginVertical: 12 },
});

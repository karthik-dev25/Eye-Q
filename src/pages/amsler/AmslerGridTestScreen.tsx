// src/pages/amsler/AmslerGridTestScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "AmslerGridTest">;

export default function AmslerGridTestScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amsler Grid Test</Text>
      <Text style={styles.subtitle}>
        Attend the right eye test first, then the left eye test.
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            style={styles.btn}
            onPress={() => navigation.navigate("RightEyeAmsler")}
          >
            Right Eye Test
          </Button>

          <Button
            mode="contained"
            style={styles.btn}
            onPress={() => navigation.navigate("LeftEyeAmsler")}
          >
            Left Eye Test
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginTop: 8 },
  subtitle: { textAlign: "center", marginVertical: 12, color: "#555" },
  card: { marginTop: 20, paddingVertical: 20, borderRadius: 12 },
  btn: { marginVertical: 8 },
});

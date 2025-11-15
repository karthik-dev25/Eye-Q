/* eslint-disable react-native/no-inline-styles */
// src/pages/nearvision/NearVisionMenuScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "NearVisionMenu">;

const languages = ["English", "Tamil", "Telugu", "Hindi"];

export default function NearVisionMenuScreen({ navigation }: Props) {
  const [language, setLanguage] = useState<string | null>(null);

  const startTest = (side: "right" | "left") => {
    if (!language) return;
    const routeName = side === "right" ? "NearVisionRight" : "NearVisionLeft";
    // Use replace so stack gets cleaned
    navigation.replace(routeName as any, { language });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Near Vision Test</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Select Language</Text>
          <View style={styles.langRow}>
            {languages.map((l) => (
              <Button
                key={l}
                mode={language === l ? "contained" : "outlined"}
                onPress={() => setLanguage(l)}
                style={styles.langButton}
              >
                {l}
              </Button>
            ))}
          </View>

          <Text style={{ marginTop: 12 }}>
            {language ? `Selected: ${language}` : "Please select a language"}
          </Text>
        </Card.Content>

        <Card.Actions style={{ justifyContent: "center" }}>
          <Button
            mode="contained"
            disabled={!language}
            onPress={() => startTest("right")}
            style={{ marginRight: 8 }}
          >
            Start Right Eye Test
          </Button>
          <Button mode="contained" disabled={!language} onPress={() => startTest("left")}>
            Start Left Eye Test
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
  langRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  langButton: { margin: 4 },
});

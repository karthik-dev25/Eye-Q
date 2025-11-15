import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utility/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "DVTestTypeSelect">;

export default function DVTestTypeSelect({ route, navigation }: Props) {
  const { onSelect } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Test Type</Text>

      <Button
        mode="contained"
        style={styles.btn}
        onPress={() => {
          onSelect("Sloan Letters");
          navigation.goBack();
        }}
      >
        Sloan Letters
      </Button>

      <Button
        mode="contained"
        style={styles.btn}
        onPress={() => {
          onSelect("Numbers");
          navigation.goBack();
        }}
      >
        Numbers
      </Button>

      <Button
        mode="contained"
        style={styles.btn}
        onPress={() => {
          onSelect("Tumbling E");
          navigation.goBack();
        }}
      >
        Tumbling E
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  btn: { marginVertical: 12 },
});

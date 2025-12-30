import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function SocialDivider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  text: {
    fontSize: 15,
    color: "rgba(0, 0, 0, 0.5)",
    marginHorizontal: 15,
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SignupHeaderProps {
  subtitle: string;
}

export function SignupHeader({ subtitle }: SignupHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#000000",
    textAlign: "center",
  },
});

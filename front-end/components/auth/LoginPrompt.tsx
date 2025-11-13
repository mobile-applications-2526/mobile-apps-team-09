import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface LoginPromptProps {
  onPress: () => void;
}

export function LoginPrompt({ onPress }: LoginPromptProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>already a account? </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.linkText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 15,
    color: "#0F4336",
  },
  linkText: {
    fontSize: 15,
    color: "#0F4336",
    fontWeight: "600",
  },
});

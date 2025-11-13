import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SignUpPromptProps {
  onPress: () => void;
}

export function SignUpPrompt({ onPress }: SignUpPromptProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Don&apos;t have an account? </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.linkText}>Sign up</Text>
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

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface LoginButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
}

export function LoginButton({ title, onPress, isLoading }: LoginButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={onPress} disabled={isLoading}>
      <Text style={styles.buttonText}>{isLoading ? "Signing in..." : title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0F4336",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#A1A1A1",
  },
  buttonDisabled: {
    backgroundColor: "#A1A1A1",
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "600",
  },
});

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface LoginButtonProps {
  title: string;
  onPress: () => void;
}

export function LoginButton({ title, onPress }: LoginButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "600",
  },
});

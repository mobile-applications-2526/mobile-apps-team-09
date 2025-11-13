import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface LoginHeaderProps {
  title: string;
  subtitle: string;
}

export function LoginHeader({ title, subtitle }: LoginHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#0F4336",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#000000",
    textAlign: "center",
  },
});

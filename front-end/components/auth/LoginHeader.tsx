import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StatusMessage } from "./StatusMessage";

interface LoginHeaderProps {
  title: string;
  subtitle: string;
  statusMessage?: string;
  statusType?: "error" | "success";
  showStatus?: boolean;
}

export function LoginHeader({
  title,
  subtitle,
  statusMessage = "",
  statusType = "error",
  showStatus = false,
}: LoginHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.appNameContainer}>
        <Ionicons name="leaf" size={40} color="#0F4336" />
        <Text style={styles.appName}>Plantsense AI</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <StatusMessage
        message={statusMessage}
        type={statusType}
        visible={showStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
    top: 20,
  },
  appNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: "700",
    fontFamily: Fonts.rounded,
    color: "#0F4336",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    fontFamily: Fonts.rounded,
    color: "#0F4336",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    color: "#2D5F4F",
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 50,
  },
});

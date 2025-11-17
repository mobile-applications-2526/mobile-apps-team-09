import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DiagnosisDetailHeaderProps {
  plantName: string;
  date: string;
  onBackPress: () => void;
}

export function DiagnosisDetailHeader({
  plantName,
  date,
  onBackPress,
}: DiagnosisDetailHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerLabel}>Plant Diagnosis</Text>
        <Text style={styles.headerTitle}>{plantName}</Text>
        <Text style={styles.headerSubtitle}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    width: 40,
    height: 40,
    top: 30,
    borderRadius: 20,
    backgroundColor: "#558B2F",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    alignItems: "center",
  },
  headerLabel: {
    fontSize: 12,
    color: "#558B2F",
    opacity: 0.7,
    marginBottom: 4,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 2,
    textAlign: "center",
    marginLeft: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#558B2F",
    opacity: 0.6,
    textAlign: "center",
  },
});

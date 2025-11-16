import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface TipItemProps {
  text: string;
}

const TipItem: React.FC<TipItemProps> = ({ text }) => (
  <View style={styles.tipItem}>
    <Ionicons name="checkmark-circle" size={20} color={COLORS.primaryGreen} />
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

export const PhotoTips: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Photo Tips</Text>
      <TipItem text="Ensure good lighting" />
      <TipItem text="Focus on the whole plant or leaves" />
      <TipItem text="Avoid blurry images" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
});

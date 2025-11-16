import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AIIdentifiedCardProps {
  children: ReactNode;
}

export const AIIdentifiedCard: React.FC<AIIdentifiedCardProps> = ({
  children,
}) => {
  return (
    <LinearGradient colors={["#C8E6C9", "#A9DEAB"]} style={styles.card}>
      {/* AI Identified Badge */}
      <View style={styles.badgeRow}>
        <View style={styles.checkmarkCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={styles.badgeText}>AI Identified</Text>
      </View>

      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  checkmarkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkmark: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "400",
  },
  badgeText: {
    fontSize: 16,
    color: "#1B5E20",
    fontWeight: "400",
  },
});

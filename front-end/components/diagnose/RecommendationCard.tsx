import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecommendationCardProps {
  text: string;
}

export function RecommendationCard({ text }: RecommendationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={styles.recommendationIcon}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
        </View>
        <Text style={styles.sectionTitle}>Recommendation</Text>
      </View>
      <Text style={styles.recommendationText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  recommendationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#1B5E20",
    fontWeight: "500",
  },
  recommendationText: {
    fontSize: 16,
    color: "#1B5E20",
    opacity: 0.8,
    lineHeight: 26,
  },
});

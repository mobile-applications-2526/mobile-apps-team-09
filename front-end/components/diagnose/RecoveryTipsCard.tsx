import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CareTipItem {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  label: string;
  value: string;
}

interface RecoveryTipsCardProps {
  tips: CareTipItem[];
}

export function RecoveryTipsCard({ tips }: RecoveryTipsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.careTipsTitle}>Recovery Care Tips</Text>

      <View style={styles.careTipsContainer}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.careTipItem}>
            <View
              style={[
                styles.careTipIcon,
                { backgroundColor: tip.backgroundColor },
              ]}
            >
              <Ionicons name={tip.icon} size={20} color={tip.iconColor} />
            </View>
            <View style={styles.careTipText}>
              <Text style={styles.careTipLabel}>{tip.label}</Text>
              <Text style={styles.careTipValue}>{tip.value}</Text>
            </View>
          </View>
        ))}
      </View>
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
  careTipsTitle: {
    fontSize: 16,
    color: "#1B5E20",
    marginBottom: 32,
    fontWeight: "500",
  },
  careTipsContainer: {
    gap: 16,
  },
  careTipItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  careTipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  careTipText: {
    flex: 1,
  },
  careTipLabel: {
    fontSize: 16,
    color: "#1B5E20",
    marginBottom: 2,
  },
  careTipValue: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
  },
});

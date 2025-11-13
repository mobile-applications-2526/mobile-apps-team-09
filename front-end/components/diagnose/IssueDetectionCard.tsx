import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IssueDetectionCardProps {
  disease: string;
  confidence: string;
  confidenceColor: string;
}

export function IssueDetectionCard({
  disease,
  confidence,
  confidenceColor,
}: IssueDetectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.issueHeader}>
        <View style={styles.issueIconContainer}>
          <Ionicons name="warning" size={20} color="#F44336" />
        </View>
        <View style={styles.issueTextContainer}>
          <Text style={styles.issueLabel}>Issue Detected</Text>
          <Text style={styles.issueTitle}>{disease}</Text>
        </View>
      </View>

      <View style={styles.confidenceSection}>
        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceLabel}>Confidence Score</Text>
          <Text style={styles.confidenceValue}>{confidence}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${parseInt(confidence)}%`,
                backgroundColor: confidenceColor,
              },
            ]}
          />
        </View>
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
  issueHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  issueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  issueTextContainer: {
    flex: 1,
  },
  issueLabel: {
    fontSize: 16,
    color: "#1B5E20",
    opacity: 0.6,
    marginBottom: 4,
  },
  issueTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1B5E20",
  },
  confidenceSection: {
    marginTop: 8,
  },
  confidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 16,
    color: "#1B5E20",
    opacity: 0.6,
  },
  confidenceValue: {
    fontSize: 16,
    color: "#1B5E20",
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

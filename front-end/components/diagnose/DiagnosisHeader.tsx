import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DiagnosisHeaderProps {
  totalScans: number;
  onSortPress: () => void;
}

export const DiagnosisHeader: React.FC<DiagnosisHeaderProps> = ({
  totalScans,
  onSortPress,
}) => {
  return (
    <View style={styles.headerCard}>
      <View style={styles.headerContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Diagnosis History</Text>
          <Text style={styles.subtitle}>
            {totalScans} total {totalScans === 1 ? "scan" : "scans"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={onSortPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="funnel" size={20} color="#558B2F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 4,
    marginLeft: -10,
  },
  subtitle: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(85, 139, 47, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});

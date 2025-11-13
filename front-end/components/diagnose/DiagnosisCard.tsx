import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DiagnosisCardProps {
  plantName: string;
  disease: string;
  severity: "High" | "Medium" | "Low";
  severityColor: string;
  confidence: string;
  confidenceColor: string;
  date: string;
  imageUri: string;
  onPress?: () => void;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({
  plantName,
  disease,
  severity,
  severityColor,
  confidence,
  confidenceColor,
  date,
  imageUri,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {/* Plant Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.plantImage}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Top Row: Name and Severity Badge */}
        <View style={styles.topRow}>
          <View style={styles.textContainer}>
            <Text style={styles.plantName} numberOfLines={1}>
              {plantName}
            </Text>
            <Text style={styles.disease} numberOfLines={1}>
              {disease}
            </Text>
          </View>
          <View
            style={[styles.severityBadge, { backgroundColor: severityColor }]}
          >
            <Text style={styles.severityText}>{severity}</Text>
          </View>
        </View>

        {/* Bottom Row: Date and Confidence */}
        <View style={styles.bottomRow}>
          <View style={styles.dateContainer}>
            <Ionicons
              name="time-outline"
              size={14}
              color="#558B2F"
              style={styles.icon}
            />
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <View style={styles.confidenceContainer}>
            <Ionicons
              name="analytics-outline"
              size={16}
              color={confidenceColor}
              style={styles.icon}
            />
            <Text style={[styles.confidenceText, { color: confidenceColor }]}>
              {confidence}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 14,
    marginBottom: 14,
    padding: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    width: 96,
    height: 96,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    marginRight: 16,
  },
  plantImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 4,
  },
  disease: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

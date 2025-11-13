import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

interface DiagnosisImageCardProps {
  imageUri: string;
  severity: string;
  severityColor: string;
}

export function DiagnosisImageCard({
  imageUri,
  severity,
  severityColor,
}: DiagnosisImageCardProps) {
  return (
    <View style={styles.imageCard}>
      <Image
        source={{ uri: imageUri }}
        style={styles.plantImage}
        resizeMode="cover"
      />
      <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
        <Text style={styles.severityBadgeText}>{severity} Severity</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  plantImage: {
    width: "100%",
    height: 253,
  },
  severityBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  severityBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

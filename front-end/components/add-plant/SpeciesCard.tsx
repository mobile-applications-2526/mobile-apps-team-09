import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface SpeciesCardProps {
  commonName: string;
  scientificName: string;
}

export const SpeciesCard: React.FC<SpeciesCardProps> = ({
  commonName,
  scientificName,
}) => {
  return (
    <View style={styles.card}>
      <Ionicons
        name="leaf"
        size={32}
        color={COLORS.primaryGreen}
        style={styles.icon}
      />
      <View style={styles.info}>
        <Text style={styles.commonName}>{commonName}</Text>
        <Text style={styles.scientificName}>{scientificName}</Text>
      </View>
      <Ionicons name="checkmark-circle" size={24} color={COLORS.healthyGreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardWhite,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  commonName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },
});

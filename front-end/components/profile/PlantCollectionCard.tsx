import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/colors";

interface PlantItem {
  id: string;
  name: string;
  emoji: string;
  backgroundColor: string;
}

interface PlantCollectionCardProps {
  plants: PlantItem[];
  onViewAll: () => void;
}

export const PlantCollectionCard: React.FC<PlantCollectionCardProps> = ({
  plants,
  onViewAll,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Plant Collection</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {plants.map((plant) => (
          <TouchableOpacity key={plant.id} style={styles.plantCard}>
            <View
              style={[
                styles.plantEmoji,
                { backgroundColor: plant.backgroundColor },
              ]}
            >
              <Text style={styles.emoji}>{plant.emoji}</Text>
            </View>
            <Text style={styles.plantName}>{plant.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B5E20",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  plantCard: {
    width: "33.33%",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  plantEmoji: {
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
  },
  plantName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
});

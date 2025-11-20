import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface PlantItem {
  id: number;
  plant_name: string;
  image_url: string | null;
}

interface PlantCollectionCardProps {
  plants: PlantItem[];
  onViewAll: () => void;
}

export const PlantCollectionCard: React.FC<PlantCollectionCardProps> = ({
  plants,
  onViewAll,
}) => {
  const router = useRouter();

  // Show max 6 plants in 2 rows of 3, but only 5 if there are more than 6
  const hasMorePlants = plants.length > 6;
  const displayPlants = hasMorePlants ? plants.slice(0, 5) : plants.slice(0, 6);

  if (plants.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Plant Collection</Text>
        </View>
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIconContainer}>
            <Ionicons name="leaf" size={32} color={COLORS.primaryGreen} />
          </View>
          <Text style={styles.emptyStateTitle}>No Plants Yet</Text>
          <Text style={styles.emptyStateDescription}>
            Start your collection by adding your first plant to track its growth and care
          </Text>
          <TouchableOpacity
            style={styles.addPlantButton}
            onPress={() => router.push("/add-plant/choose-photo")}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.addPlantButtonText}>Add a Plant</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          My Plant Collection ({plants.length})
        </Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {displayPlants.map((plant) => (
          <TouchableOpacity key={plant.id} style={styles.plantCard}>
            <View style={styles.plantImageContainer}>
              {plant.image_url ? (
                <Image
                  source={{ uri: plant.image_url }}
                  style={styles.plantImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons
                    name="leaf-outline"
                    size={28}
                    color={COLORS.secondary}
                  />
                </View>
              )}
            </View>
            <Text style={styles.plantName} numberOfLines={2}>
              {plant.plant_name}
            </Text>
          </TouchableOpacity>
        ))}
        {hasMorePlants && (
          <TouchableOpacity onPress={onViewAll} style={styles.plantCard}>
            <View style={styles.moreCard}>
              <Text style={styles.moreText}>+{plants.length - 5}</Text>
              <Text style={styles.moreSubText}>more plants</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B5E20",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    height: 230,
    paddingVertical: 8,
  },
  plantCard: {
    width: "31%",
    marginBottom: 12,
  },
  plantImageContainer: {
    width: "81%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
    marginLeft: 11,
  },
  plantImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primaryPale,
    justifyContent: "center",
    alignItems: "center",
  },
  plantName: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  moreCard: {
    width: "81%",
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 11,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderWidth: 2,
    borderColor: COLORS.primaryGreen,
    borderStyle: "dashed",
  },
  moreText: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primaryGreen,
  },
  moreSubText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primaryGreen,
    marginTop: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: 230,
    justifyContent: "center",
  },
  emptyStateIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  addPlantButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
    shadowColor: COLORS.primaryGreen,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addPlantButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

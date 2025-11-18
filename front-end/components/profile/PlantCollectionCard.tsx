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

  // Show max 6 plants
  const displayPlants = plants.slice(0, 6);
  const hasMorePlants = plants.length > 6;

  if (plants.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Plant Collection</Text>
        </View>
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIconContainer}>
            <Ionicons name="leaf" size={64} color={COLORS.primaryGreen} />
          </View>
          <Text style={styles.emptyStateTitle}>No Plants Yet</Text>
          <Text style={styles.emptyStateDescription}>
            Start your collection by adding your first plant to track its growth and care
          </Text>
          <TouchableOpacity
            style={styles.addPlantButton}
            onPress={() => router.push("/(tabs)/garden")}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
                    size={32}
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
          <TouchableOpacity onPress={onViewAll} style={styles.moreCard}>
            <View style={styles.moreIconContainer}>
              <Ionicons name="add" size={32} color={COLORS.primaryGreen} />
              <Text style={styles.moreText}>
                +{plants.length - 6} more
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  scrollContent: {
    paddingRight: 16,
  },
  plantCard: {
    width: 100,
    marginRight: 12,
  },
  plantImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
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
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  moreCard: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primaryGreen,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  moreIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primaryGreen,
    marginTop: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  addPlantButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryGreen,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    gap: 10,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

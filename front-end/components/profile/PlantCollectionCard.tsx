import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
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
  const screenWidth = Dimensions.get("window").width;
  const availableWidth = screenWidth - 64;
  const pageGap = 16;
  const cardWidth = (availableWidth - 16) / 3;

  // Split plants into pages of 6
  const pages: PlantItem[][] = [];
  for (let i = 0; i < plants.length; i += 6) {
    pages.push(plants.slice(i, i + 6));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Plant Collection ({plants.length})</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        decelerationRate="fast"
        snapToInterval={availableWidth + pageGap}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={true}
        bounces={false}
      >
        {pages.map((page, pageIndex) => (
          <View
            key={pageIndex}
            style={[
              styles.page,
              {
                width: availableWidth,
                marginRight: pageIndex < pages.length - 1 ? pageGap : 0,
              },
            ]}
          >
            {/* Top Row - first 3 plants */}
            <View style={styles.row}>
              {page.slice(0, 3).map((plant, idx) => (
                <TouchableOpacity
                  key={plant.id}
                  style={[styles.plantCard, { width: cardWidth }]}
                >
                  <View
                    style={[
                      styles.imageContainer,
                      { width: cardWidth, height: cardWidth },
                    ]}
                  >
                    {plant.image_url ? (
                      <Image
                        source={{ uri: plant.image_url }}
                        style={styles.plantImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.placeholderImage} />
                    )}
                  </View>
                  <Text style={styles.plantName} numberOfLines={2}>
                    {plant.plant_name}
                  </Text>
                </TouchableOpacity>
              ))}
              {/* Fill empty spaces in top row if less than 3 plants */}
              {page.slice(0, 3).length < 3 &&
                Array.from({ length: 3 - page.slice(0, 3).length }).map(
                  (_, idx) => (
                    <View
                      key={`top-placeholder-${idx}`}
                      style={[styles.plantCard, { width: cardWidth }]}
                    />
                  )
                )}
            </View>

            {/* Bottom Row - only show if there are more than 3 plants in this page */}
            {page.length > 3 && (
              <View style={styles.row}>
                {page.slice(3, 6).map((plant) => (
                  <TouchableOpacity
                    key={plant.id}
                    style={[styles.plantCard, { width: cardWidth }]}
                  >
                    <View
                      style={[
                        styles.imageContainer,
                        { width: cardWidth, height: cardWidth },
                      ]}
                    >
                      {plant.image_url ? (
                        <Image
                          source={{ uri: plant.image_url }}
                          style={styles.plantImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.placeholderImage} />
                      )}
                    </View>
                    <Text style={styles.plantName} numberOfLines={2}>
                      {plant.plant_name}
                    </Text>
                  </TouchableOpacity>
                ))}
                {/* Fill empty spaces in bottom row */}
                {page.slice(3, 6).length < 3 &&
                  Array.from({ length: 3 - page.slice(3, 6).length }).map(
                    (_, idx) => (
                      <View
                        key={`bottom-placeholder-${idx}`}
                        style={[styles.plantCard, { width: cardWidth }]}
                      />
                    )
                  )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
  scrollContent: {
    paddingRight: 0,
  },
  page: {
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  plantCard: {
    alignItems: "center",
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: COLORS.primaryPale,
    justifyContent: "center",
    alignItems: "center",
  },
  plantImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primaryPale,
    borderRadius: 16,
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

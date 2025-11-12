import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { COLORS } from "@/constants/colors";
import { Plant, getPlantStatus } from "@/utils/plantHelpers";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_HEIGHT = 420;
const SPACING = 16;

interface PlantCarouselProps {
  plants: Plant[];
}

export const PlantCarousel: React.FC<PlantCarouselProps> = ({ plants }) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  if (plants.length === 0) {
    return (
      <View style={styles.emptyState}>
        <IconSymbol name="leaf.fill" size={64} color={COLORS.primaryLight} />
        <Text style={styles.emptyText}>No plants yet</Text>
        <Text style={styles.emptySubtext}>
          Add your first plant to get started!
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>My Garden</Text>
          <Text style={styles.sectionSubtitle}>
            {plants.length} {plants.length === 1 ? "plant" : "plants"} growing
          </Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <IconSymbol name="chevron.right" size={16} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        data={plants}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContainer}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING),
            index * (CARD_WIDTH + SPACING),
            (index + 1) * (CARD_WIDTH + SPACING),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.92, 1, 0.92],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: "clamp",
          });

          const plantStatusData = getPlantStatus(item);

          return (
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.carouselCardContainer]}
            >
              <Animated.View
                style={[
                  styles.plantCarouselCard,
                  {
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              >
                <View style={styles.plantImageContainer}>
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.plantImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderImageLarge}>
                      <IconSymbol
                        name="leaf.fill"
                        size={80}
                        color={COLORS.primaryLight}
                      />
                    </View>
                  )}

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: plantStatusData.color },
                    ]}
                  >
                    <IconSymbol name="heart.fill" size={14} color="#FFFFFF" />
                    <Text style={styles.statusText}>
                      {plantStatusData.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.plantCardContent}>
                  <View style={styles.plantCardHeader}>
                    <View style={styles.plantTitleContainer}>
                      <Text style={styles.plantTitle} numberOfLines={1}>
                        {item.plant_name}
                      </Text>
                      <View style={styles.speciesTag}>
                        <IconSymbol
                          name="leaf.fill"
                          size={12}
                          color={COLORS.secondary}
                        />
                        <Text style={styles.speciesText} numberOfLines={1}>
                          {item.species.common_name}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {item.location && (
                    <View style={styles.locationContainer}>
                      <IconSymbol
                        name="location.fill"
                        size={14}
                        color={COLORS.textTertiary}
                      />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>
                  )}

                  <View style={styles.careInfo}>
                    <View style={styles.careItem}>
                      <View style={styles.careIconContainer}>
                        <IconSymbol
                          name="drop.fill"
                          size={18}
                          color={COLORS.skyLight}
                        />
                      </View>
                      <View style={styles.careTextContainer}>
                        <Text style={styles.careLabel}>Watering</Text>
                        <Text style={styles.careValue}>
                          Every {item.species.watering_frequency_days} days
                        </Text>
                      </View>
                    </View>

                    <View style={styles.careItem}>
                      <View style={styles.careIconContainer}>
                        <IconSymbol
                          name="calendar"
                          size={18}
                          color={COLORS.primaryGreen}
                        />
                      </View>
                      <View style={styles.careTextContainer}>
                        <Text style={styles.careLabel}>Last Watered</Text>
                        <Text style={styles.careValue}>
                          {item.last_watered
                            ? new Date(item.last_watered).toLocaleDateString()
                            : "Never"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.actionButton}>
                    <IconSymbol name="drop.fill" size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Water Now</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: `${COLORS.secondary}10`,
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary,
    marginRight: 4,
  },
  carouselContainer: {
    paddingLeft: 24,
    paddingRight: 24 - SPACING,
  },
  carouselCardContainer: {
    width: CARD_WIDTH,
    marginRight: SPACING,
  },
  plantCarouselCard: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: 28,
    overflow: "hidden",
    height: CARD_HEIGHT,
  },
  plantImageContainer: {
    width: "100%",
    height: 240,
    backgroundColor: COLORS.primaryPale,
    position: "relative",
  },
  plantImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImageLarge: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryPale,
  },
  statusBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 6,
  },
  plantCardContent: {
    padding: 20,
  },
  plantCardHeader: {
    marginBottom: 12,
  },
  plantTitleContainer: {
    marginBottom: 8,
  },
  plantTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  speciesTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.secondary}10`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  speciesText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.secondary,
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  careInfo: {
    marginBottom: 16,
  },
  careItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  careIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryPale,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  careTextContainer: {
    flex: 1,
  },
  careLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  careValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

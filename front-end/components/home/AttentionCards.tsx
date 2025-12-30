import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { COLORS } from "@/constants/colors";
import { Plant } from "@/utils/plantHelpers";
import { useRouter } from "expo-router";
import { usePlantNavigation } from "@/contexts/PlantNavigationContext";

interface AttentionCardsProps {
  plants: Plant[];
}

export const AttentionCards: React.FC<AttentionCardsProps> = ({ plants }) => {
  const router = useRouter();
  const { setSelectedPlantId } = usePlantNavigation();

  if (plants.length === 0) {
    return null;
  }

  return (
    <>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Needs Attention Today</Text>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>{plants.length}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={plants}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.attentionList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.attentionCard, index === 0 && { marginLeft: 24 }]}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedPlantId(item.id);
              router.push("/(tabs)/garden");
            }}
          >
            <View style={styles.attentionImageContainer}>
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.attentionImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.log("Image load error:", error.nativeEvent.error);
                  }}
                  defaultSource={require("@/assets/images/react-logo.png")}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <IconSymbol
                    name="leaf.fill"
                    size={40}
                    color={COLORS.primaryLight}
                  />
                </View>
              )}
            </View>
            <View style={styles.attentionContent}>
              <View style={styles.attentionBadge}>
                <IconSymbol name="drop.fill" size={12} color="#FFFFFF" />
                <Text style={styles.attentionBadgeText}>Water</Text>
              </View>
              <Text style={styles.attentionPlantName} numberOfLines={1}>
                {item.plant_name}
              </Text>
              <Text style={styles.attentionSpecies} numberOfLines={1}>
                {item.species.common_name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  badgeCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.urgentRed,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeCountText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  attentionList: {
    paddingRight: 24,
    paddingBottom: 8,
  },
  attentionCard: {
    width: 160,
    backgroundColor: COLORS.cardWhite,
    borderRadius: 20,
    marginRight: 16,
    overflow: "hidden",
  },
  attentionImageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: COLORS.primaryPale,
  },
  attentionImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryPale,
  },
  attentionContent: {
    padding: 14,
  },
  attentionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.skyLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  attentionBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  attentionPlantName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  attentionSpecies: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});

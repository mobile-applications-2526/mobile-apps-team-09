import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import PlantService from "@/services/PlantService";
import { usePlantNavigation } from "@/contexts/PlantNavigationContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PlantSpecies {
  species_name: string;
  light_requirement: string;
  watering_frequency_days: number;
  fertilizing_frequency_days: number;
  description?: string;
}

interface Plant {
  id: number;
  plant_name: string;
  location: string;
  last_watered: string;
  image_url?: string;
  species: PlantSpecies;
  status?: "healthy" | "needs_water" | "needs_attention";
  position?: { left: string; top: string };
}

interface PlantPinpointProps {
  plant: Plant;
  onPress: (plant: Plant) => void;
}

const PlantPinpoint: React.FC<PlantPinpointProps> = ({ plant, onPress }) => {
  const getEmojiForStatus = () => {
    switch (plant.status) {
      case "healthy":
        return "🌱";
      case "needs_water":
        return "💧";
      case "needs_attention":
        return "⚠️";
      default:
        return "🌱";
    }
  };

  const getColorForStatus = () => {
    switch (plant.status) {
      case "healthy":
        return "#4CAF50";
      case "needs_water":
        return "#2196F3";
      case "needs_attention":
        return "#FF9800";
      default:
        return "#4CAF50";
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.pinpoint,
        { left: plant.position?.left as any, top: plant.position?.top as any },
      ]}
      onPress={() => onPress(plant)}
    >
      <View
        style={[
          styles.pinpointCircle,
          { backgroundColor: getColorForStatus() },
        ]}
      >
        <Text style={styles.pinpointEmoji}>{getEmojiForStatus()}</Text>
      </View>
      {plant.status === "needs_attention" && (
        <View style={styles.attentionDot} />
      )}
    </TouchableOpacity>
  );
};

const HomeExplorerView: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWatering, setIsWatering] = useState(false);
  const [wateringSuccess, setWateringSuccess] = useState(false);
  const { selectedPlantId, setSelectedPlantId } = usePlantNavigation();

  // Modal swipe gesture
  const modalTranslateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  // Gesture values
  const scale = useSharedValue(0.5);
  const savedScale = useSharedValue(0.5);
  const translateX = useSharedValue(-SCREEN_WIDTH);
  const translateY = useSharedValue(-SCREEN_HEIGHT);
  const savedTranslateX = useSharedValue(-SCREEN_WIDTH);
  const savedTranslateY = useSharedValue(-SCREEN_HEIGHT);

  useEffect(() => {
    fetchPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-open modal when navigating from home screen with selected plant
  useEffect(() => {
    if (selectedPlantId && plants.length > 0) {
      const plant = plants.find((p) => p.id === selectedPlantId);
      if (plant) {
        setSelectedPlant(plant);
        setModalVisible(true);
        // Clear the selected plant ID after opening
        setSelectedPlantId(null);
      }
    }
  }, [selectedPlantId, plants, setSelectedPlantId]);

  const calculatePlantStatus = (
    lastWatered: string,
    wateringFrequency: number
  ): "healthy" | "needs_water" | "needs_attention" => {
    const lastWateredDate = new Date(lastWatered);
    const now = new Date();
    const daysSinceWatered = Math.floor(
      (now.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceWatered >= wateringFrequency * 1.5) {
      return "needs_attention";
    } else if (daysSinceWatered >= wateringFrequency) {
      return "needs_water";
    } else {
      return "healthy";
    }
  };

  const predefinedPositions = [
    { left: "45%", top: "40%" },
    { left: "55%", top: "45%" },
    { left: "50%", top: "50%" },
    { left: "48%", top: "55%" },
    { left: "52%", top: "60%" },
    { left: "46%", top: "48%" },
    { left: "54%", top: "52%" },
    { left: "50%", top: "58%" },
  ];

  const generateRandomPosition = (index: number) => {
    if (index < predefinedPositions.length) {
      return predefinedPositions[index];
    }
    const left = `${45 + Math.random() * 10}%`;
    const top = `${40 + Math.random() * 20}%`;
    return { left, top };
  };

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const plantsData = await PlantService.getMyPlants();
      const plantsWithStatus = plantsData.map((plant: any, index: number) => ({
        ...plant,
        status: calculatePlantStatus(
          plant.last_watered,
          plant.species.watering_frequency_days
        ),
        position: generateRandomPosition(index),
      }));
      setPlants(plantsWithStatus);
    } catch (error) {
      console.error("Failed to fetch plants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlantPress = (plant: Plant) => {
    setSelectedPlant(plant);
    setModalVisible(true);
    setWateringSuccess(false);
  };

  const handleWaterPlant = async () => {
    if (!selectedPlant || isWatering) return;

    setIsWatering(true);

    try {
      // Call the backend API to water the plant
      const updatedPlant = await PlantService.waterPlant(selectedPlant.id);

      // Update the plant in the local state
      setPlants((prevPlants) =>
        prevPlants.map((p) =>
          p.id === updatedPlant.id
            ? {
                ...p,
                last_watered: updatedPlant.last_watered,
                status: calculatePlantStatus(
                  updatedPlant.last_watered,
                  p.species.watering_frequency_days
                ),
              }
            : p
        )
      );

      // Update the selected plant
      setSelectedPlant((prev) =>
        prev
          ? {
              ...prev,
              last_watered: updatedPlant.last_watered,
              status: calculatePlantStatus(
                updatedPlant.last_watered,
                prev.species.watering_frequency_days
              ),
            }
          : null
      );

      // Show success feedback
      setWateringSuccess(true);

      // Auto-close modal after showing success message for 1.5 seconds
      setTimeout(() => {
        setWateringSuccess(false);
        setModalVisible(false);
        setIsWatering(false);
      }, 1500);
    } catch (error: any) {
      console.error("Error watering plant:", error);
      setIsWatering(false);
      // Show error alert
      alert(error.message || "Failed to water plant. Please try again.");
    }
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const newScale = savedScale.value * e.scale;
      scale.value = Math.min(Math.max(newScale, 0.5), 3);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const closeModal = () => {
    setModalVisible(false);
    modalTranslateY.value = 0;
  };

  const modalPanGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: modalTranslateY.value };
    })
    .onUpdate((event) => {
      // Only allow downward swipes
      if (event.translationY > 0) {
        modalTranslateY.value = context.value.y + event.translationY;
      }
    })
    .onEnd((event) => {
      // If swiped down more than 150px or fast velocity, close modal
      if (event.translationY > 150 || event.velocityY > 1000) {
        modalTranslateY.value = withSpring(1000, {
          damping: 30,
          stiffness: 150,
        });
        runOnJS(closeModal)();
      } else {
        // Otherwise, snap back smoothly
        modalTranslateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: modalTranslateY.value }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your garden...</Text>
        </View>
      ) : (
        <>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.imageContainer, animatedStyle]}>
              <ImageBackground
                source={require("@/assets/images/all-in-one-my-garden.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
              >
                {/* Plant Pinpoints */}
                {plants.map((plant) => (
                  <PlantPinpoint
                    key={plant.id}
                    plant={plant}
                    onPress={handlePlantPress}
                  />
                ))}
              </ImageBackground>
            </Animated.View>
          </GestureDetector>
        </>
      )}

      {/* Plant Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <GestureDetector gesture={modalPanGesture}>
            <Animated.View style={[styles.modalWrapper, modalAnimatedStyle]}>
              <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                <View style={styles.modalContent}>
                  {/* Close Handle */}
                  <View style={styles.modalHandle} />

                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    scrollEnabled={true}
                  >
                    {/* Header with Status Badge */}
                    <View style={styles.modalHeader}>
                      <View style={styles.headerContent}>
                        <Text style={styles.plantEmoji}>
                          {selectedPlant?.status === "healthy"
                            ? "🌿"
                            : selectedPlant?.status === "needs_water"
                            ? "💧"
                            : "⚠️"}
                        </Text>
                        <View style={styles.headerText}>
                          <Text style={styles.modalTitle}>
                            {selectedPlant?.plant_name}
                          </Text>
                          <Text style={styles.speciesSubtitle}>
                            {selectedPlant?.species.species_name}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              selectedPlant?.status === "healthy"
                                ? "rgba(76, 175, 80, 0.15)"
                                : selectedPlant?.status === "needs_water"
                                ? "rgba(33, 150, 243, 0.15)"
                                : "rgba(255, 152, 0, 0.15)",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                selectedPlant?.status === "healthy"
                                  ? "#66BB6A"
                                  : selectedPlant?.status === "needs_water"
                                  ? "#42A5F5"
                                  : "#FFA726",
                            },
                          ]}
                        >
                          {selectedPlant?.status === "healthy"
                            ? "Healthy"
                            : selectedPlant?.status === "needs_water"
                            ? "Needs Water"
                            : "Attention"}
                        </Text>
                      </View>
                    </View>

                    {/* Info Cards */}
                    <View style={styles.modalBody}>
                      <View style={styles.infoCard}>
                        <View style={styles.infoCardHeader}>
                          <View style={styles.iconContainer}>
                            <Feather name="map-pin" size={20} color="#66BB6A" />
                          </View>
                          <View style={styles.cardTextContainer}>
                            <Text style={styles.cardLabel}>LOCATION</Text>
                            <Text style={styles.cardValue}>
                              {selectedPlant?.location}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.statsRow}>
                        <View style={[styles.infoCard, styles.halfCard]}>
                          <View style={styles.iconContainer}>
                            <Feather name="sun" size={20} color="#FFB74D" />
                          </View>
                          <Text style={styles.cardLabel}>LIGHT</Text>
                          <Text style={styles.cardValueSmall}>
                            {selectedPlant?.species.light_requirement}
                          </Text>
                        </View>

                        <View style={[styles.infoCard, styles.halfCard]}>
                          <View style={styles.iconContainer}>
                            <Feather name="droplet" size={20} color="#4FC3F7" />
                          </View>
                          <Text style={styles.cardLabel}>WATERING</Text>
                          <Text style={styles.cardValueSmall}>
                            Every{" "}
                            {selectedPlant?.species.watering_frequency_days}d
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoCard}>
                        <View style={styles.infoCardHeader}>
                          <View style={styles.iconContainer}>
                            <Feather name="clock" size={20} color="#BA68C8" />
                          </View>
                          <View style={styles.cardTextContainer}>
                            <Text style={styles.cardLabel}>LAST WATERED</Text>
                            <Text style={styles.cardValue}>
                              {selectedPlant?.last_watered
                                ? new Date(
                                    selectedPlant.last_watered
                                  ).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Unknown"}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {selectedPlant?.species.description && (
                        <View style={styles.descriptionCard}>
                          <View style={styles.descriptionHeader}>
                            <Feather
                              name="book-open"
                              size={18}
                              color="#81C784"
                            />
                            <Text style={styles.descriptionTitle}>
                              About This Plant
                            </Text>
                          </View>
                          <Text style={styles.descriptionText}>
                            {selectedPlant.species.description}
                          </Text>
                        </View>
                      )}

                      {/* Action Button */}
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          isWatering && styles.actionButtonWatering,
                          wateringSuccess && styles.actionButtonSuccess,
                        ]}
                        onPress={handleWaterPlant}
                        disabled={isWatering || wateringSuccess}
                      >
                        {isWatering ? (
                          <>
                            <ActivityIndicator size="small" color="#FFFFFF" />
                            <Text style={styles.actionButtonTextBlue}>
                              Watering...
                            </Text>
                          </>
                        ) : wateringSuccess ? (
                          <>
                            <Feather
                              name="check-circle"
                              size={20}
                              color="#FFFFFF"
                            />
                            <Text style={styles.actionButtonTextBlue}>
                              Plant Watered! 💧
                            </Text>
                          </>
                        ) : (
                          <>
                            <Feather name="droplet" size={20} color="#FFFFFF" />
                            <Text style={styles.actionButtonTextBlue}>
                              Water Now
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </BlurView>
            </Animated.View>
          </GestureDetector>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
  imageContainer: {
    position: "absolute",
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT * 3,
    left: 0,
    top: 0,
  },
  mapGrid: {
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT * 3,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridTile: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  edgeBlendTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  edgeBlendBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  edgeBlendLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 40,
  },
  edgeBlendRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 40,
  },
  backgroundImage: {
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT * 3,
  },
  pinpoint: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  pinpointCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  pinpointEmoji: {
    fontSize: 22,
    textAlign: "center",
  },
  attentionDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF5252",
    borderWidth: 2,
    borderColor: "white",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalWrapper: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  blurContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: "#2D4A3E",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    minHeight: SCREEN_HEIGHT * 0.7,
  },
  modalHandle: {
    width: 48,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 24,
  },
  modalHeader: {
    marginBottom: 28,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  plantEmoji: {
    fontSize: 56,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  speciesSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    fontStyle: "italic",
  },
  statusBadge: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modalBody: {
    gap: 14,
    paddingBottom: 20,
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  cardTextContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cardValueSmall: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
  },
  halfCard: {
    flex: 1,
  },
  descriptionCard: {
    backgroundColor: "rgba(129, 199, 132, 0.12)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(129, 199, 132, 0.2)",
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#81C784",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  descriptionText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: "#1976D2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 12,
    gap: 12,
  },
  actionButtonWatering: {
    backgroundColor: "#0D47A1",
    opacity: 1,
  },
  actionButtonSuccess: {
    backgroundColor: "#1976D2",
  },
  actionButtonTextBlue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});

export default HomeExplorerView;

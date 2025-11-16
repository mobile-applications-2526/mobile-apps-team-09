import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import PlantService from "@/services/PlantService";

export default function SuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    plantId: string;
    plantName: string;
    imageUri?: string;
  }>();

  const [plantImage, setPlantImage] = useState<string | null>(null);

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const imageOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate checkmark with continuous pulsing
    scale.value = withRepeat(
      withSequence(
        withSpring(1, {
          damping: 15,
          stiffness: 100,
        }),
        withSpring(1.1, {
          damping: 15,
          stiffness: 100,
        }),
        withSpring(1, {
          damping: 15,
          stiffness: 100,
        })
      ),
      -1, // Repeat indefinitely
      false
    );
    opacity.value = withTiming(1, { duration: 300 });

    // Fetch plant data to get the uploaded image URL
    const fetchPlantImage = async () => {
      try {
        if (params.plantId) {
          const plant = await PlantService.getPlantById(
            parseInt(params.plantId)
          );
          if (plant.image_url) {
            setPlantImage(plant.image_url);
            // Delay image animation
            setTimeout(() => {
              imageOpacity.value = withTiming(1, { duration: 500 });
            }, 300);
          }
        }
      } catch (error) {
        console.error("Error fetching plant image:", error);
      }
    };

    fetchPlantImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  const handleViewGarden = () => {
    router.replace("/(tabs)/garden");
  };

  const handleGoHome = () => {
    router.replace("/(tabs)/overview");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Success Checkmark - positioned at top: 177px from design */}
      <View style={styles.checkmarkWrapper}>
        <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
          <View style={styles.checkmarkCircle}>
            <Ionicons
              name="checkmark-circle-outline"
              size={80}
              color="#FFFFFF"
              style={{ fontWeight: "600" }}
            />
          </View>
        </Animated.View>
      </View>

      {/* Title and Subtitle - positioned at top: 337px from design */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Plant Added Successfully!</Text>
        <Text style={styles.subtitle}>
          {params.plantName} has been added to your garden
        </Text>
      </View>

      {/* Plant Image - positioned at top: 436.99px from design */}
      <Animated.View style={[styles.imageContainer, imageStyle]}>
        {plantImage ? (
          <Image
            source={{ uri: plantImage }}
            style={styles.plantImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="leaf" size={80} color="#4CAF50" />
          </View>
        )}
      </Animated.View>

      {/* Action Buttons - positioned at top: 676.99px from design */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleViewGarden}
          activeOpacity={0.8}
        >
          <Ionicons name="leaf-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>View My Garden</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleGoHome}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={20} color="#1B5E20" />
          <Text style={styles.secondaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2EFDA",
  },
  checkmarkWrapper: {
    position: "absolute",
    top: 95,
    left: "50%",
    marginLeft: -64,
    width: 128,
    height: 128,
  },
  checkmarkContainer: {
    width: 128,
    height: 128,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  checkmarkCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
  },
  textContainer: {
    position: "absolute",
    top: 265,
    left: 56,
    right: 56,
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#1B5E20",
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: 0.07,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#558B2F",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: -0.3125,
    opacity: 0.8,
    width: 283,
  },
  imageContainer: {
    position: "absolute",
    top: 362,
    left: 25,
    right: 25,
    height: 322,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
  plantImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 25,
    right: 25,
    gap: 16,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    height: 56,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    gap: 8,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 57,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#FFFFFF",
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#1B5E20",
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
});

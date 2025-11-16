import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { LoadingScreen } from "@/components/add-plant/LoadingScreen";
import { ErrorScreen } from "@/components/add-plant/ErrorScreen";
import PlantService from "@/services/PlantService";
import { Ionicons } from "@expo/vector-icons";

export default function IdentifyingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ imageUri: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    identifyPlant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const identifyPlant = async () => {
    try {
      setError(null);
      const result = await PlantService.identifyPlant(params.imageUri);

      // Navigate to add details screen with plant info
      router.replace({
        // @ts-ignore - Expo Router dynamic route
        pathname: "/add-plant/add-details",
        params: {
          imageUri: params.imageUri,
          scientificName: result.scientific_name,
          commonName: result.common_name,
          speciesId: result.species_id.toString(),
        },
      });
    } catch (error: any) {
      console.error("Error identifying plant:", error);
      setError(error.message || "Failed to identify plant. Please try again.");
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#FFEBEE" />
        <ErrorScreen
          imageUri={params.imageUri}
          title="Identification Failed"
          subtitle={error}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={identifyPlant}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back-outline" size={20} color="#C62828" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#D2EFDA" />
      <LoadingScreen
        imageUri={params.imageUri}
        title="AI is Identifying..."
        subtitle="Analyzing your plant"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2EFDA", // Light green background to match Figma
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#FFEBEE", // Light red background for error state
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 25,
    right: 25,
    gap: 16,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF5350",
    height: 56,
    borderRadius: 16,
    gap: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#EF5350",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C62828",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ChoosePhotoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "denied") {
      Alert.alert(
        "Camera Permission Required",
        "Camera access is needed to take photos. Please enable it in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    return status === "granted";
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "denied") {
      Alert.alert(
        "Media Library Permission Required",
        "Photo library access is needed to upload photos. Please enable it in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    return status === "granted";
  };

  const handleTakePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();

      if (!hasPermission) {
        return;
      }

      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      setIsLoading(false);

      if (!result.canceled && result.assets[0]) {
        router.push({
          // @ts-ignore - Expo Router dynamic route
          pathname: "/add-plant/photo-preview",
          params: {
            imageUri: result.assets[0].uri,
            source: "camera",
          },
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const hasPermission = await requestMediaLibraryPermission();

      if (!hasPermission) {
        return;
      }

      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      setIsLoading(false);

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const uri = asset.uri;

        // Validate file type from URI extension
        const fileExtension = uri.split(".").pop()?.toLowerCase();
        if (
          fileExtension &&
          !["jpg", "jpeg", "png", "webp"].includes(fileExtension)
        ) {
          Alert.alert(
            "Invalid File Type",
            "Only PNG, JPEG, and WebP images are allowed. Please select a valid image.",
            [{ text: "OK" }]
          );
          return;
        }

        router.push({
          // @ts-ignore - Expo Router dynamic route
          pathname: "/add-plant/photo-preview",
          params: {
            imageUri: uri,
            source: "gallery",
          },
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error choosing photo:", error);
      Alert.alert("Error", "Failed to choose photo. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.cardWhite} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Add Plant Photo</Text>
          <Text style={styles.headerSubtitle}>
            Choose how to add your plant
          </Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Photo Card */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleChoosePhoto}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"]}
            style={styles.iconGradient}
          >
            <Ionicons name="cloud-upload" size={40} color={COLORS.cardWhite} />
          </LinearGradient>
          <Text style={styles.cardTitle}>Upload Photo</Text>
          <Text style={styles.cardDescription}>
            Choose an existing photo from your gallery
          </Text>
        </TouchableOpacity>

        {/* Take Photo Card */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleTakePhoto}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#42A5F5", "#1E88E5"]}
            style={styles.iconGradient}
          >
            <Ionicons name="camera" size={40} color={COLORS.cardWhite} />
          </LinearGradient>
          <Text style={styles.cardTitle}>Take Photo</Text>
          <Text style={styles.cardDescription}>
            Use your camera to capture a new photo
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2EFDA", // Light green background from Figma
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardWhite,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#558B2F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 44,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
    marginLeft: -22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 40,
    gap: 24,
  },
  optionCard: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: 14,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { PhotoPreviewButton } from "@/components/add-plant/PhotoPreviewButton";

export default function PhotoPreviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ imageUri: string; source: string }>();
  const [imageUri, setImageUri] = useState(params.imageUri);
  const isFromCamera = params.source === "camera";

  const handleRetake = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error retaking photo:", error);
      Alert.alert("Error", "Failed to retake photo. Please try again.");
    }
  };

  const handleChooseAnother = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error choosing photo:", error);
      Alert.alert("Error", "Failed to choose photo. Please try again.");
    }
  };

  const handleContinue = () => {
    router.push({
      // @ts-ignore - Expo Router dynamic route
      pathname: "/add-plant/identifying",
      params: { imageUri },
    });
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
          <Text style={styles.headerTitle}>Photo Preview</Text>
          <Text style={styles.headerSubtitle}>Review your photo</Text>
        </View>
      </View>

      {/* Photo Preview */}
      <View style={styles.content}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <PhotoPreviewButton
            title="Continue with This Photo"
            onPress={handleContinue}
            icon="checkmark"
            variant="primary"
          />

          <PhotoPreviewButton
            title={isFromCamera ? "Retake Photo" : "Choose Another Photo"}
            onPress={isFromCamera ? handleRetake : handleChooseAnother}
            icon={isFromCamera ? "refresh" : "cloud-upload-outline"}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2EFDA", // Light green background
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardWhite,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 85,
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
    paddingLeft: 48,
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
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  previewContainer: {
    width: "100%",
    height: 345,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: COLORS.cardWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
    marginBottom: 85,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  buttonContainer: {
    gap: 16,
  },
});

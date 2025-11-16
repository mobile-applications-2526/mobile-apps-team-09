import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import PlantService from "@/services/PlantService";
import { Ionicons } from "@expo/vector-icons";
import { HeaderCard } from "@/components/add-plant/HeaderCard";
import { PlantPhotoCard } from "@/components/add-plant/PlantPhotoCard";
import { AIIdentifiedCard } from "@/components/add-plant/AIIdentifiedCard";
import { InfoCard } from "@/components/add-plant/InfoCard";
import { FormInput } from "@/components/add-plant/FormInput";
import { DatePicker } from "@/components/add-plant/DatePicker";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function AddDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    imageUri: string;
    scientificName: string;
    commonName: string;
    speciesId: string;
  }>();

  const [plantName, setPlantName] = useState("");
  const [location, setLocation] = useState("");
  const [lastWatered, setLastWatered] = useState(new Date());
  const [acquiredDate, setAcquiredDate] = useState(new Date());
  const [showWateredPicker, setShowWateredPicker] = useState(false);
  const [showAcquiredPicker, setShowAcquiredPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempLastWatered, setTempLastWatered] = useState(new Date());
  const [tempAcquiredDate, setTempAcquiredDate] = useState(new Date());
  const scrollViewRef = useRef<ScrollView>(null);

  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isSubmitting) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1
      );
    } else {
      rotation.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleSubmit = async () => {
    // Validation
    if (!plantName.trim()) {
      Alert.alert("Required Field", "Please enter a nickname for your plant");
      return;
    }

    if (!location.trim()) {
      Alert.alert("Required Field", "Please enter the plant's location");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the plant
      const plant = await PlantService.createPlant({
        species_id: parseInt(params.speciesId),
        plant_name: plantName.trim(),
        location: location.trim(),
        last_watered: lastWatered.toISOString(),
        acquired_date: acquiredDate.toISOString(),
      });

      // Upload the image
      await PlantService.uploadPlantImage(plant.id, params.imageUri);

      // Navigate to success screen
      router.replace({
        // @ts-ignore - Expo Router dynamic route
        pathname: "/add-plant/success",
        params: {
          plantId: plant.id.toString(),
          plantName: plant.plant_name,
          imageUri: params.imageUri,
        },
      });
    } catch (error: any) {
      console.error("Error creating plant:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to add plant. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#D2EFDA" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
      >
        <View style={{ paddingTop: insets.top }}>
          <HeaderCard
            title="Add Plant Details"
            subtitle="Fill in the information"
            onBackPress={() => router.back()}
          />
        </View>

        <View style={styles.scrollContent}>
          <PlantPhotoCard imageUri={params.imageUri} />

          <AIIdentifiedCard>
            <FormInput
              label="Scientific Name"
              value={params.scientificName}
              placeholder=""
              locked
            />

            <FormInput
              label="Common Name"
              value={params.commonName}
              placeholder=""
              locked
            />

            <FormInput
              label="Plant Nickname"
              value={plantName}
              onChangeText={setPlantName}
              placeholder="Give your plant a nickname"
              maxLength={50}
            />
          </AIIdentifiedCard>

          <InfoCard title="Additional Information">
            <DatePicker
              label="Last Watered"
              value={lastWatered}
              onPress={() => {
                setTempLastWatered(lastWatered);
                setShowWateredPicker(true);
              }}
              icon="water-outline"
              iconColor="#1B5E20"
              required
            />

            <FormInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., Living room, Balcony"
              icon="location-outline"
              iconColor="#1B5E20"
              maxLength={100}
            />

            <DatePicker
              label="Acquired Date"
              value={acquiredDate}
              onPress={() => {
                setTempAcquiredDate(acquiredDate);
                setShowAcquiredPicker(true);
              }}
              icon="calendar-outline"
              iconColor="#FFA726"
            />
          </InfoCard>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Animated.View style={animatedIconStyle}>
              <Ionicons name="leaf-outline" size={20} color={COLORS.cardWhite} />
            </Animated.View>
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Adding Plant..." : "Add Plant to Garden"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showWateredPicker && (
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity
                onPress={() => {
                  setShowWateredPicker(false);
                }}
              >
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.pickerTitle}>Last Watered</Text>
              <TouchableOpacity
                onPress={() => {
                  setLastWatered(tempLastWatered);
                  setShowWateredPicker(false);
                }}
              >
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempLastWatered}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setTempLastWatered(selectedDate);
                }
              }}
              maximumDate={new Date()}
              themeVariant="light"
              style={styles.datePicker}
            />
          </View>
        )}

        {showAcquiredPicker && (
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity
                onPress={() => {
                  setShowAcquiredPicker(false);
                }}
              >
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.pickerTitle}>Acquired Date</Text>
              <TouchableOpacity
                onPress={() => {
                  setAcquiredDate(tempAcquiredDate);
                  setShowAcquiredPicker(false);
                }}
              >
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempAcquiredDate}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setTempAcquiredDate(selectedDate);
                }
              }}
              maximumDate={new Date()}
              themeVariant="light"
              style={styles.datePicker}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2EFDA", // Light green background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 24,
    paddingVertical: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.cardWhite,
  },
  datePickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  cancelButton: {
    fontSize: 16,
    color: "#007AFF",
  },
  doneButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  datePicker: {
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
});

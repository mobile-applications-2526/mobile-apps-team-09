import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { createProfile } from "@/services/ProfileService";
import { getCurrentUserId } from "@/services/UserService";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  // Form state
  const [tagline, setTagline] = useState("");
  const [age, setAge] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [experienceStartDate, setExperienceStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleSubmit = async () => {
    // Validation
    if (!tagline.trim()) {
      Alert.alert("Required Field", "Please enter a tagline");
      return;
    }

    if (!age.trim()) {
      Alert.alert("Required Field", "Please enter your age");
      return;
    }

    if (!livingSituation.trim()) {
      Alert.alert("Required Field", "Please enter your living situation");
      return;
    }

    if (!experienceLevel.trim()) {
      Alert.alert("Required Field", "Please select your experience level");
      return;
    }

    try {
      setLoading(true);

      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error("No user ID found. Please login again.");
      }

      const profileData = {
        tagline: tagline.trim(),
        age: parseInt(age, 10),
        living_situation: livingSituation.trim(),
        experience_level: experienceLevel.trim(),
        experience_start_date: experienceStartDate.toISOString().split('T')[0], // Send only date part YYYY-MM-DD
      };

      await createProfile(userId, profileData);

      Alert.alert("Success", "Profile created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/profile"),
        },
      ]);
    } catch (error: any) {
      console.error("Error creating profile:", error);
      Alert.alert("Error", error.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingTop: insets.top }}>
          {/* Header Card */}
          <View style={styles.headerCard}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.cardWhite} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Create Your Profile</Text>
              <Text style={styles.headerSubtitle}>Tell us about yourself</Text>
            </View>
          </View>

          {/* Profile Icon Card */}
          <View style={styles.iconCard}>
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"]}
              style={styles.iconGradient}
            >
              <Ionicons name="person" size={48} color={COLORS.cardWhite} />
            </LinearGradient>
            <Text style={styles.welcomeText}>Welcome to PlantSense!</Text>
            <Text style={styles.welcomeSubtext}>
              Let's set up your profile to personalize your plant care journey
            </Text>
          </View>
        </View>

        <View style={styles.scrollContent}>
          {/* Basic Information Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="sparkles-outline"
                  size={16}
                  color="#1B5E20"
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.label}>Tagline <Text style={styles.required}>*</Text></Text>
              </View>
              <TextInput
                style={styles.input}
                value={tagline}
                onChangeText={setTagline}
                placeholder="e.g., Plant Enthusiast 🌱"
                placeholderTextColor="#717182"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="#1B5E20"
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.label}>Age <Text style={styles.required}>*</Text></Text>
              </View>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                placeholderTextColor="#717182"
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Living Situation Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Living Situation</Text>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="home-outline"
                  size={16}
                  color="#1B5E20"
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.label}>Where do you live? <Text style={styles.required}>*</Text></Text>
              </View>
              <TextInput
                style={styles.input}
                value={livingSituation}
                onChangeText={setLivingSituation}
                placeholder="e.g., Apartment with Balcony, House with Garden"
                placeholderTextColor="#717182"
              />
            </View>
          </View>

          {/* Plant Experience Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Plant Experience</Text>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="leaf-outline"
                  size={16}
                  color="#1B5E20"
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.label}>Experience Level <Text style={styles.required}>*</Text></Text>
              </View>
              <View style={styles.chipContainer}>
                {["Beginner", "Intermediate", "Expert"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.chip,
                      experienceLevel === level && styles.chipSelected,
                    ]}
                    onPress={() => setExperienceLevel(level)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        experienceLevel === level && styles.chipTextSelected,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color="#1B5E20"
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.label}>When did you start? <Text style={styles.required}>*</Text></Text>
              </View>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => {
                  setTempDate(experienceStartDate);
                  setShowDatePicker(true);
                }}
              >
                <Text style={styles.datePickerText}>
                  {experienceStartDate.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#1B5E20" />
              </TouchableOpacity>
              <Text style={styles.helperText}>
                Select when you started your plant journey
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <View style={styles.submitIconContainer}>
                  <LinearGradient
                    colors={["#81C784", "#66BB6A", "#4CAF50"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.submitIconGradient}
                  >
                    <Ionicons name="person-add" size={22} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <Text style={styles.submitButtonText}>Create My Profile</Text>
                <Ionicons name="arrow-forward-circle" size={24} color="rgba(255, 255, 255, 0.9)" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.pickerTitle}>Experience Start Date</Text>
              <TouchableOpacity
                onPress={() => {
                  setExperienceStartDate(tempDate);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setTempDate(selectedDate);
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
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardWhite,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 18,
    paddingVertical: 26,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    paddingLeft: 38,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#1B5E20",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
    marginLeft: 14,
  },
  iconCard: {
    backgroundColor: COLORS.cardWhite,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "#558B2F",
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1B5E20",
    opacity: 0.6,
    marginLeft: 8,
  },
  required: {
    color: COLORS.urgentRed,
  },
  input: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#1B5E20",
    height: 36,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  chipSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#558B2F",
  },
  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  helperText: {
    fontSize: 12,
    color: "#558B2F",
    opacity: 0.5,
    marginTop: 4,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitIconContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 20,
  },
  submitIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.cardWhite,
    flex: 1,
    textAlign: "center",
  },
  datePickerButton: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerText: {
    fontSize: 16,
    color: "#1B5E20",
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

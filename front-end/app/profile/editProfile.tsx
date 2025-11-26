import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    Text,
    Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";
import { getCurrentUserId } from "@/services/UserService";
import { getProfileByUserId, ProfileBackendResponse, updateProfile } from "@/services/ProfileService";
import { FormInput } from "@/components/add-plant/FormInput";
import * as SecureStore from "expo-secure-store";
import { EditProfileAndSettingsHeader } from "@/components/profile/EditProfileAndSettingsHeader";

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<ProfileBackendResponse>()

    const [tagline, setTagline] = useState("");
    const [age, setAge] = useState("");
    const [livingSituation, setLivingSituation] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");

    const [originalValues, setOriginalValues] = useState({
        tagline: "",
        age: "",
        livingSituation: "",
        experienceLevel: "",
        city: "",
        country: "",
    });

    const hasUnsavedChanges = () => {
        return (
            tagline !== originalValues.tagline ||
            age !== originalValues.age ||
            livingSituation !== originalValues.livingSituation ||
            experienceLevel !== originalValues.experienceLevel ||
            city !== originalValues.city ||
            country !== originalValues.country
        );
    };

    useEffect(() => {
        const fetchUser = async () => {
            const currentUserId = await getCurrentUserId();
            if (!currentUserId) return;

            const userInfoResponse = await getProfileByUserId(currentUserId);

            if (userInfoResponse) {
                setUserInfo(userInfoResponse);
                const initialTagline = userInfoResponse.tagline || "";
                const initialAge = userInfoResponse.age?.toString() || "";
                const initialLivingSituation = userInfoResponse.living_situation || "";
                const initialExperienceLevel = userInfoResponse.experience_level || "";
                const initialCity = userInfoResponse.city || "";
                const initialCountry = userInfoResponse.country || "";

                setTagline(initialTagline);
                setAge(initialAge);
                setLivingSituation(initialLivingSituation);
                setExperienceLevel(initialExperienceLevel);
                setCity(initialCity);
                setCountry(initialCountry);

                setOriginalValues({
                    tagline: initialTagline,
                    age: initialAge,
                    livingSituation: initialLivingSituation,
                    experienceLevel: initialExperienceLevel,
                    city: initialCity,
                    country: initialCountry,
                });
            }
        };

        fetchUser();
    }, []);

    const handleBackPress = () => {
        if (hasUnsavedChanges()) {
            Alert.alert(
                "Unsaved Changes",
                "You have unsaved changes. Are you sure you want to go back?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Discard",
                        style: "destructive",
                        onPress: () => router.back(),
                    },
                ],
                { cancelable: true }
            );
        } else {
            router.back();
        }
    };

    const saveChanges = async () => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                Alert.alert("Error", "User not found. Please login again.");
                return;
            }

            const profileData = {
                tagline: tagline.trim() || undefined,
                age: age ? parseInt(age, 10) : undefined,
                living_situation: livingSituation.trim() || undefined,
                experience_level: experienceLevel.trim() || undefined,
                city: city.trim() || undefined,
                country: country.trim() || undefined,
            };

            await updateProfile(userId, profileData);

            Alert.alert("Success", "Profile updated successfully!");
            router.back();
        } catch (error: any) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", error.message || "Failed to update profile");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View style={[styles.mainContainer, { paddingTop: insets.top + 10 }]}>
                <EditProfileAndSettingsHeader title="Edit Profile" onBackPress={handleBackPress}/>

                {userInfo ? (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FormInput
                            label="Tagline"
                            value={tagline}
                            onChangeText={setTagline}
                            placeholder="Enter your tagline"
                        />

                        <FormInput
                            label="Age"
                            value={age}
                            onChangeText={setAge}
                            placeholder="Enter your age"
                        />

                        <FormInput
                            label="Living Situation"
                            value={livingSituation}
                            onChangeText={setLivingSituation}
                            placeholder="Enter your living situation"
                        />

                        <Text style={styles.label}>Experience Level</Text>
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
                        <FormInput
                            label="City"
                            value={city}
                            onChangeText={setCity}
                            placeholder="Enter your city"
                        />

                        <FormInput
                            label="Country"
                            value={country}
                            onChangeText={setCountry}
                            placeholder="Enter your country"
                        />

                        {/* Add save button */}
                        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                ) : (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading user info...</Text>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 20,
    },
    scrollView: {
        flex: 1,
        marginTop: 20,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    loadingText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    saveButton: {
        backgroundColor: COLORS.primaryGreen,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 4,
        marginTop: 4,
    },
    chip: {
        paddingHorizontal: 20,
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
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1B5E20",
        opacity: 0.6,
        marginBottom: 2,
    },
});
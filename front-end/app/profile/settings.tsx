import { EditProfileAndSettingsHeader } from "@/components/profile/EditProfileAndSettingsHeader";
import { COLORS } from "@/constants/colors";
import { getCurrentUserId, getCurrentUserInfo, updateUserInfo } from "@/services/UserService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View, StyleSheet, Text, Alert, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User } from "@/types/user";
import { FormInput } from "@/components/add-plant/FormInput";
import { LoginInput } from "@/components/auth/LoginInput";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<User>();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [originalValues, setOriginalValues] = useState({
        email: "",
        username: "",
        fullName: "",
    });

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

    const hasUnsavedChanges = () => {
        return (
            email !== originalValues.email ||
            username !== originalValues.username ||
            fullName !== originalValues.fullName ||
            password.trim().length > 0
        );
    };



    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = await getCurrentUserId();
                if (!userId) {
                    Alert.alert("Error", "User not found. Please login again.");
                    router.back();
                    return;
                }

                const user = await getCurrentUserInfo(userId);
                if (user) {
                    setUserInfo(user);

                    // Populate form fields
                    const initialEmail = user.email || "";
                    const initialUsername = user.username || "";
                    const initialFullName = user.full_name || "";

                    setEmail(initialEmail);
                    setUsername(initialUsername);
                    setFullName(initialFullName);

                    setOriginalValues({
                        email: initialEmail,
                        username: initialUsername,
                        fullName: initialFullName,
                    });
                }
            } catch (error: any) {
                console.error("Error fetching user info:", error);
                Alert.alert("Error", "Failed to load user information");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    const validateInputs = (): string | null => {
        if (email && !email.includes("@")) {
            return "Please enter a valid email address";
        }

        if (username && username.length < 3) {
            return "Username must be at least 3 characters";
        }

        if (password && password.length > 0 && password.length < 8) {
            return "Password must be at least 8 characters";
        }

        if (password !== repeatPassword) {
            return "Passwords do not match";
        }

        return null;
    };

    const saveChanges = async () => {
        try {
            // Validate inputs
            const validationError = validateInputs();
            if (validationError) {
                Alert.alert("Validation Error", validationError);
                return;
            }

            const userId = await getCurrentUserId();
            if (!userId) {
                Alert.alert("Error", "User not found. Please login again.");
                return;
            }

            const updates: any = {};
            if (email !== originalValues.email) updates.email = email.trim();
            if (username !== originalValues.username) updates.username = username.trim();
            if (fullName !== originalValues.fullName) updates.full_name = fullName.trim();
            if (password.trim()) updates.password = password.trim();

            if (Object.keys(updates).length === 0) {
                Alert.alert("No Changes", "No changes were made to your settings.");
                return;
            }

            console.log('Attempting to update user with:', updates);
            const updatedUser = await updateUserInfo(userId, updates);
            console.log('Update successful:', updatedUser);

            if (updatedUser) {
                setUserInfo(updatedUser);
                setEmail(updatedUser.email);
                setUsername(updatedUser.username);
                setFullName(updatedUser.full_name || "");

                setOriginalValues({
                    email: updatedUser.email,
                    username: updatedUser.username,
                    fullName: updatedUser.full_name || "",
                });
            } else {
                setOriginalValues({
                    email: email,
                    username: username,
                    fullName: fullName,
                });
            }
            setPassword("");
            setRepeatPassword("");
            router.back()

            Alert.alert("Success", "Settings updated successfully!");
        } catch (error: any) {
            console.error("Error updating settings:", error);
            Alert.alert("Error", error.message || "Failed to update settings");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View style={[styles.mainContainer, { paddingTop: insets.top + 10 }]}>
                <EditProfileAndSettingsHeader onBackPress={handleBackPress} title="Settings" />
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading user info...</Text>
                    </View>
                ) : userInfo ? (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FormInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                        />

                        <FormInput
                            label="Full name"
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your full name"
                        />

                        <FormInput
                            label="Username"
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter your username"
                        />

                        <PasswordInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder=""
                            secureTextEntry
                        />

                        <PasswordInput
                            label="Re-password"
                            value={repeatPassword}
                            onChangeText={setRepeatPassword}
                            placeholder=""
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                !hasUnsavedChanges() && styles.saveButtonDisabled
                            ]}
                            onPress={saveChanges}
                            disabled={!hasUnsavedChanges()}
                        >
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                ) : (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Failed to load user info</Text>
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
    scrollView: {
        flex: 1,
        marginTop: 20,
    },
    scrollContent: {
        paddingBottom: 40,
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
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1B5E20",
        opacity: 0.6,
        marginBottom: 2,
    },
    saveButtonDisabled: {
        backgroundColor: COLORS.textSecondary,
        opacity: 0.5,
    },
})
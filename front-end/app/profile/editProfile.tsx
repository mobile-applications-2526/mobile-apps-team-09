import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    Text
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";
import { EditProfileHeader } from "@/components/profile/EditProfileHeader";
import { getCurrentUserId } from "@/services/UserService";
import { getProfileByUserId, ProfileBackendResponse } from "@/services/ProfileService";
import { UserProfileData } from "@/types/profile";

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<ProfileBackendResponse>()

    useEffect(() => {
        const fetchUser = async () => {
            const currentUserId = await getCurrentUserId();
            if (!currentUserId) return;

            const userInfoResponse = await getProfileByUserId(currentUserId);

            if (userInfoResponse) {
                setUserInfo(userInfoResponse);
            }

        };

        fetchUser();
    }, []);




    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#D2EFDA" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View style={[styles.mainContainer, { paddingTop: insets.top + 10 }]}>
                <EditProfileHeader />

                {userInfo ? (
                    <ScrollView style={{ marginTop: 20 }}>
                        <Text style={styles.label}>Tagline:</Text>
                        <Text style={styles.value}>{userInfo.tagline}</Text>

                        <Text style={styles.label}>Experienve Level:</Text>
                        <Text style={styles.value}>{userInfo.experience_level}</Text>

                        <Text style={styles.label}>Living Situation</Text>
                        <Text style={styles.value}>{userInfo.living_situation}</Text>

                        <Text style={styles.label}>Experience Level Start Date</Text>
                        <Text style={styles.value}>{userInfo.experience_start_date}</Text>

                        <Text style={styles.label}>City</Text>
                        <Text style={styles.value}>{userInfo.city}</Text>

                        <Text style={styles.label}>Country</Text>
                        <Text style={styles.value}>{userInfo.country}</Text>

                    </ScrollView>
                ) : (
                    <Text style={{ marginTop: 20 }}>Loading user info...</Text>
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
    label: {
        fontWeight: "bold",
        marginTop: 10,
    },
    value: {
        marginLeft: 5,
        fontSize: 16,
    },
});

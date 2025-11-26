import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { getCurrentUserId, getCurrentUserInfo } from "@/services/UserService";

interface EditProfileAndSettingsHeaderProps {
    title: string;
    onBackPress?: () => void;
}

export function EditProfileAndSettingsHeader({ title, onBackPress }: EditProfileAndSettingsHeaderProps) {
    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
                onPress={onBackPress}
                style={{ paddingRight: 10 }}
            >
                <Ionicons name="chevron-back" size={28} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>{title}</Text>
        </View>
    );
}
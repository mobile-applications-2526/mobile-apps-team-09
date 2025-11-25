import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EditProfileHeaderProps {
    onBackPress?: () => void;
}

export function EditProfileHeader({ onBackPress }: EditProfileHeaderProps) {
    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
                onPress={onBackPress}
                style={{ paddingRight: 10 }}
            >
                <Ionicons name="chevron-back" size={28} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>Edit Profile</Text>
        </View>
    );
}
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function EditProfileHeader() {
    const router = useRouter();

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 10 }}>
                <Ionicons name="chevron-back" size={28} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>Edit Profile</Text>
        </View>
    );
}

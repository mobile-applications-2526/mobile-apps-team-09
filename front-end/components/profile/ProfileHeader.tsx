import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface ProfileHeaderProps {
  fullName: string;
  subtitle: string;
  isActive: boolean;
  initials: string;
  onSettingsPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  subtitle,
  isActive,
  initials,
  onSettingsPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
        <Ionicons
          name="settings-outline"
          size={24}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1B5E20",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2D5F2E",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  settingsButton: {
    padding: 8,
  },
});

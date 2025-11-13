import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";
import { getInitials } from "@/utils/plantHelpers";

interface UserHeaderProps {
  fullName: string | null;
  username: string;
  plantCount: number;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  fullName,
  username,
  plantCount,
}) => {
  return (
    <View style={styles.userHeader}>
      <View style={styles.userInfo}>
        <View style={styles.profileImage}>
          <Text style={styles.profileInitials}>
            {getInitials(fullName || username)}
          </Text>
        </View>
        <View style={styles.userTextContainer}>
          <Text style={styles.greetingText}>Hi, {fullName || username}!</Text>
          <Text style={styles.subGreeting}>
            {plantCount} {plantCount === 1 ? "plant" : "plants"} in your garden
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

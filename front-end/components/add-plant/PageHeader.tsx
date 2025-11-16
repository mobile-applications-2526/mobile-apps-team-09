import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface PageHeaderProps {
  title: string;
  onBackPress?: () => void;
  showBack?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBackPress,
  showBack = true,
}) => {
  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
});

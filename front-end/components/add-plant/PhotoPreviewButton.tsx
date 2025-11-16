import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface PhotoPreviewButtonProps {
  title: string;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  variant: "primary" | "secondary";
  disabled?: boolean;
}

export const PhotoPreviewButton: React.FC<PhotoPreviewButtonProps> = ({
  title,
  onPress,
  icon,
  variant,
  disabled = false,
}) => {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={isPrimary ? 24 : 20}
        color={isPrimary ? COLORS.cardWhite : "#1B5E20"}
      />
      <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 20,
  },
  primaryButton: {
    backgroundColor: "#558B2F",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: COLORS.cardWhite,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#558B2F",
  },
  primaryText: {
    fontSize: 18,
    fontWeight: "400",
    color: COLORS.cardWhite,
  },
  secondaryText: {
    fontSize: 18,
    fontWeight: "400",
    color: "#1B5E20",
  },
  disabled: {
    opacity: 0.5,
  },
});

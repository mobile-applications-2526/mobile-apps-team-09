import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  icon,
  iconPosition = "left",
  disabled = false,
}) => {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon && iconPosition === "left" && (
        <Ionicons
          name={icon}
          size={24}
          color={isPrimary ? COLORS.cardWhite : COLORS.primaryGreen}
          style={styles.iconLeft}
        />
      )}
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
      {icon && iconPosition === "right" && (
        <Ionicons
          name={icon}
          size={24}
          color={isPrimary ? COLORS.cardWhite : COLORS.primaryGreen}
          style={styles.iconRight}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryGreen,
  },
  secondaryButton: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 2,
    borderColor: COLORS.primaryGreen,
  },
  disabledButton: {
    backgroundColor: COLORS.textSecondary,
    borderWidth: 0,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  primaryText: {
    color: COLORS.cardWhite,
  },
  secondaryText: {
    color: COLORS.primaryGreen,
  },
  iconLeft: {
    marginRight: 12,
  },
  iconRight: {
    marginLeft: 12,
  },
});

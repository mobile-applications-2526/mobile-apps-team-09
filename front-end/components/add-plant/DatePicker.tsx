import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface DatePickerProps {
  label: string;
  value: Date;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onPress,
  icon,
  iconColor = "#1B5E20",
  required = false,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Ionicons
          name={icon}
          size={16}
          color={iconColor}
          style={{ opacity: 0.6 }}
        />
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.dateText}>{formatDate(value)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1B5E20",
  },
  required: {
    color: COLORS.urgentRed,
  },
  button: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#1B5E20",
    fontWeight: "500",
  },
});

import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface FormInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  required?: boolean;
  maxLength?: number;
  locked?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  iconColor = "#1B5E20",
  required = false,
  maxLength,
  locked = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {icon && (
          <Ionicons
            name={icon}
            size={16}
            color={iconColor}
            style={{ opacity: 0.6 }}
          />
        )}
        <Text style={[styles.label, icon && { marginLeft: 8 }]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      {locked ? (
        <View style={styles.lockedInput}>
          <Text style={styles.lockedInputText}>{value}</Text>
        </View>
      ) : (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#717182"
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
        />
      )}
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
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1B5E20",
    opacity: 0.6,
  },
  required: {
    color: COLORS.urgentRed,
  },
  input: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#1B5E20",
    height: 36,
  },
  lockedInput: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    opacity: 0.5,
  },
  lockedInputText: {
    fontSize: 16,
    color: "#1B5E20",
  },
});

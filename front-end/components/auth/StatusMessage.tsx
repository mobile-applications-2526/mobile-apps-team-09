import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/constants/theme";

interface StatusMessageProps {
  message: string;
  type: "error" | "success";
  visible: boolean;
}

export function StatusMessage({ message, type, visible }: StatusMessageProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) {
    return null;
  }

  const textColor = type === "error" ? "#DC2626" : "#059669";
  const iconName = type === "error" ? "alert-circle" : "checkmark-circle";
  const iconColor = type === "error" ? "#DC2626" : "#059669";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Ionicons name={iconName} size={20} color={iconColor} />
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: "800",
  },
});

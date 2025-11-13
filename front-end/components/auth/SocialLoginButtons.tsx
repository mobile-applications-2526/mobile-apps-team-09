import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onFacebookPress: () => void;
}

export function SocialLoginButtons({
  onGooglePress,
  onFacebookPress,
}: SocialLoginButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onGooglePress}>
        <Ionicons name="logo-google" size={24} color="#DB4437" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onFacebookPress}>
        <Ionicons name="logo-facebook" size={24} color="#1877F2" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginVertical: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
});

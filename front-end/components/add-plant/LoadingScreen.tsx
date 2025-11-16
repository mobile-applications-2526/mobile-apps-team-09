import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface LoadingScreenProps {
  imageUri: string;
  title?: string;
  subtitle?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  imageUri,
  title = "AI is Identifying...",
  subtitle = "Analyzing your plant",
}) => {
  // Animated dots
  const dot1Opacity = useRef(new Animated.Value(0.5)).current;
  const dot2Opacity = useRef(new Animated.Value(0.5)).current;
  const dot3Opacity = useRef(new Animated.Value(0.5)).current;

  // Spinning animation for the icon
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Dot animation sequence
    const animateDots = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(dot1Opacity, {
              toValue: 0.5,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Opacity, {
              toValue: 0.5,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Opacity, {
              toValue: 0.5,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    // Spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    animateDots();
  }, [dot1Opacity, dot2Opacity, dot3Opacity, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Plant Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.plantImage} />
      </View>

      {/* Circular Icon with Leaf */}
      <View style={styles.iconCircle}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="leaf" size={24} color="#FDD835" />
        </Animated.View>
      </View>

      {/* Text */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Animated Dots */}
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: 345,
    height: 345,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: COLORS.cardWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
    marginBottom: 32,
  },
  plantImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#1B5E20",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 32,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
});

import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";

interface ErrorScreenProps {
  imageUri?: string;
  title: string;
  subtitle: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  imageUri,
  title,
  subtitle,
}) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 18,
      stiffness: 150,
    });

    rotation.value = withSequence(
      withTiming(-5, { duration: 80, easing: Easing.linear }),
      withTiming(5, { duration: 80, easing: Easing.linear }),
      withTiming(-5, { duration: 80, easing: Easing.linear }),
      withTiming(5, { duration: 80, easing: Easing.linear }),
      withTiming(0, { duration: 80, easing: Easing.linear })
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Error Icon - positioned at top */}
      <View style={styles.iconWrapper}>
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <View style={styles.iconCircle}>
            <Ionicons name="close-circle-outline" size={80} color="#FFFFFF" />
          </View>
        </Animated.View>
      </View>

      {/* Title and Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Plant Image */}
      {imageUri && (
        <Animated.View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.imageOverlay} />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEBEE",
  },
  iconWrapper: {
    position: "absolute",
    top: 90,
    left: "50%",
    marginLeft: -50,
    width: 105,
    height: 105,
  },
  iconContainer: {
    width: 105,
    height: 105,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 105,
    height: 105,
    borderRadius: 64,
    backgroundColor: "#EF5350",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
  },
  textContainer: {
    position: "absolute",
    top: 240,
    left: 56,
    right: 56,
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#C62828",
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: 0.07,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#D32F2F",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: -0.3125,
    opacity: 0.9,
    maxWidth: 283,
  },
  imageContainer: {
    position: "absolute",
    top: 360,
    left: 25,
    right: 25,
    height: 322,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#EF5350",
  },
  image: {
    width: "105%",
    height: "105%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(239, 83, 80, 0.2)",
  },
});

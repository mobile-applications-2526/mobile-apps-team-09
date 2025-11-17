import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function CameraEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleAddPlant = () => {
    // @ts-ignore - Expo Router dynamic route
    router.push("/add-plant/choose-photo");
  };

  const handleDiagnosePlant = () => {
    // @ts-ignore - Expo Router dynamic route
    router.push("/diagnose-plant/choose-photo");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.cardWhite} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Choose Action</Text>
          <Text style={styles.headerSubtitle}>What would you like to do?</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Plant Card */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleAddPlant}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"]}
            style={styles.iconGradient}
          >
            <Ionicons name="leaf" size={40} color={COLORS.cardWhite} />
          </LinearGradient>
          <Text style={styles.cardTitle}>Add Plant to Garden</Text>
          <Text style={styles.cardDescription}>
            Identify and add a new plant to your collection
          </Text>
        </TouchableOpacity>

        {/* Diagnose Plant Card */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleDiagnosePlant}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#FF9800", "#F57C00"]}
            style={styles.iconGradient}
          >
            <Ionicons name="scan" size={40} color={COLORS.cardWhite} />
          </LinearGradient>
          <Text style={styles.cardTitle}>Diagnose Plant</Text>
          <Text style={styles.cardDescription}>
            Check your plant&apos;s health and get care tips
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2EFDA",
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardWhite,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#558B2F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 52,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
    marginLeft: -15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    gap: 24,
  },
  optionCard: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: 14,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 16,
    color: "#558B2F",
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
});

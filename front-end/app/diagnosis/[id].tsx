import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { mockDiagnosisHistory } from "@/data/mockDiagnosisData";
import { DiagnosisDetailHeader } from "@/components/diagnose/DiagnosisDetailHeader";
import { DiagnosisImageCard } from "@/components/diagnose/DiagnosisImageCard";
import { IssueDetectionCard } from "@/components/diagnose/IssueDetectionCard";
import { RecommendationCard } from "@/components/diagnose/RecommendationCard";
import { RecoveryTipsCard } from "@/components/diagnose/RecoveryTipsCard";

const recoveryTips = [
  {
    icon: "water" as const,
    iconColor: "#00BCD4",
    backgroundColor: "rgba(0, 188, 212, 0.1)",
    label: "Watering",
    value: "Reduce to once every 5-7 days",
  },
  {
    icon: "sunny" as const,
    iconColor: "#FFC107",
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    label: "Sunlight",
    value: "Indirect bright light, 4-6 hours",
  },
  {
    icon: "leaf" as const,
    iconColor: "#03A9F4",
    backgroundColor: "rgba(3, 169, 244, 0.1)",
    label: "Air Circulation",
    value: "Ensure good ventilation",
  },
  {
    icon: "thermometer" as const,
    iconColor: "#FF5722",
    backgroundColor: "rgba(255, 87, 34, 0.1)",
    label: "Temperature",
    value: "Keep between 65-75°F",
  },
];

const recommendationText =
  "Remove affected leaves immediately to prevent spread. Reduce watering frequency and ensure proper air circulation. Apply a fungicide spray every 7-10 days for 3 weeks. Keep the plant in a well-ventilated area and avoid getting water on the leaves.";

export default function DiagnosisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const diagnosis = mockDiagnosisHistory.find((item) => item.id === id);

  if (!diagnosis) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Diagnosis not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DiagnosisDetailHeader
          plantName={diagnosis.plantName}
          date={diagnosis.date}
          onBackPress={() => router.back()}
        />

        <DiagnosisImageCard
          imageUri={diagnosis.imageUri}
          severity={diagnosis.severity}
          severityColor={diagnosis.severityColor}
        />

        <IssueDetectionCard
          disease={diagnosis.disease}
          confidence={diagnosis.confidence}
          confidenceColor={diagnosis.confidenceColor}
        />

        <RecommendationCard text={recommendationText} />

        <RecoveryTipsCard tips={recoveryTips} />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: 40,
  },
  bottomPadding: {
    height: 20,
  },
});

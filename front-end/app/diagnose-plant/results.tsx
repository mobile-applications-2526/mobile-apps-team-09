import React from "react";
import { View, StyleSheet, ScrollView, StatusBar } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { DiagnosisDetailHeader } from "@/components/diagnose/DiagnosisDetailHeader";
import { DiagnosisImageCard } from "@/components/diagnose/DiagnosisImageCard";
import { IssueDetectionCard } from "@/components/diagnose/IssueDetectionCard";
import { RecommendationCard } from "@/components/diagnose/RecommendationCard";
import { RecoveryTipsCard } from "@/components/diagnose/RecoveryTipsCard";

export default function DiagnosisResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Cast params to expected types
  const diagnosisParams = {
    imageUri: params.imageUri as string,
    plantCommonName: params.plantCommonName as string | undefined,
    issueDetected: params.issueDetected as string,
    confidenceScore: params.confidenceScore as string,
    severity: params.severity as string,
    recommendation: params.recommendation as string,
    wateringSchedule: params.wateringSchedule as string,
    sunlightRequirement: params.sunlightRequirement as string,
    temperatureRange: params.temperatureRange as string,
    airCirculationTip: params.airCirculationTip as string,
  };

  // Parse confidence score
  const confidenceScore = parseFloat(diagnosisParams.confidenceScore);
  const confidencePercentage = Math.round(confidenceScore * 100);

  // Determine severity color
  const getSeverityColor = (severity: string): string => {
    if (severity.includes("Healthy")) return "#4CAF50";
    if (severity.includes("Low")) return "#FFC107";
    if (severity.includes("Medium")) return "#FF9800";
    if (severity.includes("High")) return "#EF5350";
    return "#9E9E9E";
  };

  // Determine confidence color
  const getConfidenceColor = (score: number): string => {
    if (score >= 0.8) return "#4CAF50";
    if (score >= 0.6) return "#FFC107";
    return "#EF5350";
  };

  const severityColor = getSeverityColor(diagnosisParams.severity);
  const confidenceColor = getConfidenceColor(confidenceScore);

  const getShortPlantName = (name: string | undefined): string => {
    if (!name) return "Diagnosis Complete";
    const words = name.trim().split(" ");
    return words.slice(0, 2).join(" ");
  };

  const displayName = getShortPlantName(diagnosisParams.plantCommonName);

  // Format date
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Prepare recovery tips
  const recoveryTips = [
    {
      icon: "water" as const,
      iconColor: "#2196F3",
      backgroundColor: "rgba(33, 150, 243, 0.1)",
      label: "Watering",
      value: diagnosisParams.wateringSchedule,
    },
    {
      icon: "sunny" as const,
      iconColor: "#FFC107",
      backgroundColor: "rgba(255, 193, 7, 0.1)",
      label: "Sunlight",
      value: diagnosisParams.sunlightRequirement,
    },
    {
      icon: "leaf" as const,
      iconColor: "#4CAF50",
      backgroundColor: "rgba(76, 175, 80, 0.1)",
      label: "Air Circulation",
      value: diagnosisParams.airCirculationTip,
    },
    {
      icon: "thermometer" as const,
      iconColor: "#FF5722",
      backgroundColor: "rgba(255, 87, 34, 0.1)",
      label: "Temperature",
      value: diagnosisParams.temperatureRange,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DiagnosisDetailHeader
          plantName={displayName}
          date={currentDate}
          onBackPress={() => router.push("/(tabs)/search")}
        />

        <DiagnosisImageCard
          imageUri={diagnosisParams.imageUri}
          severity={diagnosisParams.severity.replace(" Severity", "")}
          severityColor={severityColor}
        />

        <IssueDetectionCard
          disease={diagnosisParams.issueDetected}
          confidence={`${confidencePercentage}%`}
          confidenceColor={confidenceColor}
        />

        <RecommendationCard text={diagnosisParams.recommendation} />

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
  bottomPadding: {
    height: 20,
  },
});

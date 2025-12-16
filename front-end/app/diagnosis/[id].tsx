import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { DiagnosisDetailHeader } from "@/components/diagnose/DiagnosisDetailHeader";
import { DiagnosisImageCard } from "@/components/diagnose/DiagnosisImageCard";
import { IssueDetectionCard } from "@/components/diagnose/IssueDetectionCard";
import { RecommendationCard } from "@/components/diagnose/RecommendationCard";
import { RecoveryTipsCard } from "@/components/diagnose/RecoveryTipsCard";
import DiagnosisService, {
  DiagnosisHistoryItem,
} from "@/services/DiagnosisService";
import { convertToDiagnosisItem } from "@/types/diagnosis";

export default function DiagnosisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [diagnosis, setDiagnosis] = useState<DiagnosisHistoryItem | null>(null);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(undefined);
        const data = await DiagnosisService.getDiagnosisById(parseInt(id));
        setDiagnosis(data);
      } catch (err: any) {
        console.error("Error fetching diagnosis:", err);
        setError(err.response?.data?.detail || "Failed to load diagnosis");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContainer,
          { paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primaryGreen} />
        <Text style={styles.loadingText}>Loading diagnosis...</Text>
      </View>
    );
  }

  if (error || !diagnosis) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContainer,
          { paddingTop: insets.top },
        ]}
      >
        <Text style={styles.errorText}>{error || "Diagnosis not found"}</Text>
        <Text style={styles.retryText} onPress={() => router.back()}>
          Go back
        </Text>
      </View>
    );
  }

  // Convert to UI format for display
  const uiDiagnosis = convertToDiagnosisItem(diagnosis);

  // Prepare recovery tips from backend data
  const recoveryTips = [
    {
      icon: "water" as const,
      iconColor: "#2196F3",
      backgroundColor: "rgba(33, 150, 243, 0.1)",
      label: "Watering",
      value: diagnosis.recovery_watering || "Not specified",
    },
    {
      icon: "sunny" as const,
      iconColor: "#FFC107",
      backgroundColor: "rgba(255, 193, 7, 0.1)",
      label: "Sunlight",
      value: diagnosis.recovery_sunlight || "Not specified",
    },
    {
      icon: "leaf" as const,
      iconColor: "#4CAF50",
      backgroundColor: "rgba(76, 175, 80, 0.1)",
      label: "Air Circulation",
      value: diagnosis.recovery_air_circulation || "Not specified",
    },
    {
      icon: "thermometer" as const,
      iconColor: "#FF5722",
      backgroundColor: "rgba(255, 87, 34, 0.1)",
      label: "Temperature",
      value: diagnosis.recovery_temperature || "Not specified",
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DiagnosisDetailHeader
          plantName={diagnosis.plant_name || "Unknown Plant"}
          date={uiDiagnosis.date}
          onBackPress={() => router.back()}
        />

        <DiagnosisImageCard
          imageUri={diagnosis.image_url || ""}
          severity={uiDiagnosis.severity}
          severityColor={uiDiagnosis.severityColor}
        />

        <IssueDetectionCard
          disease={diagnosis.issue_detected}
          confidence={uiDiagnosis.confidence}
          confidenceColor={uiDiagnosis.confidenceColor}
        />

        <RecommendationCard
          text={diagnosis.recommendation || "No recommendation available"}
        />

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
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 16,
  },
  retryText: {
    fontSize: 14,
    color: COLORS.primaryGreen,
    textDecorationLine: "underline",
  },
  bottomPadding: {
    height: 20,
  },
});

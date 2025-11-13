import React, { useCallback, useState, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { DiagnosisHeader } from "@/components/diagnose/DiagnosisHeader";
import { DiagnosisCard } from "@/components/diagnose/DiagnosisCard";
import { SortModal, SortOption } from "@/components/diagnose/SortModal";
import { mockDiagnosisHistory } from "@/data/mockDiagnosisData";

export default function DiagnoseScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date");

  const sortedDiagnoses = useMemo(() => {
    const sorted = [...mockDiagnosisHistory];

    switch (sortBy) {
      case "date":
        return sorted.sort(
          (a, b) =>
            new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
        );
      case "name":
        return sorted.sort((a, b) => a.plantName.localeCompare(b.plantName));
      case "severity":
        const severityOrder = { High: 3, Medium: 2, Low: 1 };
        return sorted.sort(
          (a, b) =>
            severityOrder[b.severity as keyof typeof severityOrder] -
            severityOrder[a.severity as keyof typeof severityOrder]
        );
      default:
        return sorted;
    }
  }, [sortBy]);

  const handleDiagnosisPress = useCallback(
    (id: string) => {
      router.push(`/diagnosis/${id}`);
    },
    [router]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DiagnosisHeader
          totalScans={mockDiagnosisHistory.length}
          onSortPress={() => setSortModalVisible(true)}
        />

        <View style={styles.cardsContainer}>
          {sortedDiagnoses.map((item) => (
            <DiagnosisCard
              key={item.id}
              plantName={item.plantName}
              disease={item.disease}
              severity={item.severity}
              severityColor={item.severityColor}
              confidence={item.confidence}
              confidenceColor={item.confidenceColor}
              date={item.date}
              imageUri={item.imageUri}
              onPress={() => handleDiagnosisPress(item.id)}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        currentSort={sortBy}
        onSelectSort={setSortBy}
      />
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
    paddingTop: 16,
    paddingBottom: 120,
  },
  cardsContainer: {
    paddingHorizontal: 24,
  },
  bottomPadding: {
    height: 20,
  },
});

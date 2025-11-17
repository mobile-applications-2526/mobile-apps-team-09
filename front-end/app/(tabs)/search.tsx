import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { DiagnosisHeader } from "@/components/diagnose/DiagnosisHeader";
import { DiagnosisCard } from "@/components/diagnose/DiagnosisCard";
import { SortModal, SortOption } from "@/components/diagnose/SortModal";
import { convertToDiagnosisItem } from "@/types/diagnosis";
import DiagnosisService from "@/services/DiagnosisService";
import * as SecureStore from "expo-secure-store";

export default function DiagnoseScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [diagnoses, setDiagnoses] = useState<
    ReturnType<typeof convertToDiagnosisItem>[]
  >([]);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      setIsAuthenticated(!!token);
      return !!token;
    } catch (err) {
      console.error("Error checking auth:", err);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // Fetch diagnoses from backend
  const fetchDiagnoses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication first
      const isAuth = await checkAuth();
      if (!isAuth) {
        setError("Please log in to view your diagnoses");
        setLoading(false);
        return;
      }

      const data = await DiagnosisService.getDiagnosisHistory();
      const converted = data.map(convertToDiagnosisItem);
      setDiagnoses(converted);
    } catch (err: any) {
      console.error("Error fetching diagnoses:", err);

      // Handle specific error cases
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Session expired. Please log in again");
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data?.detail || "Failed to load diagnoses");
      }
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  useEffect(() => {
    fetchDiagnoses();
  }, [fetchDiagnoses]);

  const sortedDiagnoses = useMemo(() => {
    const sorted = [...diagnoses];

    switch (sortBy) {
      case "date":
        return sorted.sort(
          (a, b) =>
            new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
        );
      case "name":
        return sorted.sort((a, b) => a.plantName.localeCompare(b.plantName));
      case "severity":
        const severityOrder = { High: 3, Medium: 2, Low: 1, Healthy: 0 };
        return sorted.sort(
          (a, b) =>
            severityOrder[b.severity as keyof typeof severityOrder] -
            severityOrder[a.severity as keyof typeof severityOrder]
        );
      default:
        return sorted;
    }
  }, [diagnoses, sortBy]);

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
          totalScans={diagnoses.length}
          onSortPress={() => setSortModalVisible(true)}
        />

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryGreen} />
            <Text style={styles.loadingText}>Loading diagnoses...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            {isAuthenticated === false ? (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.loginButtonText}>Go to Login</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={fetchDiagnoses}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : diagnoses.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconContainer}>
              <Ionicons
                name="leaf-outline"
                size={80}
                color={COLORS.primaryGreen}
              />
            </View>
            <Text style={styles.emptyStateTitle}>No Diagnoses Yet</Text>
            <Text style={styles.emptyStateDescription}>
              Start scanning your plants to track their health and get
              personalized care recommendations
            </Text>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => router.push("/(tabs)/camera")}
            >
              <Ionicons name="camera" size={24} color="#FFFFFF" />
              <Text style={styles.scanButtonText}>Scan a Plant</Text>
            </TouchableOpacity>
          </View>
        ) : (
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
        )}

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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 60,
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
  loginButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 120,
    paddingBottom: 100,
  },
  emptyStateIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryGreen,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
    shadowColor: COLORS.primaryGreen,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsCard } from "@/components/profile/StatsCard";
import { AboutMeCard } from "@/components/profile/AboutMeCard";
import { PlantCollectionCard } from "@/components/profile/PlantCollectionCard";
import { SettingsMenu } from "@/components/profile/SettingsMenu";
import { RecentActivityCard } from "@/components/profile/RecentActivityCard";
import { COLORS } from "@/constants/colors";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import {
  getProfileByUserId,
  ProfileBackendResponse,
  ProfileNotFoundError,
} from "@/services/ProfileService";
import { getCurrentUserId, getCurrentUsername } from "@/services/UserService";
import PlantService, { PlantResponse } from "@/services/PlantService";
import {
  getActivitiesByUserId,
  Activity,
  formatTimeAgo,
} from "@/services/ActivityService";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [profileData, setProfileData] = useState<ProfileBackendResponse | null>(
    null
  );
  const [plants, setPlants] = useState<PlantResponse[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileNotFound, setProfileNotFound] = useState(false);

  const handleSettingsPress = () => {
    setMenuPosition({ x: 0, y: insets.top + 80 });
    setMenuVisible(true);
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Edit profile page coming soon!");
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Settings page coming soon!");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("access_token");
            await SecureStore.deleteItemAsync("user_id");
            await SecureStore.deleteItemAsync("username");
            router.replace("/login");
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleViewAllPlants = () => {
    router.push("/(tabs)/garden");
  };

  // Fetch profile data and plants
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProfileNotFound(false);

      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error("No user ID found. Please login again.");
      }

      // Fetch profile
      try {
        const profile = await getProfileByUserId(userId);
        setProfileData(profile);
      } catch (profileError: any) {
        if (profileError instanceof ProfileNotFoundError) {
          // Profile doesn't exist - this is OK, show create profile UI
          console.log("No profile found for user");
          setProfileData(null);
          setProfileNotFound(true);
        } else {
          // Actual error - show error message
          console.error("Error fetching profile:", profileError);
          setError(profileError.message || "Failed to load profile");
          setProfileData(null);
        }
      }

      // Fetch plants
      try {
        const userPlants = await PlantService.getMyPlants();
        setPlants(userPlants);
      } catch (plantsError: any) {
        console.error("Error fetching plants:", plantsError);
        setPlants([]);
      }

      // Fetch activities
      try {
        const userActivities = await getActivitiesByUserId(userId);
        setActivities(userActivities);
      } catch (activityError: any) {
        console.error("Error fetching activities:", activityError);
        setActivities([]);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when screen comes into focus (e.g., after creating profile)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Helper function to get initials from full name
  const getInitials = (fullName: string | null | undefined): string => {
    if (!fullName) return "??";
    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading state
  if (loading) {
    return (
      <View
        style={[
          styles.mainContainer,
          styles.centerContainer,
          { paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primaryGreen} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Show Add Profile button if no profile exists (404)
  if (profileNotFound) {
    return (
      <View
        style={[
          styles.mainContainer,
          styles.centerContainer,
          { paddingTop: insets.top },
        ]}
      >
        <View style={styles.emptyProfileContainer}>
          <View style={styles.emptyProfileIconContainer}>
            <Ionicons name="person-add" size={80} color={COLORS.primaryGreen} />
          </View>
          <Text style={styles.emptyProfileTitle}>Create Your Profile</Text>
          <Text style={styles.emptyProfileSubtitle}>
            Set up your profile to track your plant journey and showcase your
            green thumb!
          </Text>
          <TouchableOpacity
            style={styles.addProfileButton}
            onPress={() => router.push("/create-profile")}
          >
            <Ionicons name="leaf" size={24} color="#FFFFFF" />
            <Text style={styles.addProfileButtonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // If we have profile data, use it
  if (!profileData) {
    // If there's an error but no profile, show error state
    return (
      <View
        style={[
          styles.mainContainer,
          styles.centerContainer,
          { paddingTop: insets.top },
        ]}
      >
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorTitle}>Failed to Load Profile</Text>
        <Text style={styles.errorMessage}>{error || "Unknown error"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fullName = profileData.full_name || "Anonymous User";
  const displayData = {
    fullName: fullName,
    subtitle: profileData.tagline || "Plant Enthusiast",
    isActive: true,
    initials: getInitials(fullName),
    stats: {
      plants: profileData.plant_count,
      age: profileData.age || 0,
      careRate: `${profileData.care_rate}%`,
    },
    aboutMe: {
      livingSituation: profileData.living_situation || "Not specified",
      experienceLevel: profileData.experience_level || "Not specified",
    },
    recentActivity: activities.map((activity) => ({
      id: activity.id.toString(),
      type: activity.activity_type,
      title: activity.title || "Activity",
      timeAgo: formatTimeAgo(activity.created_at),
    })),
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader
          fullName={displayData.fullName}
          subtitle={displayData.subtitle}
          isActive={displayData.isActive}
          initials={displayData.initials}
          onSettingsPress={handleSettingsPress}
        />

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard
            icon="leaf-outline"
            value={displayData.stats.plants}
            label="Plants"
            iconColor={COLORS.secondary}
            iconBackground={COLORS.primaryPale}
          />
          <StatsCard
            icon="calendar-outline"
            value={displayData.stats.age}
            label="Age"
            iconColor={COLORS.sunGold}
            iconBackground="#FEF3C7"
          />
          <StatsCard
            icon="water-outline"
            value={displayData.stats.careRate}
            label="Care Rate"
            iconColor={COLORS.skyBlue}
            iconBackground="#E0F2FE"
          />
        </View>

        {/* About Me Card */}
        <AboutMeCard
          livingSituation={displayData.aboutMe.livingSituation}
          experienceLevel={displayData.aboutMe.experienceLevel}
          experienceStartDate={profileData?.experience_start_date}
        />

        {/* Plant Collection */}
        <PlantCollectionCard plants={plants} onViewAll={handleViewAllPlants} />

        {/* Recent Activity */}
        <RecentActivityCard activities={displayData.recentActivity} />

        {/* Bottom padding for safe area */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Settings Menu Modal */}
      <SettingsMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onEditProfile={handleEditProfile}
        onSettings={handleSettings}
        onLogout={handleLogout}
        position={menuPosition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: COLORS.primaryGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 120,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 20,
  },
  emptyProfileContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
    maxWidth: 400,
  },
  emptyProfileIconContainer: {
    marginBottom: 24,
  },
  emptyProfileTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyProfileSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  addProfileButton: {
    backgroundColor: COLORS.primaryGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 250,
  },
  addProfileButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});

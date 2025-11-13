import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsCard } from "@/components/profile/StatsCard";
import { AboutMeCard } from "@/components/profile/AboutMeCard";
import { PlantCollectionCard } from "@/components/profile/PlantCollectionCard";
import { RecentActivityCard } from "@/components/profile/RecentActivityCard";
import { SettingsMenu } from "@/components/profile/SettingsMenu";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { mockUserProfile } from "@/data/mockProfileData";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

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
    Alert.alert("My Plants", "View all plants page coming soon!");
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
          fullName={mockUserProfile.fullName}
          subtitle={mockUserProfile.subtitle}
          isActive={mockUserProfile.isActive}
          initials={mockUserProfile.initials}
          onSettingsPress={handleSettingsPress}
        />

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard
            icon="leaf-outline"
            value={mockUserProfile.stats.plants}
            label="Plants"
            iconColor={COLORS.secondary}
            iconBackground={COLORS.primaryPale}
          />
          <StatsCard
            icon="calendar-outline"
            value={mockUserProfile.stats.age}
            label="Age"
            iconColor={COLORS.sunGold}
            iconBackground="#FEF3C7"
          />
          <StatsCard
            icon="water-outline"
            value={mockUserProfile.stats.careRate}
            label="Care Rate"
            iconColor={COLORS.skyBlue}
            iconBackground="#E0F2FE"
          />
        </View>

        {/* About Me Card */}
        <AboutMeCard
          livingSituation={mockUserProfile.aboutMe.livingSituation}
          experienceLevel={mockUserProfile.aboutMe.experienceLevel}
          careStreak={mockUserProfile.aboutMe.careStreak}
        />

        {/* Plant Collection */}
        <PlantCollectionCard
          plants={mockUserProfile.plantCollection}
          onViewAll={handleViewAllPlants}
        />

        {/* Recent Activity */}
        <RecentActivityCard activities={mockUserProfile.recentActivity} />

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 120,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

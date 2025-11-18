import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsCard } from "@/components/profile/StatsCard";
import { AboutMeCard } from "@/components/profile/AboutMeCard";
import { PlantCollectionCard } from "@/components/profile/PlantCollectionCard";
import { RecentActivityCard } from "@/components/profile/RecentActivityCard";
import { COLORS } from "@/constants/colors";

const mockUserData = {
  fullName: "Bob Smith",
  subtitle: "Plant Enthusiast",
  isActive: true,
  initials: "BS",
  stats: {
    plants: 27,
    age: 28,
    careRate: "94%",
  },
  aboutMe: {
    livingSituation: "Apartment with Balcony",
    experienceLevel: "Intermediate",
  },
  plantCollection: [
    { id: "1", name: "Monstera", emoji: "🌿", backgroundColor: "#C8E6C9" },
    { id: "2", name: "Orchid", emoji: "🌸", backgroundColor: "#F8BBD0" },
    { id: "3", name: "Succulent", emoji: "🌵", backgroundColor: "#B2DFDB" },
    { id: "4", name: "Pothos", emoji: "🪴", backgroundColor: "#FFF9C4" },
    { id: "5", name: "Hibiscus", emoji: "🌺", backgroundColor: "#FFCCBC" },
    { id: "6", name: "Fern", emoji: "🌿", backgroundColor: "#E1BEE7" },
  ],
  recentActivity: [
    {
      id: "1",
      type: "watered" as const,
      title: "Watered Monstera",
      timeAgo: "2 hours ago",
    },
    {
      id: "2",
      type: "added" as const,
      title: "Added new plant to collection",
      timeAgo: "Yesterday",
    },
    {
      id: "3",
      type: "moved" as const,
      title: "Moved Orchid to sunnier spot",
      timeAgo: "2 days ago",
    },
  ],
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const handleSettingsPress = () => {
    console.log("Settings pressed");
    // Navigate to settings screen
  };

  const handleViewAllPlants = () => {
    console.log("View all plants pressed");
    // Navigate to all plants screen
  };

  return (
    <ThemedView
      style={[styles.mainContainer, { paddingTop: insets.top }]}
      lightColor="#D2EFDA"
      darkColor="#D2EFDA"
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader
          fullName={mockUserData.fullName}
          subtitle={mockUserData.subtitle}
          isActive={mockUserData.isActive}
          initials={mockUserData.initials}
          onSettingsPress={handleSettingsPress}
        />

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard
            icon="leaf-outline"
            value={mockUserData.stats.plants}
            label="Plants"
            iconColor={COLORS.primaryGreen}
            iconBackground="#D1FAE5"
          />
          <StatsCard
            icon="calendar-outline"
            value={mockUserData.stats.age}
            label="Age"
            iconColor={COLORS.sunGold}
            iconBackground="#FEF3C7"
          />
          <StatsCard
            icon="water-outline"
            value={mockUserData.stats.careRate}
            label="Care Rate"
            iconColor={COLORS.skyBlue}
            iconBackground="#E0F2FE"
          />
        </View>

        {/* About Me Card */}
        <AboutMeCard
          livingSituation={mockUserData.aboutMe.livingSituation}
          experienceLevel={mockUserData.aboutMe.experienceLevel}
        />

        {/* Plant Collection */}
        <PlantCollectionCard
          plants={mockUserData.plantCollection}
          onViewAll={handleViewAllPlants}
        />

        {/* Recent Activity */}
        <RecentActivityCard activities={mockUserData.recentActivity} />

        {/* Bottom padding for safe area */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#D2EFDA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 0,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 100,
  },
});

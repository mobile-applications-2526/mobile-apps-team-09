import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, badge }) => {
  return (
    <View style={styles.infoItem}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.infoValue}>{value}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

interface AboutMeCardProps {
  livingSituation: string;
  experienceLevel: string;
  careStreak: number;
}

export const AboutMeCard: React.FC<AboutMeCardProps> = ({
  livingSituation,
  experienceLevel,
  careStreak,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Me</Text>

      <InfoItem
        icon={
          <View style={[styles.iconCircle, { backgroundColor: "#E0F2FE" }]}>
            <Ionicons
              name="location-outline"
              size={20}
              color={COLORS.skyBlue}
            />
          </View>
        }
        label="Living Situation"
        value={livingSituation}
      />

      <InfoItem
        icon={
          <View style={[styles.iconCircle, { backgroundColor: "#FCE7F3" }]}>
            <MaterialCommunityIcons name="sprout" size={20} color="#EC4899" />
          </View>
        }
        label="Experience Level"
        value={experienceLevel}
        badge="2 years"
      />

      <InfoItem
        icon={
          <View style={[styles.iconCircle, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="sunny-outline" size={20} color={COLORS.sunGold} />
          </View>
        }
        label="Care Streak"
        value={`${careStreak} days 🔥`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  badge: {
    backgroundColor: "#1B5E20",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

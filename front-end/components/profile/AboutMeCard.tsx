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
  experienceStartDate?: string | null; // ISO date string
}

// Helper function to calculate years and months from start date
const calculateExperienceDuration = (startDate: string | null | undefined): string | null => {
  if (!startDate) return null;

  const start = new Date(startDate);
  const now = new Date();

  const yearsDiff = now.getFullYear() - start.getFullYear();
  const monthsDiff = now.getMonth() - start.getMonth();

  let totalYears = yearsDiff;
  let totalMonths = monthsDiff;

  if (monthsDiff < 0) {
    totalYears -= 1;
    totalMonths += 12;
  }

  if (totalYears === 0 && totalMonths === 0) {
    return "Just started";
  } else if (totalYears === 0) {
    return `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`;
  } else if (totalMonths === 0) {
    return `${totalYears} ${totalYears === 1 ? 'year' : 'years'}`;
  } else {
    return `${totalYears} ${totalYears === 1 ? 'year' : 'years'} ${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`;
  }
};

export const AboutMeCard: React.FC<AboutMeCardProps> = ({
  livingSituation,
  experienceLevel,
  experienceStartDate,
}) => {
  const experienceDuration = calculateExperienceDuration(experienceStartDate);
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
        badge={experienceDuration || undefined}
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

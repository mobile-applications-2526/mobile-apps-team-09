import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
  labelBadge?: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  badge,
  labelBadge,
}) => {
  return (
    <View style={styles.infoItem}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.infoContent}>
        <View style={styles.labelContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          {labelBadge}
        </View>
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
  city?: string | null;
  country?: string | null;
}

// Major countries/regions in the Southern Hemisphere for heuristic check
const SOUTHERN_HEMISPHERE_COUNTRIES = [
  "Australia",
  "New Zealand",
  "Argentina",
  "Bolivia",
  "Brazil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Paraguay",
  "Peru",
  "Uruguay",
  "South Africa",
  "Zimbabwe",
  "Namibia",
  "Botswana",
  "Zambia",
  "Angola",
  "Mozambique",
  "Madagascar",
  "Indonesia",
];

const getSeason = (country?: string | null) => {
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec

  let isSouthernHemisphere = false;

  if (country) {
    // Case-insensitive check if country is in Southern Hemisphere list
    const normalizedCountry = country.toLowerCase();
    isSouthernHemisphere = SOUTHERN_HEMISPHERE_COUNTRIES.some((c) =>
      normalizedCountry.includes(c.toLowerCase())
    );
  }

  // Northern Hemisphere Seasons (default)
  // Spring: March (2) - May (4)
  // Summer: June (5) - August (7)
  // Autumn: September (8) - November (10)
  // Winter: December (11) - February (1)

  if (isSouthernHemisphere) {
    // Southern Hemisphere Seasons (Flipped)
    // Autumn: March (2) - May (4)
    // Winter: June (5) - August (7)
    // Spring: September (8) - November (10)
    // Summer: December (11) - February (1)
    if (month >= 2 && month <= 4)
      return {
        name: "Autumn",
        icon: "leaf-maple",
        iconType: "MaterialCommunityIcons" as const,
        color: "#B45309",
        bg: "#FEF3C7",
      }; // Warm amber
    if (month >= 5 && month <= 7)
      return {
        name: "Winter",
        icon: "snowflake",
        iconType: "MaterialCommunityIcons" as const,
        color: "#1E40AF",
        bg: "#DBEAFE",
      }; // Deep blue
    if (month >= 8 && month <= 10)
      return {
        name: "Spring",
        icon: "flower-pollen",
        iconType: "MaterialCommunityIcons" as const,
        color: "#059669",
        bg: "#D1FAE5",
      }; // Fresh green
    return {
      name: "Summer",
      icon: "weather-sunny",
      iconType: "MaterialCommunityIcons" as const,
      color: "#D97706",
      bg: "#FEF3C7",
    }; // Golden orange
  } else {
    // Northern Hemisphere
    if (month >= 2 && month <= 4)
      return {
        name: "Spring",
        icon: "flower-pollen",
        iconType: "MaterialCommunityIcons" as const,
        color: "#059669",
        bg: "#D1FAE5",
      }; // Fresh green
    if (month >= 5 && month <= 7)
      return {
        name: "Summer",
        icon: "weather-sunny",
        iconType: "MaterialCommunityIcons" as const,
        color: "#D97706",
        bg: "#FEF3C7",
      }; // Golden orange
    if (month >= 8 && month <= 10)
      return {
        name: "Autumn",
        icon: "leaf-maple",
        iconType: "MaterialCommunityIcons" as const,
        color: "#B45309",
        bg: "#FEF3C7",
      }; // Warm amber
    return {
      name: "Winter",
      icon: "snowflake",
      iconType: "MaterialCommunityIcons" as const,
      color: "#1E40AF",
      bg: "#DBEAFE",
    }; // Deep blue
  }
};

// Helper function to calculate years and months from start date
const calculateExperienceDuration = (
  startDate: string | null | undefined
): string | null => {
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
    return `${totalMonths} ${totalMonths === 1 ? "month" : "months"}`;
  } else if (totalMonths === 0) {
    return `${totalYears} ${totalYears === 1 ? "year" : "years"}`;
  } else {
    return `${totalYears} ${
      totalYears === 1 ? "year" : "years"
    } ${totalMonths} ${totalMonths === 1 ? "month" : "months"}`;
  }
};

export const AboutMeCard: React.FC<AboutMeCardProps> = ({
  livingSituation,
  experienceLevel,
  experienceStartDate,
  city,
  country,
}) => {
  const experienceDuration = calculateExperienceDuration(experienceStartDate);
  const locationString = [city, country].filter(Boolean).join(", ");
  const season = getSeason(country);

  const seasonBadge = (
    <View
      style={[
        styles.seasonBadge,
        {
          backgroundColor: season.bg,
          borderColor: season.bg,
        },
      ]}
    >
      {season.iconType === "MaterialCommunityIcons" ? (
        <MaterialCommunityIcons
          name={season.icon as any}
          size={12}
          color={season.color}
        />
      ) : (
        <Ionicons name={season.icon as any} size={12} color={season.color} />
      )}
      <Text style={[styles.seasonText, { color: season.color }]}>
        {season.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Me</Text>

      <InfoItem
        icon={
          <View style={[styles.iconCircle, { backgroundColor: "#E0F2FE" }]}>
            <Ionicons name="home-outline" size={20} color={COLORS.skyBlue} />
          </View>
        }
        label="Living Situation"
        value={livingSituation}
      />

      {locationString ? (
        <InfoItem
          icon={
            <View style={[styles.iconCircle, { backgroundColor: "#EDE9FE" }]}>
              <Ionicons name="location-outline" size={20} color="#8B5CF6" />
            </View>
          }
          label="Location"
          value={locationString}
          labelBadge={seasonBadge}
        />
      ) : null}

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
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 6,
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
    backgroundColor: COLORS.primaryLight,
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
  seasonBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  seasonText: {
    fontSize: 10,
    fontWeight: "600",
  },
});

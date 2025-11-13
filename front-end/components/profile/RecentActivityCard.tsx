import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  timeAgo: string;
  iconBackgroundColor: string;
}

interface ActivityItemProps {
  item: ActivityItem;
}

const ActivityItemComponent: React.FC<ActivityItemProps> = ({ item }) => {
  return (
    <View style={styles.activityItem}>
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: item.iconBackgroundColor },
        ]}
      >
        {item.icon}
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.timeAgo}</Text>
      </View>
    </View>
  );
};

interface RecentActivityCardProps {
  activities: {
    id: string;
    type: "watered" | "added" | "moved";
    title: string;
    timeAgo: string;
  }[];
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "watered":
        return {
          icon: <Ionicons name="water" size={20} color={COLORS.skyBlue} />,
          backgroundColor: "#E0F2FE",
        };
      case "added":
        return {
          icon: (
            <MaterialCommunityIcons
              name="sprout"
              size={20}
              color={COLORS.healthyGreen}
            />
          ),
          backgroundColor: "#D1FAE5",
        };
      case "moved":
        return {
          icon: <Ionicons name="sunny" size={20} color={COLORS.sunGold} />,
          backgroundColor: "#FEF3C7",
        };
      default:
        return {
          icon: <Ionicons name="leaf" size={20} color={COLORS.primaryGreen} />,
          backgroundColor: "#D1FAE5",
        };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>

      {activities.map((activity) => {
        const iconData = getActivityIcon(activity.type);
        return (
          <ActivityItemComponent
            key={activity.id}
            item={{
              id: activity.id,
              icon: iconData.icon,
              title: activity.title,
              timeAgo: activity.timeAgo,
              iconBackgroundColor: iconData.backgroundColor,
            }}
          />
        );
      })}
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
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

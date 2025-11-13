export interface PlantCollectionItem {
  id: string;
  name: string;
  emoji: string;
  backgroundColor: string;
}

export interface ActivityItem {
  id: string;
  type: "watered" | "added" | "moved";
  title: string;
  timeAgo: string;
}

export interface UserProfileData {
  fullName: string;
  subtitle: string;
  isActive: boolean;
  initials: string;
  stats: {
    plants: number;
    age: number;
    careRate: string;
  };
  aboutMe: {
    livingSituation: string;
    experienceLevel: string;
    careStreak: number;
  };
  plantCollection: PlantCollectionItem[];
  recentActivity: ActivityItem[];
}

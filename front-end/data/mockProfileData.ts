import { UserProfileData } from "@/types/profile";

// TODO: Replace with real user data from API
export const mockUserProfile: UserProfileData = {
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
      type: "watered",
      title: "Watered Monstera",
      timeAgo: "2 hours ago",
    },
    {
      id: "2",
      type: "added",
      title: "Added new plant to collection",
      timeAgo: "Yesterday",
    },
    {
      id: "3",
      type: "moved",
      title: "Moved Orchid to sunnier spot",
      timeAgo: "2 days ago",
    },
  ],
};

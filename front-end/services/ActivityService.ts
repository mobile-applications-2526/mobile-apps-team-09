import api from "@/services/apiService";

export enum ActivityType {
  PLANT_ADDED = "plant_added",
  DIAGNOSIS = "diagnosis",
  WATERED = "watered",
}

export interface Activity {
  id: number;
  user_id: number;
  plant_id: number | null;
  diagnosis_id: number | null;
  activity_type: ActivityType;
  title: string | null;
  created_at: string; // ISO string from backend
}

export const getActivitiesByUserId = async (
  userId: number
): Promise<Activity[]> => {
  try {
    const response = await api.get(`/activities/user/${userId}`);
    return response.data || [];
  } catch (error: any) {
    // If 404 or no activities, return empty array (not an error)
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Error fetching activities:", error);
    // For other errors, still return empty array to prevent UI errors
    return [];
  }
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString();
};

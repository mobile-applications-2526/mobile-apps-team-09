import api from "./apiService";

/**
 * Custom error for profile not found (404)
 */
export class ProfileNotFoundError extends Error {
  constructor(message: string = "Profile not found") {
    super(message);
    this.name = "ProfileNotFoundError";
  }
}

/**
 * Backend profile response matching the ProfileResponse schema
 */
export interface ProfileBackendResponse {
  id: number;
  user_id: number;
  full_name: string | null;
  tagline: string | null;
  age: number | null;
  experience_level: string | null;
  experience_start_date: string | null;
  living_situation: string | null;
  plant_count: number;
  care_rate: number;
  created_at: string;
  updated_at: string;
}

/**
 * Request body for creating/updating a profile
 */
export interface ProfileUpdateRequest {
  tagline?: string;
  age?: number;
  living_situation?: string;
  experience_level?: string;
  experience_start_date?: string;
}

/**
 * Get a user's profile by user ID
 */
export const getProfileByUserId = async (
  userId: number
): Promise<ProfileBackendResponse> => {
  try {
    const response = await api.get<ProfileBackendResponse>(
      `/profiles/user/${userId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        throw new ProfileNotFoundError();
      }
      throw new Error(`Failed to fetch profile: ${status}`);
    }
    throw new Error("Failed to fetch profile: Network error");
  }
};

/**
 * Create a new profile for a user
 */
export const createProfile = async (
  userId: number,
  profileData: ProfileUpdateRequest
): Promise<ProfileBackendResponse> => {
  try {
    const response = await api.post<ProfileBackendResponse>(
      `/profiles/user/${userId}`,
      profileData
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        throw new Error("Profile already exists for this user");
      }
      if (status === 403) {
        throw new Error("You don't have permission to create this profile");
      }
      if (status === 422) {
        const detail = data?.detail || "Validation error";
        throw new Error(`Validation failed: ${JSON.stringify(detail)}`);
      }
      throw new Error(`Failed to create profile: ${status}`);
    }
    throw new Error("Failed to create profile: Network error");
  }
};

/**
 * Update an existing profile
 */
export const updateProfile = async (
  userId: number,
  profileData: ProfileUpdateRequest
): Promise<ProfileBackendResponse> => {
  try {
    const response = await api.put<ProfileBackendResponse>(
      `/profiles/user/${userId}`,
      profileData
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        throw new Error("Profile not found");
      }
      if (status === 403) {
        throw new Error("You don't have permission to update this profile");
      }
      throw new Error(`Failed to update profile: ${status}`);
    }
    throw new Error("Failed to update profile: Network error");
  }
};

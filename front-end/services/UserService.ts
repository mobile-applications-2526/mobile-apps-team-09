import api from "./apiService";
import * as SecureStore from "expo-secure-store";

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  username: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });

    // Save the token and user info to secure storage
    if (response.data.access_token) {
      await SecureStore.setItemAsync(
        "access_token",
        response.data.access_token
      );
      await SecureStore.setItemAsync(
        "user_id",
        response.data.user_id.toString()
      );
      await SecureStore.setItemAsync("username", response.data.username);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (
        status === 401 ||
        (data && data.message?.toLowerCase().includes("invalid"))
      ) {
        throw new Error("Login failed: Invalid username or password");
      }
      throw new Error(`Login failed: ${status}`);
    } else {
      throw new Error("Login failed: Network error");
    }
  }
};

/**
 * Get the current user's ID from secure storage
 */
export const getCurrentUserId = async (): Promise<number | null> => {
  try {
    const userId = await SecureStore.getItemAsync("user_id");
    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

/**
 * Get the current username from secure storage
 */
export const getCurrentUsername = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync("username");
  } catch (error) {
    console.error("Error getting username:", error);
    return null;
  }
};

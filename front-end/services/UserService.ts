import { User, UserUpdateRequest, UserResponse, UserRegisterData } from "@/types/user";
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

export const getCurrentUserInfo = async (userId: number): Promise<User | undefined> => {
  try {
    const response = await api.get<UserResponse>(`/users/${userId}`)
    return response.data
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response
      if (status == 400) {
        throw new Error(`Failed to fetch user info: ${data}`)
      }
    }
    throw new Error("Failed to fetch user info: Network error")
  }
}

export const updateUserInfo = async (userId: number, userInfo: UserUpdateRequest): Promise<User | undefined> => {
  try {
    console.log('Updating user:', userId, 'with data:', userInfo);
    const response = await api.put<UserResponse>(`/users/${userId}`, userInfo);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        throw new Error(`Failed to update user info: ${JSON.stringify(data.detail || data)}`);
      }
      if (status === 403) {
        throw new Error("You don't have permission to update this user");
      }
      if (status === 404) {
        throw new Error("User not found");
      }
      throw new Error(`Failed to update user info: ${status}`);
    }
    throw new Error(`Failed to update user info: ${error.message || 'Network error'}`);
  }
};


export const registerUser = async (userData: UserRegisterData): Promise<User | undefined> => {
  try {
    const response = await api.post<UserResponse>(`/auth/register`, userData);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Request details:', {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
    });

    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        // Handle validation errors
        const errorMessage = data.detail || JSON.stringify(data);
        throw new Error(`Registration failed: ${errorMessage}`);
      }

      if (status === 405) {
        throw new Error("Registration endpoint not available. Please check API configuration.");
      }

      if (status === 409) {
        throw new Error("Username or email already exists");
      }

      throw new Error(`Registration failed: ${status}`);
    }

    throw new Error(error.message || 'Registration failed: Network error');
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

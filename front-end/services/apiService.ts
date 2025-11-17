import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No access token found in SecureStore");
      }
    } catch (error) {
      console.error("Error reading token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;

      // Handle authentication errors
      if (status === 401 || status === 403) {
        console.error("Authentication error:", status, error.response.data);

        // Clear invalid token
        try {
          await SecureStore.deleteItemAsync("access_token");
          console.log("Cleared invalid access token");
        } catch (e) {
          console.error("Error clearing token:", e);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

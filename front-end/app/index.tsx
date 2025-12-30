import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has seen the app before
        const hasSeenIntro = await SecureStore.getItemAsync("hasSeenIntro");

        if (!hasSeenIntro) {
          // First-time user, show intro/onboarding
          router.replace("/firstTimeInfo");
          return;
        }

        // Returning user - check for auth token
        const token = await SecureStore.getItemAsync("access_token");

        if (token) {
          // User is logged in, go to main app
          router.replace("/(tabs)/overview");
        } else {
          // No token, go to login
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // On error, default to login
        router.replace("/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

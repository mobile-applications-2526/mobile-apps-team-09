import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../services/apiService";
import { updateProfile } from "@/services/ProfileService";
import { getCurrentUserId } from "@/services/UserService";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { COLORS } from "@/constants/colors";
import {
  WeatherData,
  Plant,
  calculatePlantsNeedingAttention,
  getWeatherCondition,
} from "@/utils/plantHelpers";
import { UserHeader } from "@/components/home/UserHeader";
import { WeatherWidget } from "@/components/home/WeatherWidget";
import { AttentionCards } from "@/components/home/AttentionCards";
import { PlantCarousel } from "@/components/home/PlantCarousel";

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  plants: Plant[];
}

export default function Overview() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 20,
    condition: "Sunny",
    humidity: 55,
    location: "Loading...",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [plantsNeedingAttention, setPlantsNeedingAttention] = useState<Plant[]>(
    []
  );

  const fetchWeatherData = useCallback(async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addresses[0];
      const locationName = address?.city || address?.region || "Your Location";
      const city = address?.city || address?.subregion;
      const country = address?.country;

      // Save location to SecureStore for profile creation form
      if (city && country) {
        try {
          await SecureStore.setItemAsync("detected_city", city);
          await SecureStore.setItemAsync("detected_country", country);
        } catch (err) {
          console.log("Failed to save location to SecureStore:", err);
        }

        // Update profile location in background if profile exists
        getCurrentUserId().then((userId) => {
          if (userId) {
            updateProfile(userId, { city, country }).catch((err) => {
              // Silently fail if profile doesn't exist yet
              if (err.response?.status !== 404) {
                console.log("Background profile location update failed:", err);
              }
            });
          }
        });
      }

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=celsius&timezone=auto`
      );

      const weatherData = await weatherResponse.json();

      if (weatherData.current) {
        const weatherCode = weatherData.current.weather_code;
        const condition = getWeatherCondition(weatherCode);

        setWeather({
          temperature: Math.round(weatherData.current.temperature_2m),
          humidity: weatherData.current.relative_humidity_2m,
          condition,
          location: locationName,
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather({
        temperature: 20,
        condition: "Unknown",
        humidity: 55,
        location: "Unable to load",
      });
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        fetchWeatherData();
      } else {
        Alert.alert(
          "Location Permission Required",
          "We need your location to show accurate weather information for your plants.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Grant Permission", onPress: requestLocationPermission },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  }, [fetchWeatherData]);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get<User>("/users/me");
      console.log("User data received:", response.data);
      console.log("Number of plants:", response.data.plants?.length || 0);
      if (response.data.plants && response.data.plants.length > 0) {
        console.log("First plant data:", response.data.plants[0]);
        console.log(
          "First plant image_url:",
          response.data.plants[0].image_url
        );
      }
      setUser(response.data);

      const needsAttention = calculatePlantsNeedingAttention(
        response.data.plants
      );
      setPlantsNeedingAttention(needsAttention);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    requestLocationPermission();
  }, [fetchUserData, requestLocationPermission]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchUserData(), fetchWeatherData()]);
    setRefreshing(false);
  }, [fetchUserData, fetchWeatherData]);

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primaryLight]}
            tintColor={COLORS.primaryLight}
          />
        }
      >
        <UserHeader
          fullName={user.full_name}
          username={user.username}
          plantCount={user.plants.length}
        />

        <WeatherWidget weather={weather} />

        <AttentionCards plants={plantsNeedingAttention} />

        <PlantCarousel plants={user.plants} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { COLORS } from "@/constants/colors";
import {
  WeatherData,
  getWeatherIcon,
  getWeatherRecommendations,
} from "@/utils/plantHelpers";

interface WeatherWidgetProps {
  weather: WeatherData;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const tempPulseAnim = useRef(new Animated.Value(1)).current;
  const tempGlowAnim = useRef(new Animated.Value(0)).current;
  const weatherIconRotate = useRef(new Animated.Value(0)).current;
  const weatherIconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(tempPulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(tempPulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(tempGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(tempGlowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(weatherIconRotate, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(weatherIconScale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(weatherIconScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [tempPulseAnim, tempGlowAnim, weatherIconRotate, weatherIconScale]);

  const weatherIconData = getWeatherIcon(weather.condition);
  const recommendations = getWeatherRecommendations(weather);

  return (
    <View style={styles.weatherCard}>
      {/* Main Weather Info */}
      <View style={styles.weatherMainContent}>
        {/* Animated Weather Icon */}
        <Animated.View
          style={[
            styles.weatherIconContainer,
            {
              transform: [
                {
                  rotate: weatherIconRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
                { scale: weatherIconScale },
              ],
            },
          ]}
        >
          <IconSymbol
            name={weatherIconData.name as any}
            size={64}
            color={weatherIconData.color}
          />
        </Animated.View>

        {/* Weather Info Column */}
        <View style={styles.weatherInfoColumn}>
          {/* Condition */}
          <Text style={styles.condition}>{weather.condition}</Text>

          {/* Humidity Row */}
          <View style={styles.humidityRow}>
            <IconSymbol name="drop.fill" size={18} color="#60A5FA" />
            <Text style={styles.humidityPercent}>{weather.humidity}%</Text>
          </View>

          {/* Location */}
          {weather.location && (
            <View style={styles.locationRow}>
              <IconSymbol
                name="location.fill"
                size={14}
                color="rgba(255, 255, 255, 0.7)"
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {weather.location}
              </Text>
            </View>
          )}
        </View>

        {/* Creative Temperature Display */}
        <Animated.View
          style={[
            styles.tempDisplay,
            {
              opacity: tempGlowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.tempNumberContainer,
              {
                transform: [{ scale: tempPulseAnim }],
              },
            ]}
          >
            <Text style={styles.tempNumber}>{weather.temperature}</Text>
            <Text style={styles.tempDegree}>°</Text>
          </Animated.View>
          <View style={styles.tempUnit}>
            <Text style={styles.tempUnitText}>CELSIUS</Text>
          </View>
        </Animated.View>
      </View>

      {/* Recommendations */}
      {recommendations.map((rec, index) => (
        <View key={index} style={styles.simpleRecommendation}>
          <View style={[styles.recIcon, { backgroundColor: `${rec.color}18` }]}>
            <IconSymbol name={rec.icon as any} size={20} color={rec.color} />
          </View>
          <View style={styles.recTextContainer}>
            <Text style={styles.recTitle}>{rec.title}</Text>
            <Text style={styles.recAction}>{rec.action}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  weatherCard: {
    backgroundColor: COLORS.secondary,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 28,
    padding: 24,
  },
  weatherMainContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  weatherIconContainer: {
    marginRight: 16,
  },
  weatherInfoColumn: {
    flex: 1,
  },
  condition: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  humidityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  humidityPercent: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 6,
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 4,
    fontWeight: "500",
  },
  tempDisplay: {
    alignItems: "center",
    marginLeft: 12,
  },
  tempNumberContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tempNumber: {
    fontSize: 56,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 56,
  },
  tempDegree: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 4,
  },
  tempUnit: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  tempUnitText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  simpleRecommendation: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
    alignItems: "center",
  },
  recIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recTextContainer: {
    flex: 1,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  recAction: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 16,
  },
});

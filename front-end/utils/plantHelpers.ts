import { COLORS } from "@/constants/colors";

export interface Plant {
  id: number;
  plant_name: string;
  location: string | null;
  image_url: string | null;
  last_watered: string | null;
  species: PlantSpecies;
  user_id: number;
  species_id: number;
}

export interface PlantSpecies {
  id: number;
  common_name: string;
  scientific_name: string;
  watering_frequency_days: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  location?: string;
}

export interface WeatherRecommendation {
  icon: string;
  title: string;
  action: string;
  color: string;
}

// Get plant status based on watering schedule
export const getPlantStatus = (plant: Plant) => {
  if (!plant.last_watered) {
    return { status: "Needs water", color: COLORS.skyLight };
  }

  const today = new Date();
  const lastWatered = new Date(plant.last_watered);
  const daysSinceWatered = Math.floor(
    (today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceWatered >= plant.species.watering_frequency_days) {
    return { status: "Needs water", color: COLORS.urgentRed };
  } else if (daysSinceWatered >= plant.species.watering_frequency_days - 1) {
    return { status: "Water soon", color: COLORS.warningOrange };
  }
  return { status: "Healthy", color: COLORS.healthyGreen };
};

// Get weather icon based on condition
export const getWeatherIcon = (condition: string) => {
  const cond = condition.toLowerCase();
  if (cond.includes("rain")) {
    return { name: "cloud.rain.fill", color: "#60A5FA" };
  } else if (cond.includes("cloud")) {
    return { name: "cloud.fill", color: "#94A3B8" };
  } else if (cond.includes("snow")) {
    return { name: "snowflake", color: "#DBEAFE" };
  } else if (cond.includes("fog")) {
    return { name: "cloud.fog.fill", color: "#94A3B8" };
  } else if (cond.includes("storm")) {
    return { name: "cloud.bolt.rain.fill", color: "#64748B" };
  } else {
    // Sunny/Clear
    return { name: "sun.max.fill", color: "#FDB022" };
  }
};

// Generate smart recommendations based on weather
export const getWeatherRecommendations = (
  weather: WeatherData
): WeatherRecommendation[] => {
  const recommendations: WeatherRecommendation[] = [];

  // Temperature-based plant care recommendations
  if (weather.temperature > 30) {
    recommendations.push({
      icon: "sun.max.fill",
      title: "Hot Weather Alert",
      action: "Water plants more frequently, provide shade",
      color: COLORS.warningOrange,
    });
  } else if (weather.temperature < 10) {
    recommendations.push({
      icon: "snowflake",
      title: "Cold Weather",
      action: "Bring sensitive plants indoors",
      color: COLORS.skyBlue,
    });
  }

  // Humidity-based plant recommendations
  if (weather.humidity < 40) {
    recommendations.push({
      icon: "drop.fill",
      title: "Low Humidity",
      action: "Mist tropical plants or use a humidifier",
      color: COLORS.skyBlue,
    });
  } else if (weather.humidity > 70) {
    recommendations.push({
      icon: "wind",
      title: "High Humidity",
      action: "Ensure good air circulation to prevent mold",
      color: COLORS.primaryGreen,
    });
  }

  // Weather condition recommendations
  if (weather.condition.toLowerCase().includes("rain")) {
    recommendations.push({
      icon: "cloud.rain.fill",
      title: "Rainy Day",
      action: "Skip watering outdoor plants today",
      color: COLORS.skyBlue,
    });
  } else if (
    weather.condition.toLowerCase().includes("sunny") ||
    weather.condition.toLowerCase().includes("clear")
  ) {
    if (weather.temperature > 25) {
      recommendations.push({
        icon: "sun.max.fill",
        title: "Strong Sunlight",
        action: "Move sensitive plants away from direct sun",
        color: COLORS.sunGold,
      });
    } else {
      recommendations.push({
        icon: "leaf.fill",
        title: "Ideal Growing Conditions",
        action: "Perfect day for repotting or pruning",
        color: COLORS.healthyGreen,
      });
    }
  }

  // Default recommendation if none apply
  if (recommendations.length === 0) {
    recommendations.push({
      icon: "leaf.fill",
      title: "Perfect Plant Weather",
      action: "Great conditions for plant growth!",
      color: COLORS.healthyGreen,
    });
  }

  return recommendations.slice(0, 2); // Show max 2 recommendations
};

// Calculate plants needing attention
export const calculatePlantsNeedingAttention = (plants: Plant[]): Plant[] => {
  const today = new Date();
  const needsAttention = plants.filter((plant) => {
    if (!plant.last_watered) return true;

    const lastWatered = new Date(plant.last_watered);
    const daysSinceWatered = Math.floor(
      (today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceWatered >= plant.species.watering_frequency_days;
  });

  return needsAttention;
};

// Get user initials from name
export const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Get weather condition from WMO code
export const getWeatherCondition = (code: number): string => {
  // WMO Weather interpretation codes
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Rainy";
  if (code <= 86) return "Snowy";
  return "Stormy";
};

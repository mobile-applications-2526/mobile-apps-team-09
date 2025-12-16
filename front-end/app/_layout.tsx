import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Initial route - checks auth and redirects */}
        <Stack.Screen name="index" />

        {/* Auth screens */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="create-profile" />

        {/* Onboarding */}
        <Stack.Screen name="(home)" />
        <Stack.Screen name="firstTimeInfo" />

        {/* Main app */}
        <Stack.Screen name="(tabs)" />

        {/* Other */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

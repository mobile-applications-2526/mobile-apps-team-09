import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { Image } from "expo-image";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { login } from "@/services/UserService";

const DEV_MODE = true;

// Decode JWT token and check if it's expired
const decodeToken = (token: string): { exp?: number;[key: string]: any } | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

export default function HomeScreen() {
  const router = useRouter();

  // useEffect(() => {
  //   if (DEV_MODE) {
  //     const autoLogin = async () => {
  //       try {
  //         // await login("test", "test1234");
  //         await login("margaret", "margaret123");
  //         router.replace("/(tabs)/overview");
  //       } catch (error) {
  //         console.error("Dev auto-login failed:", error);
  //       }
  //     };
  //     autoLogin();
  //   }
  // }, [router]);

  const handleArrowPress = () => {
    router.push("/firstTimeInfo");
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("access_token");

      if (token) {
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.log("Token has expired");
          await SecureStore.deleteItemAsync("access_token");
          router.replace("/login");
        } else {
          const decoded = decodeToken(token);
          console.log("Token is valid. User:", decoded?.sub || "Unknown");
          router.replace("/(tabs)/overview");
        }
      } else {
        await SecureStore.deleteItemAsync("access_token");
        router.replace("/login");
      }
    };
    checkToken();
  }, [router]);

  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />

      <ThemedView
        style={styles.titleContainer}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            fontSize: 32,
            color: "black",
            textAlign: "center",
          }}
        >
          Enjoy your life{"\n"}
          with plants
        </ThemedText>

        <Pressable onPress={handleArrowPress}>
          <Image
            source={require("@/assets/images/arrow-right.png")}
            style={styles.arrow}
            contentFit="contain"
          />
        </Pressable>
      </ThemedView>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  arrow: {
    width: 50,
    height: 50,
  },
});

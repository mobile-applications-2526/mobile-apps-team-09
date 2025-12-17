import React, { useRef } from "react";
import {
  Platform,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { login } from "../services/UserService";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginInput } from "@/components/auth/LoginInput";
import { LoginButton } from "@/components/auth/LoginButton";
import { SocialDivider } from "@/components/auth/SocialDivider";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { SignUpPrompt } from "@/components/auth/SignUpPrompt";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loggingIn, setLoggingIn] = React.useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  async function handleLogin() {
    setLoggingIn(true);
    try {
      const response = await login(username, password);
      if (!response) {
        Alert.alert("Error", "Username and password do not match");
        return;
      }
      router.replace("/(tabs)/overview");
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during login");
    }
  }

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google login not implemented yet");
  };

  const handleFacebookLogin = () => {
    Alert.alert("Facebook Login", "Facebook login not implemented yet");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.topSection}>
        <LoginHeader
          title="Welcome Back"
          subtitle="Enter your details to continue"
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? -60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          keyboardDismissMode="on-drag"
        >
          <View style={styles.contentContainer}>
            <LoginInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder=""
              autoCapitalize="none"
            />

            <LoginInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder=""
              secureTextEntry
            />
            <LoginButton title="Sign In" onPress={handleLogin} isLoading={loggingIn} />

            <SocialDivider />

            <SocialLoginButtons
              onGooglePress={handleGoogleLogin}
              onFacebookPress={handleFacebookLogin}
            />

            <SignUpPrompt onPress={handleSignUp} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#D2EFDA",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  keyboardView: {
    flex: 3,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    minHeight: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 58,
    borderTopRightRadius: 58,
    padding: 30,
    paddingTop: 50,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

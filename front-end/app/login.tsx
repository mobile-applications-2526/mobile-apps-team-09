import React, { useRef } from "react";
import {
  Platform,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { login } from "../services/UserService";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginInput } from "@/components/auth/LoginInput";
import { LoginButton } from "@/components/auth/LoginButton";
import { SocialDivider } from "@/components/auth/SocialDivider";
import { SignUpPrompt } from "@/components/auth/SignUpPrompt";
import { StatusMessage } from "@/components/auth/StatusMessage";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [statusMessage, setStatusMessage] = React.useState("");
  const [statusType, setStatusType] = React.useState<"error" | "success">(
    "error"
  );
  const [showStatus, setShowStatus] = React.useState(false);
  const [loggingIn, setLoggingIn] = React.useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  async function handleLogin() {
    // Clear previous messages
    setShowStatus(false);

    // Validate inputs
    if (!username && !password) {
      setStatusMessage("Please fill in all fields.");
      setStatusType("error");
      setShowStatus(true);
      return;
    }

    if (!username) {
      setStatusMessage("Username is required.");
      setStatusType("error");
      setShowStatus(true);
      return;
    }

    if (!password) {
      setStatusMessage("Password is required.");
      setStatusType("error");
      setShowStatus(true);
      return;
    }

    setLoggingIn(true);
    
    try {
      const response = await login(username, password);
      if (!response) {
        setStatusMessage("Incorrect username or password.");
        setStatusType("error");
        setShowStatus(true);
        return;
      }

      // Show success message
      setStatusMessage("Welcome back! Taking you to your garden...");
      setStatusType("success");
      setShowStatus(true);

      // Redirect after a brief delay to show the success message
      setTimeout(() => {
        router.replace("/(tabs)/overview");
      }, 1700);
    } catch (error: any) {
      console.log("Login error:", error);
      
      let friendlyMessage = "Incorrect username or password.";

      if (
        error.message?.includes("Network") ||
        error.message?.includes("fetch")
      ) {
        friendlyMessage = "Unable to connect. Check your internet connection.";
      }

      setStatusMessage(friendlyMessage);
      setStatusType("error");
      setShowStatus(true);
    }
  }

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.topSection}>
        <LoginHeader
          title="Welcome Back"
          subtitle="Enter your details to continue"
          statusMessage={statusMessage}
          statusType={statusType}
          showStatus={showStatus}
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
              testID="username-input"
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder=""
              autoCapitalize="none"
            />

            <LoginInput
              testID="password-input"
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder=""
              secureTextEntry
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({
                    y: 100,
                    animated: true,
                  });
                }, 100);
              }}
            />
            <LoginButton testID="signin-button" title="Sign In" onPress={handleLogin} isLoading={loggingIn} />

            <SocialDivider />

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
    borderBottomLeftRadius: 58,
    borderBottomRightRadius: 58,
    overflow: "hidden",
  },
  topSection: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  keyboardView: {
    flex: 2.4,
    borderTopLeftRadius: 58,
    borderTopRightRadius: 58,
    overflow: "hidden",
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
    borderBottomWidth: 1,
    borderColor: "#000000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
});

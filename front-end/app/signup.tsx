import React, { useRef } from "react";
import {
  Platform,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SignupHeader } from "@/components/auth/SignupHeader";
import { LoginInput } from "@/components/auth/LoginInput";
import { LoginButton } from "@/components/auth/LoginButton";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { login, registerUser } from "@/services/UserService";
import { SocialDivider } from "@/components/auth/SocialDivider";
import { StatusMessage } from "@/components/auth/StatusMessage";
import { Fonts } from "@/constants/theme";

export default function Signup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rePassword, setRePassword] = React.useState("");
  const [statusMessage, setStatusMessage] = React.useState("");
  const [statusType, setStatusType] = React.useState<"error" | "success">(
    "error"
  );
  const [showStatus, setShowStatus] = React.useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [loading, setLoading] = React.useState(false);

  async function handleLogin() {
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

  async function handleSignup() {
    // Clear previous messages
    setShowStatus(false);

    // Validate all fields first
    if (!name && !email && !username && !password && !rePassword) {
      setStatusMessage("All fields are required.");
      setStatusType("error");
      setShowStatus(true);
      return;
    }

    // Then check individual fields
    if (!name) {
      setStatusMessage("Name is required.");
      setStatusType("error");
      setShowStatus(true);
      return;
    }

    if (!email) {
      setStatusMessage("Email is required.");
      setStatusType("error");
      setShowStatus(true);
      return;
    }

    // Basic email sanity check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatusMessage("Please enter a valid email address.");
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

    if (!rePassword) {
      setStatusMessage("Please confirm your password.");
      setStatusType("error");
      setShowStatus(true);
      return;
    }

    if (password !== rePassword) {
      setStatusMessage("Passwords do not match.");
      setStatusType("error");
      setShowStatus(true);
      return;
    }

    setLoading(true);
    try {
      const newUser = await registerUser({
        full_name: name,
        email,
        username,
        password,
      });

      if (newUser) {
        setStatusMessage("Account created! Logging you in...");
        setStatusType("success");
        setShowStatus(true);

        setTimeout(() => {
          handleLogin();
        }, 1500);
      } else {
        setStatusMessage("Registration failed. Please try again.");
        setStatusType("error");
        setShowStatus(true);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      let friendlyMessage = "An unexpected error occurred.";

      if (
        err?.message?.includes("already exists") ||
        err?.message?.includes("duplicate")
      ) {
        friendlyMessage = "Username or email already exists.";
      } else if (
        err?.message?.includes("Network") ||
        err?.message?.includes("fetch")
      ) {
        friendlyMessage = "Unable to connect. Check your internet connection.";
      }

      setStatusMessage(friendlyMessage);
      setStatusType("error");
      setShowStatus(true);
    } finally {
      setLoading(false);
    }
  }

  const redirectLogin = () => {
    router.replace("/login");
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.topSection}>
        <Text style={styles.subtitle}>Enter your details to continue</Text>
        <StatusMessage
          message={statusMessage}
          type={statusType}
          visible={showStatus}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentContainer}>
            <LoginInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder=""
              autoCapitalize="words"
            />

            <LoginInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder=""
              autoCapitalize="none"
            />

            <LoginInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder=""
              autoCapitalize="none"
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({
                    y: 50,
                    animated: true,
                  });
                }, 100);
              }}
            />

            <LoginInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder=""
              secureTextEntry
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({
                    y: 120,
                    animated: true,
                  });
                }, 100);
              }}
            />

            <LoginInput
              label="Re-password"
              value={rePassword}
              onChangeText={setRePassword}
              placeholder=""
              secureTextEntry
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({
                    y: 180,
                    animated: true,
                  });
                }, 100);
              }}
            />

            <LoginButton title="Register" onPress={handleSignup} />

            <SocialDivider />

            <LoginPrompt onPress={redirectLogin} />
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
    flex: 2.3,
    backgroundColor: "#D2EFDA",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    color: "#0F4336",
    textAlign: "center",
    marginBottom: 5,
  },
  keyboardView: {
    flex: 14,
    borderTopLeftRadius: 58,
    borderTopRightRadius: 58,
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
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

import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SignupHeader } from "@/components/auth/SignupHeader";
import { LoginInput } from "@/components/auth/LoginInput";
import { LoginButton } from "@/components/auth/LoginButton";
import { SocialDivider } from "@/components/auth/SocialDivider";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { login, registerUser } from "@/services/UserService";

export default function Signup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rePassword, setRePassword] = React.useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
    if (!name || !email || !username || !password || !rePassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== rePassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // basic email sanity check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
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
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => handleLogin(),
          },
        ]);
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      let message = "An unexpected error occurred";

      if (err?.message) {
        message = err.message;
      } else if (err?.response?.data?.detail) {
        message = err.response.data.detail;
      }

      Alert.alert("Registration Error", message);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignup = () => {
    Alert.alert("Google Signup", "Google signup not implemented yet");
  };

  const handleFacebookSignup = () => {
    Alert.alert("Facebook Signup", "Facebook signup not implemented yet");
  };

  const redirectLogin = () => {
    router.replace('/login')
  }

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.topSection} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentContainer}>
            <SignupHeader subtitle="Enter your details to continue" />

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
            />

            <LoginInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder=""
              secureTextEntry
            />

            <LoginInput
              label="Re-password"
              value={rePassword}
              onChangeText={setRePassword}
              placeholder=""
              secureTextEntry
            />

            <LoginButton title="Register" onPress={handleSignup} />

            <SocialDivider />

            <SocialLoginButtons
              onGooglePress={handleGoogleSignup}
              onFacebookPress={handleFacebookSignup}
            />

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
    flex: 1,
    backgroundColor: "#D2EFDA",
  },
  keyboardView: {
    flex: 14,
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

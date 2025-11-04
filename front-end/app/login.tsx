import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import React from "react";
import {
    Platform,
    StatusBar,
    StyleSheet,
    Dimensions,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    return (
        <ThemedView
            style={styles.mainContainer}
            lightColor="#D2EFDA"
            darkColor="#D2EFDA"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <ThemedView
                        style={styles.loginContainer}
                        lightColor="#D2EFDA"
                        darkColor="#D2EFDA"
                    >
                        <ThemedText style={styles.welcome}>Welcome Back</ThemedText>

                        <ThemedText style={styles.loginText}>Email:</ThemedText>
                        <TextInput
                            style={styles.input}
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <ThemedText style={styles.loginText}>Password:</ThemedText>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Enter your password"
                            secureTextEntry
                        />

                        <Pressable
                            style={({ pressed }) => [
                                styles.signIn,
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                        >
                            <ThemedText style={styles.signInText}>Sign In</ThemedText>
                        </Pressable>
                    </ThemedView>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: "relative",
        backgroundColor: "#D2EFDA",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        fontFamily: Fonts.rounded,
    },
    loginContainer: {
        position: "absolute",
        top: height / 3,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 90,
        borderTopRightRadius: 90,
        borderColor: "#000000ff",
        borderWidth: 1,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    input: {
        height: 50,
        marginVertical: 10,
        marginHorizontal: 12,
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
    },
    loginText: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 16,
    },
    welcome: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#0F4336",
        padding: 22,
        textAlign: "center",
    },
    signIn: {
        marginTop: 20,
        paddingVertical: 15,
        backgroundColor: "#0F4336",
        borderRadius: 25,
        marginHorizontal: 20,
    },
    signInText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 25,
    },
});

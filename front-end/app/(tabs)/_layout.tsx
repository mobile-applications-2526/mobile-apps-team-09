import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2C5F2D",
        tabBarInactiveTintColor: "#99A1AF",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 90 : 70,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "400",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Diagnose",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="stethoscope" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <IconSymbol size={24} name="camera.fill" color="#FFFFFF" />
            </View>
          ),
          tabBarLabel: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: "My Garden",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="leaf.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2D4A3E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
});

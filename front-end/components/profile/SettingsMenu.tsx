import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingsMenuProps {
  visible: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
  position: { x: number; y: number };
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  visible,
  onClose,
  onEditProfile,
  onSettings,
  onLogout,
  position,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[styles.menuContainer, { top: position.y, right: 16 }]}
            >
              {/* Edit Profile */}
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemBorder]}
                onPress={() => {
                  onEditProfile();
                  onClose();
                }}
              >
                <Ionicons name="pencil-outline" size={16} color="#1B5E20" />
                <Text style={styles.menuText}>Edit Profile</Text>
              </TouchableOpacity>

              {/* Settings */}
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemBorder]}
                onPress={() => {
                  onSettings();
                  onClose();
                }}
              >
                <Ionicons name="settings-outline" size={16} color="#1B5E20" />
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onLogout();
                  onClose();
                }}
              >
                <Ionicons name="log-out-outline" size={16} color="#FB2C36" />
                <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    width: 192,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  menuText: {
    fontSize: 16,
    color: "#1B5E20",
    letterSpacing: -0.3,
    fontWeight: "400",
  },
  logoutText: {
    color: "#FB2C36",
  },
});

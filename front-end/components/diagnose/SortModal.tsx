import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type SortOption = "date" | "name" | "severity";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export function SortModal({
  visible,
  onClose,
  currentSort,
  onSelectSort,
}: SortModalProps) {
  const sortOptions: {
    value: SortOption;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { value: "date", label: "Date (Newest First)", icon: "calendar" },
    { value: "name", label: "Plant Name (A-Z)", icon: "text" },
    { value: "severity", label: "Severity (High to Low)", icon: "warning" },
  ];

  const handleSelect = (sort: SortOption) => {
    onSelectSort(sort);
    onClose();
  };

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
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sort By</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#1B5E20" />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsContainer}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionItem,
                      currentSort === option.value && styles.optionItemActive,
                    ]}
                    onPress={() => handleSelect(option.value)}
                  >
                    <View style={styles.optionLeft}>
                      <View
                        style={[
                          styles.iconContainer,
                          currentSort === option.value &&
                            styles.iconContainerActive,
                        ]}
                      >
                        <Ionicons
                          name={option.icon}
                          size={20}
                          color={
                            currentSort === option.value ? "#FFFFFF" : "#558B2F"
                          }
                        />
                      </View>
                      <Text
                        style={[
                          styles.optionLabel,
                          currentSort === option.value &&
                            styles.optionLabelActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                    {currentSort === option.value && (
                      <Ionicons name="checkmark" size={24} color="#558B2F" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1B5E20",
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(85, 139, 47, 0.05)",
  },
  optionItemActive: {
    backgroundColor: "rgba(85, 139, 47, 0.1)",
    borderWidth: 1,
    borderColor: "#558B2F",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(85, 139, 47, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainerActive: {
    backgroundColor: "#558B2F",
  },
  optionLabel: {
    fontSize: 16,
    color: "#1B5E20",
  },
  optionLabelActive: {
    fontWeight: "600",
  },
});

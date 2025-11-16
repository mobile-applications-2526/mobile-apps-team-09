import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

interface PlantPhotoCardProps {
  imageUri: string;
}

export const PlantPhotoCard: React.FC<PlantPhotoCardProps> = ({ imageUri }) => {
  return (
    <View style={styles.photoCard}>
      <Image source={{ uri: imageUri }} style={styles.photoImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  photoCard: {
    width: "100%",
    height: 259,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.cardWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 18,
  },
  photoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

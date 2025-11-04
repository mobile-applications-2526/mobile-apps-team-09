import { ThemedView } from "@/components/themed-view";
import { Platform, StatusBar, StyleSheet } from "react-native";

export default function Overview() {
    return (
        <ThemedView
            style={styles.mainContainer}
            lightColor="#D2EFDA"
            darkColor="#D2EFDA"
        >

        </ThemedView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#D2EFDA',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
})
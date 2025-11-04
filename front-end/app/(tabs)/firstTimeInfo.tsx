import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, StatusBar, Platform } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";

export default function FirstTimeInfo() {
    const router = useRouter();

    const handleArrowPress = () => {
        router.push('/explore');
    };

    return (
        <ThemedView style={styles.mainContainer} lightColor="#D2EFDA" darkColor="#D2EFDA">
            {/* Status bar */}
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#D2EFDA"
                translucent={false}
            />

            <Image
                source={require('@/assets/images/plantInfoScreen.png')}
                style={styles.plant}
                contentFit="contain"
            />

            <ThemedText
                type="title"
                style={styles.titleText}
            >
                Healthy plants
            </ThemedText>

            <ThemedText
                type="default"
                style={styles.descriptionText}
            >
                Taking care of plants can be very rewarding, even if the plant is a fern and doesn't produce fragrant flowers...
            </ThemedText>

            <Pressable onPress={handleArrowPress}>
                <Image
                    source={require('@/assets/images/arrow-right.png')}
                    style={styles.arrow}
                    contentFit="contain"
                />
            </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // avoid overlapping status bar on Android
        gap: 20,
        backgroundColor: '#D2EFDA',
    },
    plant: {
        width: 300,
        height: 300,
    },
    titleText: {
        fontFamily: Fonts.rounded,
        fontSize: 32,
        color: 'black',
        textAlign: 'center',
    },
    descriptionText: {
        fontFamily: Fonts.rounded,
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 20, // optional: prevent text from touching edges
    },
    arrow: {
        width: 50,
        height: 50,
    },
});

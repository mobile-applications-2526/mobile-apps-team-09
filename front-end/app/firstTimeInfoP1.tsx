import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, StatusBar, Platform, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";

export default function FirstTimeInfoP1() {
    const router = useRouter();

    const handleArrowPress = () => {
        router.push('/firstTimeInfoP2');
    };

    return (
        <ThemedView
            style={styles.mainContainer}
            lightColor="#D2EFDA"
            darkColor="#D2EFDA"
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#D2EFDA"
                translucent={false}
            />

            {/* Top-aligned content */}
            <View style={styles.contentContainer}>
                <View style={styles.barContainer}>
                    <Image
                        source={require('@/assets/images/rectangleFull.png')}
                        style={styles.bar}
                        contentFit="contain"
                    />
                    <Image
                        source={require('@/assets/images/rectangleEmpty.png')}
                        style={styles.bar}
                        contentFit="contain"
                    />
                    <Image
                        source={require('@/assets/images/rectangleEmpty.png')}
                        style={styles.bar}
                        contentFit="contain"
                    />
                </View>

                <Image
                    source={require('@/assets/images/plantInfoScreen.png')}
                    style={styles.plant}
                    contentFit="contain"
                />

                <ThemedText type="title" style={styles.titleText}>
                    Healthy plants
                </ThemedText>

                <ThemedText type="default" style={styles.descriptionText}>
                    Taking care of plants can be very rewarding, even if the plant is a fern and doesn't produce fragrant flowers...
                </ThemedText>
            </View>

            {/* Bottom-right arrow */}
            <Pressable onPress={handleArrowPress} style={styles.arrowContainer}>
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
        position: 'relative', // arrow positions relative to this
        backgroundColor: '#D2EFDA',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start', // <— align everything to the top
        alignItems: 'center',
        gap: 20,
        paddingTop: 50, // small top spacing
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
        paddingHorizontal: 20,
    },
    bar: {
        width: '33%',
        height: 40,
    },
    barContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        gap: 4,
        marginTop: 10,
    },
    arrowContainer: {
        position: 'absolute',
        bottom: 30,
        right: 30,
    },
    arrow: {
        width: 50,
        height: 50,
    },
});

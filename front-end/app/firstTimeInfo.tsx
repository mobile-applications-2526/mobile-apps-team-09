import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, StatusBar, Platform, View, Animated } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";
import { useState, useRef } from "react";

export default function FirstTimeInfo() {
    const router = useRouter();
    const [step, setStep] = useState(0); // start at step 0
    const fadeAnim = useRef(new Animated.Value(1)).current; // opacity

    const steps = [
        {
            barStatus: [true, false, false],
            title: "Healthy plants",
            description: "Taking care of plants can be very rewarding, even if the plant is a fern and doesn't produce fragrant flowers...",
            image: require('@/assets/images/plantInfoScreen.png'),
        },
        {
            barStatus: [false, true, false],
            title: "Water regularly",
            description: "This app is designed to help you take better care of your plants, making it easier to keep them healthy and thriving.",
            image: require('@/assets/images/caringPlants.png'),
        },
        {
            barStatus: [false, false, true],
            title: "Give them sunlight",
            description: "Most plants thrive with a few hours of sunlight every day. Observe your plant to find the right spot.",
            image: require('@/assets/images/sunlightPlant.png'),
        },
    ];

    const handleArrowPress = () => {
        if (step === steps.length - 1) {
            router.push('/login');
            return;
        }

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            // After fade out, update step
            setStep(prev => prev + 1);
            // Fade back in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    const currentStep = steps[step];

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

            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                <View style={styles.barContainer}>
                    {currentStep.barStatus.map((filled, index) => (
                        <Image
                            key={index}
                            source={
                                filled
                                    ? require('@/assets/images/rectangleFull.png')
                                    : require('@/assets/images/rectangleEmpty.png')
                            }
                            style={styles.bar}
                            contentFit="contain"
                        />
                    ))}
                </View>

                <Image
                    source={currentStep.image}
                    style={styles.plant}
                    contentFit="contain"
                />

                <ThemedText type="title" style={styles.titleText}>
                    {currentStep.title}
                </ThemedText>

                <ThemedText type="default" style={styles.descriptionText}>
                    {currentStep.description}
                </ThemedText>
            </Animated.View>

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
        position: 'relative',
        backgroundColor: '#D2EFDA',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 20,
        paddingTop: 50,
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

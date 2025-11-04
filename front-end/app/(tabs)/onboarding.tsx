import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, ImageBackground, Dimensions, StatusBar, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { Image } from 'expo-image';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleArrowPress = () => {
    router.push('/firstTimeInfo');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />

      <ThemedView style={styles.titleContainer} lightColor="transparent" darkColor="transparent">
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            fontSize: 32,
            color: 'black',
            textAlign: 'center',
          }}
        >
          Enjoy your life{'\n'}
          with plants
        </ThemedText>

        <Pressable onPress={handleArrowPress}>
          <Image
            source={require('@/assets/images/arrow-right.png')}
            style={styles.arrow}
            contentFit="contain"
          />
        </Pressable>
      </ThemedView>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // push content below status bar
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  arrow: {
    width: 50,
    height: 50,
  },
});

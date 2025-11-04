import { StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { Image } from 'expo-image';

export default function TabTwoScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ThemedView style={styles.titleContainer} lightColor="transparent" darkColor="transparent">
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded, fontSize: 32, color: 'black', textAlign: 'center' }}
        >
          Enjoy your life{'\n'}
          with plants
        </ThemedText>
        <Image
          source={require('@/assets/images/arrow-right.png')}
          style={styles.arrow}
          contentFit="contain"
        />
      </ThemedView>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 80,
  },
  arrow: {
    width: 70,
    height: 70,
  },
});

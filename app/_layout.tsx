import { useEffect } from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { useStore } from '../src/store';
import { Colors, getBubblePalette } from '../src/theme';
import { AppBackground } from '../src/components/AppBackground';
import { BottomNav } from '../src/components/BottomNav';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore duplicate calls during fast refresh.
});

;(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  style: [{ fontFamily: 'Nunito_400Regular' }, (Text as any).defaultProps?.style],
};

;(TextInput as any).defaultProps = {
  ...(TextInput as any).defaultProps,
  style: [{ fontFamily: 'Nunito_400Regular' }, (TextInput as any).defaultProps?.style],
};

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const initialize = useStore(s => s.initialize);
  const bubbles = useStore(s => s.bubbles);
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });
  const showBottomNav = pathname !== '/add-contact/manual' && pathname !== '/profile-edit';
  const activeTab = pathname.startsWith('/add-contact')
    ? 'add'
    : pathname === '/profile' || pathname === '/profile-edit'
      ? 'profile'
      : 'bubbles';
  const bubbleDetailMatch = pathname.match(/^\/bubble\/(.+)$/);
  const activeBubble = bubbleDetailMatch
    ? bubbles.find(b => b.id === decodeURIComponent(bubbleDetailMatch[1]))
    : undefined;
  const activeBackgroundColors = activeBubble
    ? getBubblePalette(activeBubble.colorKey).colors
    : undefined;

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
        // Ignore hide failures during fast refresh.
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppBackground backgroundColors={activeBackgroundColors}>
          <View style={styles.appShell}>
            <View style={styles.content}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'transparent' },
                  animation: 'none',
                }}
              >
                <Stack.Screen name="(main)" />
                <Stack.Screen name="bubble/[id]" />
                <Stack.Screen name="contact/[id]" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="profile-edit" />
                <Stack.Screen name="add-contact" />
              </Stack>
            </View>

            {showBottomNav ? (
              <BottomNav
                active={activeTab}
                backgroundColors={activeBackgroundColors}
                onPress={tab => {
                  if (tab === 'bubbles') router.navigate('/');
                  else if (tab === 'add') router.navigate('/add-contact/manual');
                  else router.navigate('/profile');
                }}
              />
            ) : null}
          </View>
        </AppBackground>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.appBg,
  },
  appShell: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

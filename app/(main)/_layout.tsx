import { Stack } from 'expo-router';
import { Colors } from '../../src/theme';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.appBg },
        animation: 'none',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

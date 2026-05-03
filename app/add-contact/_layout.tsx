import { Stack } from 'expo-router';
import { Colors } from '../../src/theme';

export default function AddContactLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.appBg },
        animation: 'none',
      }}
    >
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="manual" />
      <Stack.Screen name="paste" />
      <Stack.Screen name="photo" />
    </Stack>
  );
}

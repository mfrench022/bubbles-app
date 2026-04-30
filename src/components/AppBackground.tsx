import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AppBackgroundProps {
  children: React.ReactNode;
  backgroundColors?: readonly [string, string];
}

export function AppBackground({ children, backgroundColors }: AppBackgroundProps) {
  const colors = backgroundColors ?? ['#fbf8f3', '#f3eee6'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.length === 2 ? [colors[0], colors[1], colors[1]] : colors}
        start={{ x: 0.12, y: 0.08 }}
        end={{ x: 0.84, y: 0.92 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.03)']}
        start={{ x: 0.18, y: 0.08 }}
        end={{ x: 0.84, y: 0.84 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4ee',
  },
});

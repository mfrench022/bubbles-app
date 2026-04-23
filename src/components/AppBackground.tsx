import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AppBackgroundProps {
  children: React.ReactNode;
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#d7d8d6', '#b8c2cc', '#8893a1', '#54606e']}
        start={{ x: 0.02, y: 0.01 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
        start={{ x: 0.03, y: 0.02 }}
        end={{ x: 0.56, y: 0.48 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(151,170,189,0)', 'rgba(182,197,213,0.2)', 'rgba(69,81,96,0.3)']}
        start={{ x: 0.22, y: 0.18 }}
        end={{ x: 0.82, y: 0.92 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.1)', 'rgba(103,118,137,0.08)', 'rgba(44,55,71,0.3)']}
        start={{ x: 0.72, y: 0.06 }}
        end={{ x: 0.18, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cfd4d9',
  },
});

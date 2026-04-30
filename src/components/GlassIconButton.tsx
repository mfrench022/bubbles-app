import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassIconButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  size?: number;
  /** Optional RGBA color string layered over the glass fill (e.g. active tint) */
  tintColor?: string;
  /** Override border color */
  borderColor?: string;
}

export function GlassIconButton({
  onPress,
  children,
  size = 46,
  tintColor,
  borderColor = 'rgba(255,255,255,0.72)',
}: GlassIconButtonProps) {
  const radius = size / 2;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.shadow, { width: size, height: size, borderRadius: radius }]}
    >
      {/* Separate inner View for overflow:hidden so shadow isn't clipped */}
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { borderRadius: radius, overflow: 'hidden', borderWidth: 1, borderColor }]}
      >
        <BlurView intensity={82} tint="light" style={StyleSheet.absoluteFillObject} />
        <LinearGradient
          colors={['rgba(255,255,255,0.42)', 'rgba(255,255,255,0.10)']}
          style={StyleSheet.absoluteFillObject}
        />
        {tintColor && (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: tintColor }]} />
        )}
        {/* Specular highlight — bright top edge */}
        <LinearGradient
          colors={['rgba(255,255,255,0.90)', 'rgba(255,255,255,0)']}
          style={styles.specular}
        />
      </View>
      <View style={styles.iconWrap}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A5040',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  specular: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

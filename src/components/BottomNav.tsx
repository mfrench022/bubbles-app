import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius } from '../theme';
import { BubblesIcon, AddIcon, ProfileIcon } from './Icons';

type NavTab = 'bubbles' | 'add' | 'profile';

export const BOTTOM_NAV_SHELL_HEIGHT = 78;
export const BOTTOM_NAV_BOTTOM_GUTTER = 10;
export const BOTTOM_NAV_SIDE_PADDING = 14;
export const BOTTOM_NAV_TOP_PADDING = 26;
export const BOTTOM_NAV_SCROLL_CLEARANCE = 46;

interface BottomNavProps {
  active: NavTab;
  onPress: (tab: NavTab) => void;
  backgroundColors?: readonly [string, string];
}

export function useBottomNavInset() {
  const insets = useSafeAreaInsets();
  return (
    BOTTOM_NAV_SHELL_HEIGHT
    + Math.max(insets.bottom, BOTTOM_NAV_BOTTOM_GUTTER)
    + BOTTOM_NAV_SCROLL_CLEARANCE
  );
}

export function useBottomNavDockInset() {
  const insets = useSafeAreaInsets();
  return (
    BOTTOM_NAV_SHELL_HEIGHT
    + Math.max(insets.bottom, BOTTOM_NAV_BOTTOM_GUTTER)
    + BOTTOM_NAV_TOP_PADDING
  );
}

export function BottomNav({ active, onPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, BOTTOM_NAV_BOTTOM_GUTTER);
  return (
    <View pointerEvents="box-none" style={[styles.safeArea, { paddingBottom: bottomInset }]}>
      <View style={styles.shell}>
        {/* High-intensity blur — the core of liquid glass */}
        <BlurView
          pointerEvents="none"
          intensity={82}
          tint="light"
          style={StyleSheet.absoluteFillObject}
        />
        {/* Base glass fill — very low opacity, blur does the work */}
        <LinearGradient
          pointerEvents="none"
          colors={[
            'rgba(255,255,255,0.38)',
            'rgba(255,255,255,0.12)',
            'rgba(255,255,255,0.06)',
          ]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        {/* Specular highlight — bright white band at the very top edge */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0)']}
          locations={[0, 1]}
          style={styles.specularTop}
        />
        {/* Subtle inner darkening at the bottom for glass depth */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.04)']}
          locations={[0, 1]}
          style={styles.depthBottom}
        />

        <TouchableOpacity
          style={[styles.btn, active === 'add' && styles.btnActive]}
          onPress={() => onPress('add')}
          activeOpacity={0.7}
        >
          {active === 'add' && <View style={styles.btnActiveGlass} />}
          <AddIcon size={30} color={active === 'add' ? Colors.text : Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, active === 'bubbles' && styles.btnActive]}
          onPress={() => onPress('bubbles')}
          activeOpacity={0.7}
        >
          {active === 'bubbles' && <View style={styles.btnActiveGlass} />}
          <BubblesIcon size={28} color={active === 'bubbles' ? Colors.text : Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, active === 'profile' && styles.btnActive]}
          onPress={() => onPress('profile')}
          activeOpacity={0.7}
        >
          {active === 'profile' && <View style={styles.btnActiveGlass} />}
          <ProfileIcon size={28} color={active === 'profile' ? Colors.text : Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    paddingHorizontal: BOTTOM_NAV_SIDE_PADDING,
    paddingTop: BOTTOM_NAV_TOP_PADDING,
  },
  shell: {
    position: 'relative',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 390,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: BOTTOM_NAV_SHELL_HEIGHT,
    borderRadius: Radius.full,
    // Transparent base — the blur + gradient layers define the glass body
    backgroundColor: 'rgba(255,255,255,0.10)',
    // Crisp glass edge
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
    // Deep diffuse shadow for physical lift
    shadowColor: '#5A5040',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.26,
    shadowRadius: 52,
    elevation: 20,
  },
  // Specular highlight: 3px band at top simulating direct light on glass surface
  specularTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    borderTopLeftRadius: Radius.full,
    borderTopRightRadius: Radius.full,
  },
  // Subtle bottom darkening adds glass thickness/depth
  depthBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 22,
    borderBottomLeftRadius: Radius.full,
    borderBottomRightRadius: Radius.full,
  },
  btn: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
  },
  btnActive: {
    // Outer shadow on the active button for lift
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  // Frosted glass pill behind the active icon — rendered as a sibling below the icon
  btnActiveGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.54)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.80)',
  },
});

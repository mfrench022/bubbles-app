import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Colors } from '../theme';
import { BubblesIcon, AddIcon, ProfileIcon } from './Icons';

type NavTab = 'bubbles' | 'add' | 'profile';

interface BottomNavProps {
  active: NavTab;
  onPress: (tab: NavTab) => void;
}

export function BottomNav({ active, onPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 0);

  return (
    <View style={styles.safeArea}>
      <View style={[styles.shell, { height: 72 + bottomInset, paddingBottom: bottomInset }]}>
        <BlurView intensity={52} tint="light" style={styles.blur}>
          <View style={styles.surface} />
        </BlurView>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => onPress('bubbles')}
          activeOpacity={0.72}
        >
          <BubblesIcon size={32} color={active === 'bubbles' ? Colors.text : Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.addBtn]}
          onPress={() => onPress('add')}
          activeOpacity={0.72}
        >
          <AddIcon size={34} color={active === 'add' ? Colors.text : Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => onPress('profile')}
          activeOpacity={0.72}
        >
          <ProfileIcon size={32} color={active === 'profile' ? Colors.text : Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flexShrink: 0,
  },
  shell: {
    position: 'relative',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 430,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingTop: 12,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    overflow: 'hidden',
  },
  surface: {
    flex: 1,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.42)',
  },
  btn: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27,
  },
  addBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
});

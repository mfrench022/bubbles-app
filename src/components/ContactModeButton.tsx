import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme';
import { ListDashesIcon } from './Icons';

interface ContactModeButtonProps {
  active: boolean;
  onPress: () => void;
}

export function ContactModeButton({ active, onPress }: ContactModeButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={active ? 'Turn off contact mode' : 'Turn on contact mode'}
      style={[styles.button, active && styles.buttonActive]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <ListDashesIcon color={active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.66)'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 47,
    height: 46,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.iconBtn,
    borderWidth: 1,
    borderColor: Colors.iconBtnBorder,
  },
  buttonActive: {
    backgroundColor: Colors.toggleActive,
    borderColor: 'rgba(118, 167, 255, 0.24)',
  },
});

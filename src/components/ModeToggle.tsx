import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme';

interface ModeToggleProps {
  mode: 'bubble' | 'contact';
  onChange: (mode: 'bubble' | 'contact') => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, mode === 'contact' && styles.btnActive]}
        onPress={() => onChange('contact')}
        activeOpacity={0.8}
      >
        <Text style={[styles.label, mode === 'contact' && styles.labelActive]}>
          Contact Mode
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, mode === 'bubble' && styles.btnActive]}
        onPress={() => onChange('bubble')}
        activeOpacity={0.8}
      >
        <Text style={[styles.label, mode === 'bubble' && styles.labelActive]}>
          Bubble Mode
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 17,
    marginTop: 14,
    padding: 3,
    height: 46,
    backgroundColor: 'rgba(17, 22, 51, 0.74)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 56,
    flexShrink: 0,
    shadowColor: '#01041a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: Colors.toggleActive,
    shadowColor: '#040715',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  labelActive: {
    color: Colors.text,
  },
});

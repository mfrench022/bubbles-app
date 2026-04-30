import React from 'react';
import { Colors } from '../theme';
import { ListDashesIcon } from './Icons';
import { GlassIconButton } from './GlassIconButton';

interface ContactModeButtonProps {
  active: boolean;
  onPress: () => void;
}

export function ContactModeButton({ active, onPress }: ContactModeButtonProps) {
  return (
    <GlassIconButton
      onPress={onPress}
      tintColor={active ? 'rgba(101,89,232,0.22)' : undefined}
      borderColor={active ? 'rgba(101,89,232,0.48)' : 'rgba(255,255,255,0.72)'}
    >
      <ListDashesIcon color={active ? Colors.primarySolid : Colors.textMuted} />
    </GlassIconButton>
  );
}

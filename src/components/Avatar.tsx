import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { initials } from '../store';
import { Colors } from '../theme';

interface AvatarProps {
  name: string;
  color: string;
  image?: string;
  size: number;
  style?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
  showBorder?: boolean;
}

export function Avatar({ name, color, image, size, style, onPress, onLongPress, showBorder = false }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const fontSize = Math.max(10, Math.floor(size * 0.35));
  const borderWidth = showBorder ? Math.max(1.5, size * 0.04) : 0;

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(showBorder && {
      borderWidth,
      borderColor: Colors.thumbnailStroke,
    }),
  };

  const content = image && !imageError ? (
    <Image
      source={{ uri: image }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      onError={() => setImageError(true)}
    />
  ) : (
    <Text style={[styles.initials, { fontSize }]}>
      {initials(name)}
    </Text>
  );

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={[containerStyle, style]}
        activeOpacity={0.8}
        delayLongPress={220}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  initials: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

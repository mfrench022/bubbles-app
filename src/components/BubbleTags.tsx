import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../theme';
import { PlusIcon } from './Icons';

interface BubbleTagsProps {
  labels: string[];
  onAdd?: () => void;
  selectedIds?: Set<string>;
  bubbleIds?: string[];
  onTagPress?: (bubbleId: string) => void;
  style?: ViewStyle;
}

export function BubbleTags({ labels, onAdd, selectedIds, bubbleIds, onTagPress, style }: BubbleTagsProps) {
  return (
    <View style={[styles.container, style]}>
      {labels.map((label, idx) => {
        const isSelected = selectedIds && bubbleIds ? selectedIds.has(bubbleIds[idx]) : false;
        const handlePress = bubbleIds && onTagPress ? () => onTagPress(bubbleIds[idx]) : undefined;
        return (
          <TouchableOpacity
            key={idx}
            style={[styles.tag, isSelected && styles.tagSelected]}
            onPress={handlePress}
            activeOpacity={handlePress ? 0.7 : 1}
            disabled={!handlePress}
          >
            <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
      {onAdd && (
        <TouchableOpacity style={[styles.tag, styles.tagAdd]} onPress={onAdd} activeOpacity={0.7}>
          <PlusIcon size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginHorizontal: 17,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.stroke,
  },
  tagSelected: {
    backgroundColor: Colors.toggleActive,
    borderColor: 'rgba(115, 132, 198, 0.5)',
  },
  tagAdd: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  tagTextSelected: {
    color: Colors.text,
  },
});

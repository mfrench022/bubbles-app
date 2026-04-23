import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Contact } from '../data/contacts';
import { useStore } from '../store';
import { Colors, Radius, Spacing } from '../theme';
import { Avatar } from './Avatar';
import { BubbleTags } from './BubbleTags';

interface ContactCardProps {
  contact: Contact;
  onPress: () => void;
  selectedBubbleFilters?: Set<string>;
  onBubbleTagPress?: (bubbleId: string) => void;
}

export function ContactCard({ contact, onPress, selectedBubbleFilters, onBubbleTagPress }: ContactCardProps) {
  const bubbles = useStore(s => s.bubbles.filter(b => b.contactIds.includes(contact.id)));
  const labels = bubbles.map(b => b.label.replace(/\n/g, ' '));
  const ids = bubbles.map(b => b.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Avatar name={contact.name} color={contact.color} image={contact.image} size={52} showBorder />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{contact.name}</Text>
        <Text style={styles.email} numberOfLines={1}>{contact.email}</Text>
        {labels.length > 0 && (
          <View style={styles.tagsRow}>
            {labels.slice(0, 4).map((label, idx) => {
              const isSelected = selectedBubbleFilters?.has(ids[idx]) ?? false;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => onBubbleTagPress?.(ids[idx])}
                  activeOpacity={onBubbleTagPress ? 0.7 : 1}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]} numberOfLines={1}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 16,
    gap: 14,
    marginBottom: 10,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.stroke,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  email: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: Colors.stroke,
  },
  chipSelected: {
    backgroundColor: Colors.toggleActive,
    borderColor: 'rgba(115, 132, 198, 0.5)',
  },
  chipText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  chipTextSelected: {
    color: Colors.text,
  },
});

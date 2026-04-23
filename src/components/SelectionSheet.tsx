import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, Pressable, ScrollView, FlatList,
} from 'react-native';
import { useStore } from '../store';
import { Colors, Radius, Spacing } from '../theme';
import { Avatar } from './Avatar';

const EMPTY_CONTACT_IDS: number[] = [];

interface SelectionSheetProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  preselectedContactIds?: number[];
  initialBubbleName?: string;
  onConfirm: (bubbleName: string, selectedContactIds: number[]) => void;
  onCancel: () => void;
}

export function SelectionSheet({
  visible,
  title = 'Add to New Bubble',
  subtitle = 'Select more contacts to include.',
  preselectedContactIds = EMPTY_CONTACT_IDS,
  initialBubbleName = 'New Bubble',
  onConfirm,
  onCancel,
}: SelectionSheetProps) {
  const contacts = useStore(s => s.contacts);
  const [bubbleName, setBubbleName] = useState(initialBubbleName);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(preselectedContactIds));

  useEffect(() => {
    if (!visible) return;
    setBubbleName(initialBubbleName);
    setSearchQuery('');
    setSelectedIds(new Set(preselectedContactIds));
  }, [initialBubbleName, preselectedContactIds, visible]);

  const filtered = searchQuery.trim()
    ? contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  const toggleContact = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(bubbleName || 'New Bubble', Array.from(selectedIds));
  }, [bubbleName, selectedIds, onConfirm]);

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View style={styles.panel} onStartShouldSetResponder={() => true}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Bubble Name</Text>
              <TextInput
                style={styles.input}
                value={bubbleName}
                onChangeText={setBubbleName}
                placeholder="New Bubble"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Search Contacts</Text>
              <TextInput
                style={styles.input}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search all contacts"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {filtered.map(contact => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactRow, selectedIds.has(contact.id) && styles.contactRowSelected]}
                onPress={() => toggleContact(contact.id)}
                activeOpacity={0.7}
              >
                <Avatar name={contact.name} color={contact.color} image={contact.image} size={40} />
                <Text style={styles.contactName} numberOfLines={1}>{contact.name}</Text>
                <View style={[styles.check, selectedIds.has(contact.id) && styles.checkSelected]}>
                  {selectedIds.has(contact.id) && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.actionBtnText}>Not Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnPrimaryText]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: 'rgba(10, 13, 32, 0.96)',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.stroke,
    maxHeight: '80%',
    paddingBottom: 32,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.stroke,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  fields: {
    paddingHorizontal: Spacing.xl,
    gap: 10,
    marginBottom: 8,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 14,
    color: Colors.text,
    fontSize: 16,
  },
  list: {
    maxHeight: 280,
    marginHorizontal: Spacing.xl,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    paddingHorizontal: 8,
  },
  contactRowSelected: {
    backgroundColor: 'rgba(115, 132, 198, 0.12)',
  },
  contactName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: {
    backgroundColor: Colors.toggleActive,
    borderColor: Colors.primarySolid,
  },
  checkmark: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.xl,
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 22, 51, 0.74)',
    borderWidth: 1,
    borderColor: Colors.stroke,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.toggleActive,
    borderColor: 'rgba(115, 132, 198, 0.5)',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  actionBtnPrimaryText: {
    color: Colors.text,
  },
});

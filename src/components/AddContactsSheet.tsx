import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Contact } from '../data/contacts';
import { Colors, Radius, Spacing } from '../theme';
import { Avatar } from './Avatar';
import { useSwipeDismiss } from './useSwipeDismiss';

interface AddContactsSheetProps {
  visible: boolean;
  contacts: Contact[];
  title?: string;
  subtitle?: string;
  onConfirm: (selectedContactIds: number[]) => void;
  onCancel: () => void;
}

export function AddContactsSheet({
  visible,
  contacts,
  title = 'Add Contacts',
  subtitle = 'Select contacts to include in this bubble.',
  onConfirm,
  onCancel,
}: AddContactsSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { panHandlers, animatedStyle } = useSwipeDismiss({ visible, onDismiss: onCancel });

  useEffect(() => {
    if (!visible) return;
    setSearchQuery('');
    setSelectedIds(new Set());
  }, [visible]);

  const filteredContacts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const sortedContacts = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    if (!normalizedQuery) return sortedContacts;
    return sortedContacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedQuery) ||
      contact.email.toLowerCase().includes(normalizedQuery)
    );
  }, [contacts, searchQuery]);

  const toggleContact = useCallback((contactId: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(contactId)) next.delete(contactId);
      else next.add(contactId);
      return next;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(Array.from(selectedIds));
  }, [onConfirm, selectedIds]);

  const hasSelections = selectedIds.size > 0;

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View pointerEvents="box-none" style={styles.panelContainer}>
          <Animated.View style={[styles.panel, animatedStyle]}>
            <View {...panHandlers} style={styles.dragHandle}>
              <View style={styles.grabber} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <View style={styles.fields}>
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
              {filteredContacts.length > 0 ? filteredContacts.map(contact => (
                <TouchableOpacity
                  key={contact.id}
                  style={[styles.contactRow, selectedIds.has(contact.id) && styles.contactRowSelected]}
                  onPress={() => toggleContact(contact.id)}
                  activeOpacity={0.7}
                >
                  <Avatar name={contact.name} color={contact.color} image={contact.image} size={40} />
                  <View style={styles.contactMeta}>
                    <Text style={styles.contactName} numberOfLines={1}>{contact.name}</Text>
                    <Text style={styles.contactDetail} numberOfLines={1}>{contact.email}</Text>
                  </View>
                  <View style={[styles.check, selectedIds.has(contact.id) && styles.checkSelected]}>
                    {selectedIds.has(contact.id) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              )) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No more contacts to add</Text>
                  <Text style={styles.emptySubtitle}>
                    Everyone in your address book is already part of this bubble.
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={onCancel} activeOpacity={0.7}>
                <Text style={styles.actionBtnText}>Not Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  styles.actionBtnPrimary,
                  !hasSelections && styles.actionBtnDisabled,
                ]}
                onPress={handleConfirm}
                activeOpacity={0.7}
                disabled={!hasSelections}
              >
                <Text style={[styles.actionBtnText, styles.actionBtnPrimaryText]}>Add</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 36, 48, 0.28)',
  },
  panelContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  panel: {
    width: '100%',
    backgroundColor: Colors.sheetBg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.stroke,
    maxHeight: '80%',
    paddingBottom: 32,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 10,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.strokeStrong,
    alignSelf: 'center',
  },
  dragHandle: {
    height: 28,
    justifyContent: 'center',
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
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
    fontWeight: '700',
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
    maxHeight: 320,
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
    backgroundColor: Colors.primary,
  },
  contactMeta: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 16,
    color: Colors.text,
  },
  contactDetail: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  checkSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primarySolid,
  },
  checkmark: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 28,
    paddingHorizontal: 8,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
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
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primarySolid,
    borderColor: Colors.primarySolid,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  actionBtnPrimaryText: {
    color: Colors.inverseText,
  },
});

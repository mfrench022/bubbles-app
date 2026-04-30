import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { Header, useHeaderInset } from '../../src/components/Header';
import { Avatar } from '../../src/components/Avatar';
import { useBottomNavInset } from '../../src/components/BottomNav';
import { InfoCard, InfoRow } from '../../src/components/InfoCard';
import { BubbleTags } from '../../src/components/BubbleTags';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';
import { SelectionSheet } from '../../src/components/SelectionSheet';
import { BubbleColorKey, Colors, Radius, Shadows, Spacing } from '../../src/theme';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const contactId = parseInt(id, 10);

  const contact = useStore(s => s.contacts.find(c => c.id === contactId));
  const contactBubbles = useStore(s => s.bubbles.filter(b => b.contactIds.includes(contactId)));
  const allBubbles = useStore(s => s.bubbles);
  const deleteContact = useStore(s => s.deleteContact);
  const applyBubbleAssignments = useStore(s => s.applyBubbleAssignments);
  const addBubble = useStore(s => s.addBubble);
  const bottomNavInset = useBottomNavInset();
  const headerInset = useHeaderInset();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleDelete = useCallback(() => {
    setConfirmVisible(false);
    deleteContact(contactId);
    router.back();
  }, [contactId, deleteContact, router]);

  const handleAddToBubble = useCallback((name: string, selectedIds: number[], colorKey: BubbleColorKey) => {
    addBubble({
      label: name,
      x: 40, y: 40, size: 22,
      colorKey,
      contactIds: [contactId, ...selectedIds.filter(id => id !== contactId)],
      subBubbleIds: [],
    });
    setSheetVisible(false);
  }, [contactId, addBubble]);

  if (!contact) {
    return (
      <View style={styles.screen}>
        <Header title="Contact" showBack onBack={() => router.back()} centerTitle />
        <Text style={styles.notFound}>Contact not found.</Text>
      </View>
    );
  }

  const contactRows: InfoRow[] = [
    contact.email && { icon: 'email' as const, text: contact.email, onPress: () => Linking.openURL(`mailto:${contact.email}`) },
    contact.phone && { icon: 'phone' as const, text: contact.phone, onPress: () => Linking.openURL(`tel:${contact.phone}`) },
    contact.birthday && { icon: 'birthday' as const, text: contact.birthday },
  ].filter(Boolean) as InfoRow[];

  const socialRows: InfoRow[] = [
    contact.slack && { icon: 'slack' as const, text: `Slack ${contact.slack}` },
    contact.teams && { icon: 'teams' as const, text: `Teams ${contact.teams}` },
    contact.instagram && { icon: 'instagram' as const, text: `Instagram ${contact.instagram}` },
    contact.twitter && { icon: 'twitter' as const, text: `Twitter ${contact.twitter}` },
    contact.linkedin && { icon: 'linkedin' as const, text: `LinkedIn ${contact.linkedin}` },
    ...(contact.socialLinks?.map(l => ({
      icon: 'social' as const,
      text: [l.network, l.handle].filter(Boolean).join(' '),
    })) || []),
  ].filter(r => r && r.text) as InfoRow[];

  const hasNotes = Array.isArray(contact.notes) && contact.notes.length > 0;
  const bubbleLabels = contactBubbles.map(b => b.label.replace(/\n/g, ' '));
  const bubbleIds = contactBubbles.map(b => b.id);

  return (
    <View style={styles.screen}>
      <Header
        title={contact.name}
        showBack
        backStyle="pill"
        onBack={() => router.back()}
        centerTitle
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerInset, paddingBottom: bottomNavInset }]}
        showsVerticalScrollIndicator={false}
      >
        <Avatar
          name={contact.name}
          color={contact.color}
          image={contact.image}
          size={88}
          style={styles.avatar}
        />

        {bubbleLabels.length > 0 && (
          <BubbleTags
            labels={bubbleLabels}
            bubbleIds={bubbleIds}
            onAdd={() => setSheetVisible(true)}
          />
        )}

        <InfoCard title="Contact Information" rows={contactRows} />

        {socialRows.length > 0 && (
          <InfoCard title="Social Links" rows={socialRows} />
        )}

        {hasNotes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notes</Text>
            {contact.notes!.map((note, idx) => (
              <View key={idx} style={[styles.note, idx < contact.notes!.length - 1 && styles.noteBorder]}>
                <Text style={styles.noteDate}>{note.date}</Text>
                <Text style={styles.noteText}>{note.text}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push({ pathname: '/add-contact/manual', params: { contactId: String(contactId) } })}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnText}>Edit Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Text style={styles.actionBtnText}>Share Contact</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, styles.dangerBtn]}
          onPress={() => setConfirmVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.dangerBtnText}>Delete Contact</Text>
        </TouchableOpacity>
      </ScrollView>
      <ConfirmDialog
        visible={confirmVisible}
        title={`Delete ${contact.name}?`}
        message="This will permanently remove this contact and remove them from all bubbles."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />

      <SelectionSheet
        visible={sheetVisible}
        title="Add to Bubble"
        subtitle="Select contacts to include in the new bubble."
        preselectedContactIds={[contactId]}
        onConfirm={handleAddToBubble}
        onCancel={() => setSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.appBg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  notesCard: {
    marginHorizontal: 17,
    marginBottom: 12,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.stroke,
    overflow: 'hidden',
    ...Shadows.card,
  },
  notesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  note: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    gap: 4,
  },
  noteBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.stroke,
  },
  noteDate: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  noteText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 17,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.stroke,
    ...Shadows.card,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  dangerBtn: {
    marginHorizontal: 17,
    flex: 0,
    backgroundColor: '#FBE8E6',
    borderColor: '#F0C3BE',
    marginBottom: 16,
  },
  dangerBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d9534f',
  },
  notFound: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: 40,
  },
});

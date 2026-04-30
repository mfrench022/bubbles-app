import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore, getTodayNoteDate, getImportedContactColor } from '../../src/store';
import { Header, useHeaderInset } from '../../src/components/Header';
import { Avatar } from '../../src/components/Avatar';
import { useBottomNavInset } from '../../src/components/BottomNav';
import { Colors, Radius, Spacing } from '../../src/theme';

function parseContactText(text: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) fields.email = emailMatch[0];

  const phoneMatch = text.match(/(\+?1?\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/);
  if (phoneMatch) fields.phone = phoneMatch[0].trim();

  const slackMatch = text.match(/slack[:\s]+(@\S+)/i);
  if (slackMatch) fields.slack = slackMatch[1];

  const igMatch = text.match(/instagram[:\s]+(@\S+)/i) || text.match(/ig[:\s]+(@\S+)/i);
  if (igMatch) fields.instagram = igMatch[1];

  const twitterMatch = text.match(/twitter[:\s]+(@\S+)/i) || text.match(/x[:\s]+(@\S+)/i);
  if (twitterMatch) fields.twitter = twitterMatch[1];

  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) fields.linkedin = linkedinMatch[0];

  const nameMatch = text.match(/^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)/m);
  if (nameMatch) fields.name = nameMatch[1];

  return fields;
}

function getMatchScore(contact: any, fields: Record<string, string>): number {
  let score = 0;
  if (fields.email && contact.email?.toLowerCase() === fields.email.toLowerCase()) score += 200;
  if (fields.phone && contact.phone?.replace(/\D/g, '') === fields.phone.replace(/\D/g, '')) score += 150;
  if (fields.name && contact.name?.toLowerCase() === fields.name.toLowerCase()) score += 100;
  return score;
}

export default function PasteTextScreen() {
  const router = useRouter();
  const contacts = useStore(s => s.contacts);
  const updateContact = useStore(s => s.updateContact);
  const addContact = useStore(s => s.addContact);
  const bottomNavInset = useBottomNavInset();
  const headerInset = useHeaderInset();

  const [text, setText] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<number | '__create__' | null>(null);
  const [status, setStatus] = useState('Paste a messy note, signature, or social handle to preview updates.');

  const parsed = text.trim() ? parseContactText(text) : {};
  const hasFields = Object.keys(parsed).length > 0;

  const matches = contacts
    .map(c => ({ contact: c, score: getMatchScore(c, parsed) }))
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const selectedContact = typeof selectedContactId === 'number'
    ? contacts.find(c => c.id === selectedContactId)
    : null;
  const isCreate = selectedContactId === '__create__';

  const handleApply = useCallback(() => {
    if (!hasFields) return;

    if (isCreate) {
      const newContact = addContact({
        name: parsed.name || 'New Contact',
        email: parsed.email || '',
        phone: parsed.phone || '',
        color: getImportedContactColor(contacts.length),
        instagram: parsed.instagram,
        twitter: parsed.twitter,
        linkedin: parsed.linkedin,
        slack: parsed.slack,
        notes: [{ date: getTodayNoteDate(), text: `Added from pasted text: ${text.slice(0, 80)}` }],
      });
      setStatus(`Created ${newContact.name}.`);
      router.push(`/contact/${newContact.id}`);
      return;
    }

    if (selectedContact) {
      const updates: any = {};
      if (parsed.email && !selectedContact.email) updates.email = parsed.email;
      if (parsed.phone && !selectedContact.phone) updates.phone = parsed.phone;
      if (parsed.instagram && !selectedContact.instagram) updates.instagram = parsed.instagram;
      if (parsed.twitter && !selectedContact.twitter) updates.twitter = parsed.twitter;
      if (parsed.linkedin && !selectedContact.linkedin) updates.linkedin = parsed.linkedin;
      if (parsed.slack && !selectedContact.slack) updates.slack = parsed.slack;
      if (Object.keys(updates).length === 0) {
        setStatus('No new fields to update for this contact.');
        return;
      }
      updateContact(selectedContact.id, updates);
      setStatus(`Updated ${selectedContact.name}.`);
    }
  }, [hasFields, isCreate, selectedContact, parsed, text, contacts, addContact, updateContact, router]);

  return (
    <View style={styles.screen}>
      <Header title="Paste Text" showBack backStyle="pill" onBack={() => router.back()} centerTitle />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerInset, paddingBottom: bottomNavInset }]}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.textarea}
          value={text}
          onChangeText={t => { setText(t); setSelectedContactId(null); }}
          placeholder="Paste a messy note, email signature, or social handle here..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        {text.trim().length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => { setText(''); setSelectedContactId(null); }}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}

        {!hasFields && text.trim() && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No profile details found</Text>
            <Text style={styles.emptyText}>Look for an email, phone, social handle, LinkedIn URL, Slack, or Teams handle.</Text>
          </View>
        )}

        {hasFields && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Details Found</Text>
              {Object.entries(parsed).map(([key, val]) => (
                <View key={key} style={styles.fieldRow}>
                  <Text style={styles.fieldKey}>{key}</Text>
                  <Text style={styles.fieldVal}>{val}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Matched Contact</Text>
              {matches.map(({ contact, score }) => (
                <TouchableOpacity
                  key={contact.id}
                  style={[styles.matchRow, selectedContactId === contact.id && styles.matchRowSelected]}
                  onPress={() => setSelectedContactId(contact.id)}
                  activeOpacity={0.7}
                >
                  <Avatar name={contact.name} color={contact.color} image={contact.image} size={40} />
                  <View style={styles.matchMeta}>
                    <Text style={styles.matchName}>{contact.name}</Text>
                    <Text style={styles.matchDetail}>{score >= 200 ? 'Strong match' : 'Possible match'}</Text>
                  </View>
                  {selectedContactId === contact.id && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
              {parsed.name && (
                <TouchableOpacity
                  style={[styles.matchRow, isCreate && styles.matchRowSelected]}
                  onPress={() => setSelectedContactId('__create__')}
                  activeOpacity={0.7}
                >
                  <View style={styles.createAvatar}><Text style={styles.createAvatarText}>+</Text></View>
                  <View style={styles.matchMeta}>
                    <Text style={styles.matchName}>Create {parsed.name}</Text>
                    <Text style={styles.matchDetail}>Add as a new contact</Text>
                  </View>
                  {isCreate && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
              {!matches.length && !parsed.name && (
                <Text style={styles.emptyText}>Include a name, email, or phone to match or create a contact.</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.applyBtn, (!selectedContactId) && styles.applyBtnDisabled]}
              onPress={handleApply}
              disabled={!selectedContactId}
              activeOpacity={0.7}
            >
              <Text style={styles.applyBtnText}>{isCreate ? 'Create Contact' : 'Apply Updates'}</Text>
            </TouchableOpacity>

            <Text style={styles.status} role="status">{status}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.appBg },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, gap: 12, paddingBottom: 48 },
  textarea: {
    minHeight: 100, borderRadius: Radius.lg, borderWidth: 1,
    borderColor: Colors.inputBorder, backgroundColor: Colors.inputBg,
    padding: 14, color: Colors.text, fontSize: 15, lineHeight: 22,
  },
  clearBtn: { alignSelf: 'flex-end' },
  clearBtnText: { fontSize: 14, color: Colors.textMuted },
  card: {
    backgroundColor: Colors.cardBg, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.stroke, padding: Spacing.lg, gap: 8,
  },
  cardTitle: {
    fontSize: 13, fontWeight: '600', color: Colors.textMuted,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldKey: { fontSize: 13, color: Colors.textMuted, width: 80 },
  fieldVal: { flex: 1, fontSize: 15, color: Colors.text },
  matchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 8, borderRadius: Radius.md, paddingHorizontal: 8,
  },
  matchRowSelected: { backgroundColor: Colors.primary },
  matchMeta: { flex: 1 },
  matchName: { fontSize: 16, fontWeight: '500', color: Colors.text },
  matchDetail: { fontSize: 13, color: Colors.textMuted },
  checkmark: { fontSize: 16, color: Colors.primarySolid },
  createAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.toggleActive, alignItems: 'center', justifyContent: 'center',
  },
  createAvatarText: { fontSize: 20, fontWeight: '600', color: Colors.text },
  applyBtn: {
    height: 48, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primarySolid, borderWidth: 1, borderColor: Colors.primarySolid,
  },
  applyBtnDisabled: { opacity: 0.5 },
  applyBtnText: { fontSize: 16, fontWeight: '600', color: Colors.inverseText },
  emptyCard: {
    padding: Spacing.lg, borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.inputBorder,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  emptyText: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  status: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
});

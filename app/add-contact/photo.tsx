import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useStore, getTodayNoteDate } from '../../src/store';
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
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) fields.linkedin = linkedinMatch[0];
  const igMatch = text.match(/instagram[:\s]+(@\S+)/i);
  if (igMatch) fields.instagram = igMatch[1];
  const nameMatch = text.match(/^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)/m);
  if (nameMatch) fields.name = nameMatch[1];
  return fields;
}

export default function UploadPhotoScreen() {
  const router = useRouter();
  const contacts = useStore(s => s.contacts);
  const updateContact = useStore(s => s.updateContact);
  const bottomNavInset = useBottomNavInset();
  const headerInset = useHeaderInset();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [status, setStatus] = useState('Upload a photo or screenshot to extract contact details.');
  const [isProcessing, setIsProcessing] = useState(false);

  const parsed = extractedText.trim() ? parseContactText(extractedText) : {};
  const hasFields = Object.keys(parsed).length > 0;

  const matches = contacts
    .map(c => {
      let score = 0;
      if (parsed.email && c.email?.toLowerCase() === parsed.email.toLowerCase()) score += 200;
      if (parsed.phone && c.phone?.replace(/\D/g, '') === (parsed.phone || '').replace(/\D/g, '')) score += 150;
      if (parsed.name && c.name?.toLowerCase() === parsed.name.toLowerCase()) score += 100;
      return { contact: c, score };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setExtractedText('');
      setSelectedContactId(null);
      setStatus('Image selected. Enter or paste any text visible in the image below for contact extraction.');
    }
  }, []);

  const handleApply = useCallback(() => {
    if (!selectedContact || !hasFields) return;

    const updates: any = {};
    if (parsed.email && !selectedContact.email) updates.email = parsed.email;
    if (parsed.phone && !selectedContact.phone) updates.phone = parsed.phone;
    if (parsed.linkedin && !selectedContact.linkedin) updates.linkedin = parsed.linkedin;
    if (parsed.instagram && !selectedContact.instagram) updates.instagram = parsed.instagram;

    if (Object.keys(updates).length === 0) {
      setStatus('No new fields to update for this contact.');
      return;
    }

    const existingNotes = Array.isArray(selectedContact.notes) ? selectedContact.notes : [];
    updates.notes = [...existingNotes, {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      text: `Updated from uploaded photo.`,
    }];

    updateContact(selectedContact.id, updates);
    setStatus(`Updated ${selectedContact.name}.`);
    router.push(`/contact/${selectedContact.id}`);
  }, [selectedContact, hasFields, parsed, updateContact, router]);

  return (
    <View style={styles.screen}>
      <Header title="Upload Photo" showBack backStyle="pill" onBack={() => router.back()} centerTitle />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerInset, paddingBottom: bottomNavInset }]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.dropZone} onPress={pickImage} activeOpacity={0.7}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
          ) : (
            <>
              <Text style={styles.dropIcon}>📷</Text>
              <Text style={styles.dropTitle}>Tap to choose an image</Text>
              <Text style={styles.dropSubtitle}>Business cards, screenshots, or saved contact photos</Text>
            </>
          )}
        </TouchableOpacity>

        {imageUri && (
          <>
            <Text style={styles.sectionLabel}>Text visible in the image</Text>
            <TextInput
              style={styles.textarea}
              value={extractedText}
              onChangeText={t => { setExtractedText(t); setSelectedContactId(null); }}
              placeholder="Type or paste text from the image to extract contact details..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </>
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

            {matches.length > 0 && (
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
                    {selectedContactId === contact.id && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[styles.applyBtn, (!selectedContactId) && styles.applyBtnDisabled]}
              onPress={handleApply}
              disabled={!selectedContactId}
              activeOpacity={0.7}
            >
              <Text style={styles.applyBtnText}>Apply Updates</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.status}>{status}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.appBg },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, gap: 12, paddingBottom: 48 },
  dropZone: {
    minHeight: 160, borderRadius: Radius.lg, borderWidth: 1.5,
    borderColor: Colors.stroke, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', padding: Spacing.xl,
    backgroundColor: 'rgba(17,22,51,0.4)',
  },
  preview: { width: '100%', height: 200, borderRadius: Radius.md },
  dropIcon: { fontSize: 40, marginBottom: 12 },
  dropTitle: { fontSize: 17, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  dropSubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.3 },
  textarea: {
    minHeight: 80, borderRadius: Radius.lg, borderWidth: 1,
    borderColor: Colors.inputBorder, backgroundColor: Colors.inputBg,
    padding: 14, color: Colors.text, fontSize: 15,
  },
  card: {
    backgroundColor: 'rgba(17,22,51,0.74)', borderRadius: Radius.lg,
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
  matchRowSelected: { backgroundColor: 'rgba(115,132,198,0.12)' },
  matchMeta: { flex: 1 },
  matchName: { fontSize: 16, fontWeight: '500', color: Colors.text },
  matchDetail: { fontSize: 13, color: Colors.textMuted },
  check: { fontSize: 16, color: Colors.primarySolid },
  applyBtn: {
    height: 48, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.toggleActive, borderWidth: 1, borderColor: 'rgba(115,132,198,0.5)',
  },
  applyBtnDisabled: { opacity: 0.5 },
  applyBtnText: { fontSize: 16, fontWeight: '600', color: Colors.text },
  status: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
});

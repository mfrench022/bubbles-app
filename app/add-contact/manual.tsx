import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,
  Image, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useStore, initials, getTodayNoteDate, getImportedContactColor } from '../../src/store';
import { Header } from '../../src/components/Header';
import { Colors, Radius, Spacing } from '../../src/theme';
import { DEMO_PROFILE_IMAGES } from '../../src/data/user';

interface SocialRow {
  network: string;
  handle: string;
}

function Field({
  label, value, onChangeText, placeholder, keyboardType = 'default', autoCapitalize = 'sentences', multiline = false,
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; keyboardType?: any; autoCapitalize?: any; multiline?: boolean;
}) {
  return (
    <View style={fieldStyles.container}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, multiline && fieldStyles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  container: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.3 },
  input: {
    height: 44, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.inputBorder, backgroundColor: Colors.inputBg,
    paddingHorizontal: 14, color: Colors.text, fontSize: 16,
  },
  inputMultiline: {
    height: 96, paddingTop: 12, textAlignVertical: 'top',
  },
});

export default function ManualEntryScreen() {
  const router = useRouter();
  const { contactId } = useLocalSearchParams<{ contactId?: string }>();
  const parsedContactId = contactId ? parseInt(contactId, 10) : null;
  const isEdit = Boolean(parsedContactId);

  const contact = useStore(s => parsedContactId ? s.contacts.find(c => c.id === parsedContactId) : null);
  const bubbles = useStore(s => s.bubbles);
  const addContact = useStore(s => s.addContact);
  const updateContact = useStore(s => s.updateContact);
  const applyBubbleAssignments = useStore(s => s.applyBubbleAssignments);

  const [name, setName] = useState(contact?.name || '');
  const [email, setEmail] = useState(contact?.email || '');
  const [phone, setPhone] = useState(contact?.phone || '');
  const [birthday, setBirthday] = useState(contact?.birthday || '');
  const [noteText, setNoteText] = useState(contact?.notes?.[0]?.text || '');
  const [photoSrc, setPhotoSrc] = useState(contact?.image || '');
  const [socialRows, setSocialRows] = useState<SocialRow[]>(() => {
    if (!contact) return [{ network: '', handle: '' }];
    const rows: SocialRow[] = [];
    if (contact.slack) rows.push({ network: 'Slack', handle: contact.slack });
    if (contact.teams) rows.push({ network: 'Teams', handle: contact.teams });
    if (contact.instagram) rows.push({ network: 'Instagram', handle: contact.instagram });
    if (contact.twitter) rows.push({ network: 'Twitter', handle: contact.twitter });
    if (contact.linkedin) rows.push({ network: 'LinkedIn', handle: contact.linkedin });
    contact.socialLinks?.forEach(l => rows.push({ network: l.network, handle: l.handle }));
    return rows.length ? rows : [{ network: '', handle: '' }];
  });
  const [selectedBubbleIds, setSelectedBubbleIds] = useState<Set<string>>(() => {
    if (!parsedContactId) return new Set();
    return new Set(bubbles.filter(b => b.contactIds.includes(parsedContactId!)).map(b => b.id));
  });
  const [status, setStatus] = useState('');

  const pickPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoSrc(result.assets[0].uri);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!name.trim()) {
      setStatus('Name is required.');
      return;
    }

    const socialLinks = socialRows.filter(r => r.network || r.handle);
    const newNotes = noteText.trim() ? [{ date: getTodayNoteDate(), text: noteText.trim() }] : [];

    if (isEdit && parsedContactId) {
      updateContact(parsedContactId, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        birthday: birthday.trim() || undefined,
        image: photoSrc || undefined,
        socialLinks,
        notes: newNotes,
      });
      applyBubbleAssignments(parsedContactId, selectedBubbleIds);
      setStatus('Contact saved.');
      router.back();
    } else {
      const allContacts = useStore.getState().contacts;
      const newContact = addContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        birthday: birthday.trim() || undefined,
        image: photoSrc || undefined,
        color: getImportedContactColor(allContacts.length),
        socialLinks,
        notes: newNotes,
      });
      applyBubbleAssignments(newContact.id, selectedBubbleIds);
      setStatus('Contact created.');
      router.push(`/contact/${newContact.id}`);
    }
  }, [name, email, phone, birthday, photoSrc, socialRows, noteText, isEdit, parsedContactId, selectedBubbleIds, addContact, updateContact, applyBubbleAssignments, router]);

  const toggleBubble = useCallback((id: string) => {
    setSelectedBubbleIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const avatarInitials = name ? initials(name) : null;

  return (
    <View style={styles.screen}>
      <Header
        title={isEdit ? 'Edit Contact' : 'New Contact'}
        showBack
        backStyle="pill"
        onBack={() => router.back()}
        centerTitle
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.avatarBtn} onPress={pickPhoto} activeOpacity={0.8}>
          {photoSrc ? (
            <Image source={{ uri: photoSrc }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarInitials}>{avatarInitials || '?'}</Text>
          )}
          <Text style={styles.avatarHint}>Tap to upload</Text>
        </TouchableOpacity>

        <View style={styles.demoPhotos}>
          {DEMO_PROFILE_IMAGES.map((src, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.demoPhoto, photoSrc === src && styles.demoPhotoSelected]}
              onPress={() => setPhotoSrc(src)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: src }} style={styles.demoPhotoImg} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <Field label="Name" value={name} onChangeText={setName} placeholder="Full name" autoCapitalize="words" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
          <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="555-123-4567" keyboardType="phone-pad" />
          <Field label="Birthday" value={birthday} onChangeText={setBirthday} placeholder="January 1, 1990" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Social Links</Text>
          {socialRows.map((row, idx) => (
            <View key={idx} style={styles.socialRow}>
              <TextInput
                style={[fieldStyles.input, styles.socialInput]}
                value={row.network}
                onChangeText={t => {
                  const next = [...socialRows];
                  next[idx] = { ...next[idx], network: t };
                  setSocialRows(next);
                }}
                placeholder="X, Instagram..."
                placeholderTextColor={Colors.textMuted}
              />
              <TextInput
                style={[fieldStyles.input, styles.socialInput]}
                value={row.handle}
                onChangeText={t => {
                  const next = [...socialRows];
                  next[idx] = { ...next[idx], handle: t };
                  setSocialRows(next);
                }}
                placeholder="@username"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
              />
              {(idx > 0 || row.network || row.handle) && (
                <TouchableOpacity
                  onPress={() => {
                    const next = [...socialRows];
                    next.splice(idx, 1);
                    if (next.length === 0) next.push({ network: '', handle: '' });
                    setSocialRows(next);
                  }}
                  style={styles.removeBtn}
                >
                  <Text style={styles.removeBtnText}>−</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity
            style={styles.addRowBtn}
            onPress={() => setSocialRows([...socialRows, { network: '', handle: '' }])}
            activeOpacity={0.7}
          >
            <Text style={styles.addRowBtnText}>+ Add Social Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bubbles</Text>
          <View style={styles.bubblePicker}>
            {bubbles.map(b => {
              const label = b.label.replace(/\n/g, ' ');
              const selected = selectedBubbleIds.has(b.id);
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.bubbleChip, selected && styles.bubbleChipSelected]}
                  onPress={() => toggleBubble(b.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.bubbleChipText, selected && styles.bubbleChipTextSelected]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notes</Text>
          <Field label="First note" value={noteText} onChangeText={setNoteText} placeholder="Where you met, what to remember..." multiline />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.actionBtnText}>{isEdit ? 'Cancel' : 'Clear'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleSubmit} activeOpacity={0.7}>
            <Text style={[styles.actionBtnText, styles.actionBtnPrimaryText]}>{isEdit ? 'Save Contact' : 'Create Contact'}</Text>
          </TouchableOpacity>
        </View>

        {status ? <Text style={styles.status}>{status}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.appBg },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, gap: 12, paddingBottom: 48 },
  avatarBtn: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#4A5FA8',
    alignSelf: 'center',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, overflow: 'hidden',
  },
  avatarImg: { width: 88, height: 88, borderRadius: 44 },
  avatarInitials: { fontSize: 28, fontWeight: '700', color: 'white' },
  avatarHint: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', textAlign: 'center',
    color: 'white', fontSize: 11, paddingVertical: 3,
  },
  demoPhotos: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 4 },
  demoPhoto: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  demoPhotoSelected: { borderColor: Colors.primarySolid },
  demoPhotoImg: { width: 40, height: 40, borderRadius: 20 },
  card: {
    backgroundColor: 'rgba(17, 22, 51, 0.74)',
    borderRadius: Radius.lg, borderWidth: 1,
    borderColor: Colors.stroke, padding: Spacing.lg, gap: 12,
  },
  cardTitle: {
    fontSize: 13, fontWeight: '600', color: Colors.textMuted,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  socialRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  socialInput: { flex: 1 },
  removeBtn: {
    width: 30, height: 44, alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, backgroundColor: 'rgba(217,83,79,0.15)',
  },
  removeBtnText: { fontSize: 18, color: '#d9534f', fontWeight: '600' },
  addRowBtn: { paddingVertical: 4 },
  addRowBtnText: { fontSize: 15, color: Colors.primarySolid },
  bubblePicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  bubbleChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    backgroundColor: 'rgba(12,15,35,0.6)', borderWidth: 1, borderColor: Colors.stroke,
  },
  bubbleChipSelected: { backgroundColor: Colors.toggleActive, borderColor: 'rgba(115,132,198,0.5)' },
  bubbleChipText: { fontSize: 14, color: Colors.textMuted },
  bubbleChipTextSelected: { color: Colors.text },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1, height: 48, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(17,22,51,0.74)', borderWidth: 1, borderColor: Colors.stroke,
  },
  actionBtnPrimary: { backgroundColor: Colors.toggleActive, borderColor: 'rgba(115,132,198,0.5)' },
  actionBtnText: { fontSize: 16, fontWeight: '500', color: Colors.text },
  actionBtnPrimaryText: { color: Colors.text },
  status: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginTop: 4 },
});

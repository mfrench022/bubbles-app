import React, { useCallback, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useStore, initials } from '../src/store';
import { Header, useHeaderInset } from '../src/components/Header';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Colors, Radius, Spacing } from '../src/theme';

interface SocialRow {
  network: string;
  handle: string;
}

function Field({
  label, value, onChangeText, placeholder, keyboardType = 'default', autoCapitalize = 'sentences',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}) {
  return (
    <View style={fieldStyles.container}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={fieldStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  container: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.3 },
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
});

export default function ProfileEditScreen() {
  const router = useRouter();
  const userProfile = useStore(s => s.userProfile);
  const updateUserProfile = useStore(s => s.updateUserProfile);
  const reset = useStore(s => s.reset);
  const headerInset = useHeaderInset();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [birthday, setBirthday] = useState(userProfile.birthday || '');
  const [photoSrc, setPhotoSrc] = useState<string | number | undefined>(userProfile.image);
  const [socialRows, setSocialRows] = useState<SocialRow[]>(() => {
    const rows: SocialRow[] = [];
    if (userProfile.slack) rows.push({ network: 'Slack', handle: userProfile.slack });
    if (userProfile.teams) rows.push({ network: 'Teams', handle: userProfile.teams });
    if (userProfile.instagram) rows.push({ network: 'Instagram', handle: userProfile.instagram });
    if (userProfile.twitter) rows.push({ network: 'Twitter', handle: userProfile.twitter });
    if (userProfile.linkedin) rows.push({ network: 'LinkedIn', handle: userProfile.linkedin });
    userProfile.socialLinks?.forEach(link => rows.push({ network: link.network, handle: link.handle }));
    return rows.length ? rows : [{ network: '', handle: '' }];
  });
  const [status, setStatus] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);

  const avatarInitials = useMemo(() => (name ? initials(name) : '?'), [name]);

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

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      setStatus('Name is required.');
      return;
    }

    const normalizedSocialRows = socialRows
      .map(row => ({ network: row.network.trim(), handle: row.handle.trim() }))
      .filter(row => row.network || row.handle);

    const builtInEntries = {
      slack: normalizedSocialRows.find(row => row.network.toLowerCase() === 'slack')?.handle,
      teams: normalizedSocialRows.find(row => row.network.toLowerCase() === 'teams')?.handle,
      instagram: normalizedSocialRows.find(row => row.network.toLowerCase() === 'instagram')?.handle,
      twitter: normalizedSocialRows.find(row => row.network.toLowerCase() === 'twitter')?.handle,
      linkedin: normalizedSocialRows.find(row => row.network.toLowerCase() === 'linkedin')?.handle,
    };
    const customSocialLinks = normalizedSocialRows.filter(row => {
      const key = row.network.toLowerCase();
      return !['slack', 'teams', 'instagram', 'twitter', 'linkedin'].includes(key);
    });

    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      birthday: birthday.trim() || undefined,
      slack: builtInEntries.slack || undefined,
      teams: builtInEntries.teams || undefined,
      instagram: builtInEntries.instagram || undefined,
      twitter: builtInEntries.twitter || undefined,
      linkedin: builtInEntries.linkedin || undefined,
      socialLinks: customSocialLinks.length ? customSocialLinks : undefined,
      image: photoSrc,
    });
    setStatus('Profile saved.');
    router.back();
  }, [
    birthday,
    email,
    name,
    phone,
    photoSrc,
    router,
    socialRows,
    updateUserProfile,
  ]);

  const handleReset = useCallback(() => {
    setConfirmVisible(false);
    reset();
    router.replace('/profile');
  }, [reset, router]);

  const previewSource = photoSrc
    ? (typeof photoSrc === 'string' ? { uri: photoSrc } : photoSrc)
    : null;

  return (
    <View style={styles.screen}>
      <Header
        title="Edit Profile"
        showBack
        backStyle="pill"
        onBack={() => router.back()}
        centerTitle
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerInset }]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.avatarBtn} onPress={pickPhoto} activeOpacity={0.8}>
          {previewSource ? (
            <Image source={previewSource} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarInitials}>{avatarInitials}</Text>
          )}
          <Text style={styles.avatarHint}>Tap to upload</Text>
        </TouchableOpacity>

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
                onChangeText={text => {
                  const next = [...socialRows];
                  next[idx] = { ...next[idx], network: text };
                  setSocialRows(next);
                }}
                placeholder="X, Instagram..."
                placeholderTextColor={Colors.textMuted}
              />
              <TextInput
                style={[fieldStyles.input, styles.socialInput]}
                value={row.handle}
                onChangeText={text => {
                  const next = [...socialRows];
                  next[idx] = { ...next[idx], handle: text };
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

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.actionBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleSave} activeOpacity={0.7}>
            <Text style={[styles.actionBtnText, styles.actionBtnPrimaryText]}>Save Profile</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, styles.dangerBtn]}
          onPress={() => setConfirmVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.dangerBtnText}>Reset Data</Text>
        </TouchableOpacity>

        {status ? <Text style={styles.status}>{status}</Text> : null}
      </ScrollView>

      <ConfirmDialog
        visible={confirmVisible}
        title="Reset App Data?"
        message="This will restore your profile, contacts, and bubbles to the original demo data. Your changes will be lost."
        confirmLabel="Reset"
        danger
        onConfirm={handleReset}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.appBg },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, gap: 12, paddingBottom: 48 },
  avatarBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#4A5FA8',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  avatarImg: { width: 88, height: 88, borderRadius: 44 },
  avatarInitials: { fontSize: 28, fontWeight: '700', color: 'white' },
  avatarHint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
    color: 'white',
    fontSize: 11,
    paddingVertical: 3,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.stroke,
    padding: Spacing.lg,
    gap: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  socialRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  socialInput: { flex: 1 },
  removeBtn: {
    width: 30,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FBE8E6',
  },
  removeBtnText: { fontSize: 18, color: '#d9534f', fontWeight: '600' },
  addRowBtn: { paddingVertical: 4 },
  addRowBtnText: { fontSize: 15, color: Colors.primarySolid },
  actions: { flexDirection: 'row', gap: 8 },
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
  actionBtnPrimary: { backgroundColor: Colors.primarySolid, borderColor: Colors.primarySolid },
  actionBtnText: { fontSize: 16, fontWeight: '500', color: Colors.text },
  actionBtnPrimaryText: { color: Colors.inverseText },
  dangerBtn: {
    backgroundColor: '#FBE8E6',
    borderColor: '#F0C3BE',
    flex: 0,
  },
  dangerBtnText: { fontSize: 16, fontWeight: '500', color: '#d9534f' },
  status: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 13,
  },
});

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { Colors, Radius, Spacing } from '../../src/theme';

const PLATFORMS = [
  { id: 'google', label: 'Google Contacts', emoji: '🔵' },
  { id: 'icloud', label: 'iCloud', emoji: '☁️' },
  { id: 'outlook', label: 'Outlook', emoji: '📧' },
  { id: 'yahoo', label: 'Yahoo', emoji: '💜' },
];

export default function ImportCloudScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('google');

  return (
    <View style={styles.screen}>
      <Header title="Import Contacts" showBack backStyle="pill" onBack={() => router.back()} centerTitle />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.intro}>
          Choose a platform to import your contacts. You'll be taken through your phone's system authorization flow.
        </Text>

        {PLATFORMS.map(p => (
          <TouchableOpacity
            key={p.id}
            style={[styles.platformBtn, selected === p.id && styles.platformBtnSelected]}
            onPress={() => setSelected(p.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.platformEmoji}>{p.emoji}</Text>
            <Text style={[styles.platformLabel, selected === p.id && styles.platformLabelSelected]}>
              {p.label}
            </Text>
            {selected === p.id && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}

        <View style={styles.note}>
          <Text style={styles.noteTitle}>Native App Only</Text>
          <Text style={styles.noteText}>
            Direct contacts access requires system permissions that are available in the native iOS and Android builds. This feature will be fully functional in the shipped app.
          </Text>
        </View>

        <TouchableOpacity style={[styles.importBtn, styles.importBtnDisabled]} disabled activeOpacity={0.7}>
          <Text style={styles.importBtnText}>Connect & Import</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.appBg },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, gap: 12, paddingBottom: 48 },
  intro: { fontSize: 15, color: Colors.textMuted, lineHeight: 22, marginBottom: 4 },
  platformBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: Spacing.lg, borderRadius: Radius.lg,
    backgroundColor: 'rgba(17,22,51,0.74)', borderWidth: 1, borderColor: Colors.stroke,
  },
  platformBtnSelected: { backgroundColor: Colors.toggleActive, borderColor: 'rgba(115,132,198,0.5)' },
  platformEmoji: { fontSize: 24 },
  platformLabel: { flex: 1, fontSize: 17, fontWeight: '500', color: Colors.textMuted },
  platformLabelSelected: { color: Colors.text },
  checkmark: { fontSize: 16, color: Colors.primarySolid },
  note: {
    padding: Spacing.lg, borderRadius: Radius.lg,
    backgroundColor: 'rgba(10,13,32,0.7)', borderWidth: 1, borderColor: Colors.stroke,
    gap: 8,
  },
  noteTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  noteText: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  importBtn: {
    height: 52, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.toggleActive, borderWidth: 1, borderColor: 'rgba(115,132,198,0.5)',
  },
  importBtnDisabled: { opacity: 0.5 },
  importBtnText: { fontSize: 17, fontWeight: '600', color: Colors.text },
});

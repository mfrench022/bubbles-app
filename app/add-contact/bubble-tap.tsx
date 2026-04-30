import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { USER_PROFILE } from '../../src/data/user';
import { Header, useHeaderInset } from '../../src/components/Header';
import { Avatar } from '../../src/components/Avatar';
import { useBottomNavInset } from '../../src/components/BottomNav';
import { Colors, Radius, Spacing } from '../../src/theme';

export default function BubbleTapScreen() {
  const router = useRouter();
  const bubbles = useStore(s => s.bubbles);
  const bottomNavInset = useBottomNavInset();
  const headerInset = useHeaderInset();
  const [status, setStatus] = useState('Ready to share your Bubble Tap profile.');

  const topLevelLabels = bubbles
    .filter(b => !b.parentId)
    .map(b => b.label.replace(/\n/g, ' '));

  const shareUrl = `https://bubbles.app/profile/${USER_PROFILE.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleShare = useCallback(async () => {
    try {
      const result = await Share.share({
        title: `${USER_PROFILE.name}'s Bubble Tap profile`,
        message: `Connect with ${USER_PROFILE.name} using Bubble Tap.\n${shareUrl}`,
        url: shareUrl,
      });
      if (result.action === Share.sharedAction) {
        setStatus('Share sheet opened.');
      }
    } catch {
      setStatus('Unable to open the share sheet.');
    }
  }, [shareUrl]);

  const handleCopy = useCallback(async () => {
    // On React Native, use Clipboard API from @react-native-clipboard/clipboard
    // For now, trigger share which includes copy options
    setStatus(`Profile link: ${shareUrl}`);
  }, [shareUrl]);

  return (
    <View style={styles.screen}>
      <Header title="Bubble Tap" showBack backStyle="pill" onBack={() => router.back()} centerTitle />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerInset, paddingBottom: bottomNavInset }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.halo}>
          <View style={styles.pulse1} />
          <View style={styles.pulse2} />
          <View style={styles.profileCircle}>
            <Avatar
              name={USER_PROFILE.name}
              color={USER_PROFILE.color}
              size={88}
            />
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.eyebrow}>Bubble Tap profile</Text>
          <Text style={styles.name}>{USER_PROFILE.name}</Text>
          <Text style={styles.email}>{USER_PROFILE.email}</Text>
          <View style={styles.chips}>
            {topLevelLabels.map((label, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.namedropNote}>
          <Text style={styles.namedropTitle}>NameDrop uses the native app</Text>
          <Text style={styles.namedropText}>
            Apple NameDrop proximity sharing is available in the native iOS build. Here, use the share sheet or copy a Bubble Tap profile link.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleShare} activeOpacity={0.7}>
            <Text style={styles.actionBtnPrimaryText}>Open Share Sheet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCopy} activeOpacity={0.7}>
            <Text style={styles.actionBtnText}>Copy Link</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.status}>{status}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.appBg },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.xl, gap: 20, paddingBottom: 48, alignItems: 'center' },
  halo: {
    width: 160, height: 160, alignItems: 'center', justifyContent: 'center',
    position: 'relative', marginTop: 16,
  },
  pulse1: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    borderWidth: 1.5, borderColor: '#D9D0FF',
  },
  pulse2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    borderWidth: 1.5, borderColor: '#E7E0FF',
  },
  profileCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primarySolid,
  },
  panel: {
    alignItems: 'center', gap: 6, width: '100%',
    backgroundColor: Colors.cardBg, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.stroke, padding: Spacing.xl,
  },
  eyebrow: { fontSize: 12, color: Colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' },
  name: { fontSize: 24, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  email: { fontSize: 15, color: Colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999,
    backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.inputBorder,
  },
  chipText: { fontSize: 13, color: Colors.textMuted },
  namedropNote: {
    width: '100%', padding: Spacing.lg, borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.inputBorder, gap: 6,
  },
  namedropTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  namedropText: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 8, width: '100%' },
  actionBtn: {
    flex: 1, height: 52, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.inputBorder,
  },
  actionBtnPrimary: { backgroundColor: Colors.primarySolid, borderColor: Colors.primarySolid },
  actionBtnText: { fontSize: 16, fontWeight: '500', color: Colors.text },
  actionBtnPrimaryText: { fontSize: 16, fontWeight: '600', color: Colors.inverseText },
  status: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
});

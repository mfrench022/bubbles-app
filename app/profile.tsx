import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../src/store';
import { USER_PROFILE } from '../src/data/user';
import { Header, useHeaderInset } from '../src/components/Header';
import { Avatar } from '../src/components/Avatar';
import { useBottomNavInset } from '../src/components/BottomNav';
import { InfoCard, InfoRow } from '../src/components/InfoCard';
import { BubbleTags } from '../src/components/BubbleTags';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Colors, Radius, Shadows, Spacing } from '../src/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const bubbles = useStore(s => s.bubbles);
  const reset = useStore(s => s.reset);
  const bottomNavInset = useBottomNavInset();
  const headerInset = useHeaderInset();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const topLevelBubbles = bubbles.filter(b => !b.parentId);
  const bubbleLabels = topLevelBubbles.map(b => b.label.replace(/\n/g, ' '));

  const contactRows: InfoRow[] = [
    { icon: 'email', text: USER_PROFILE.email },
    { icon: 'phone', text: USER_PROFILE.phone },
    USER_PROFILE.birthday && { icon: 'birthday', text: USER_PROFILE.birthday },
  ].filter(Boolean) as InfoRow[];

  const socialRows: InfoRow[] = [
    USER_PROFILE.slack && { icon: 'slack', text: `Slack ${USER_PROFILE.slack}` },
    USER_PROFILE.teams && { icon: 'teams', text: `Teams ${USER_PROFILE.teams}` },
    USER_PROFILE.instagram && { icon: 'instagram', text: `Instagram ${USER_PROFILE.instagram}` },
    USER_PROFILE.twitter && { icon: 'twitter', text: `Twitter ${USER_PROFILE.twitter}` },
    USER_PROFILE.linkedin && { icon: 'linkedin', text: `LinkedIn ${USER_PROFILE.linkedin}` },
  ].filter(Boolean) as InfoRow[];

  const handleReset = () => {
    setConfirmVisible(false);
    reset();
    router.replace('/');
  };

  return (
    <View style={styles.screen}>
      <Header
        title="My Profile"
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
          name={USER_PROFILE.name}
          color={USER_PROFILE.color}
          image={typeof USER_PROFILE.image === 'number'
            ? undefined
            : USER_PROFILE.image}
          size={88}
          style={styles.avatar}
        />

        {bubbleLabels.length > 0 && (
          <BubbleTags labels={bubbleLabels} />
        )}

        <InfoCard title="Contact Information" rows={contactRows} />
        <InfoCard title="Social Links" rows={socialRows} />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Text style={styles.actionBtnText}>Edit Profile</Text>
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
          <Text style={styles.dangerBtnText}>Reset Data</Text>
        </TouchableOpacity>
      </ScrollView>
      <ConfirmDialog
        visible={confirmVisible}
        title="Reset App Data?"
        message="This will restore all contacts and bubbles to the original demo data. Your changes will be lost."
        confirmLabel="Reset"
        danger
        onConfirm={handleReset}
        onCancel={() => setConfirmVisible(false)}
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
});

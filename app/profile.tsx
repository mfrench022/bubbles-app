import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../src/store';
import { Header, useHeaderInset } from '../src/components/Header';
import { Avatar } from '../src/components/Avatar';
import { useBottomNavDockInset } from '../src/components/BottomNav';
import { InfoCard, InfoRow } from '../src/components/InfoCard';
import { BubbleTags } from '../src/components/BubbleTags';
import { ChevronDownIcon } from '../src/components/Icons';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const bubbles = useStore(s => s.bubbles);
  const userProfile = useStore(s => s.userProfile);
  const bottomNavInset = useBottomNavDockInset();
  const headerInset = useHeaderInset();
  const [bubblesExpanded, setBubblesExpanded] = useState(false);

  const topLevelBubbles = bubbles.filter(b => !b.parentId);
  const bubbleLabels = topLevelBubbles.map(b => b.label.replace(/\n/g, ' '));
  const bubbleIds = topLevelBubbles.map(b => b.id);

  const contactRows: InfoRow[] = [
    { icon: 'email', text: userProfile.email },
    { icon: 'phone', text: userProfile.phone },
    userProfile.birthday && { icon: 'birthday', text: userProfile.birthday },
  ].filter(Boolean) as InfoRow[];

  const socialRows: InfoRow[] = [
    userProfile.slack && { icon: 'slack', text: `Slack ${userProfile.slack}`, label: 'Slack ', value: userProfile.slack, hideIcon: true },
    userProfile.teams && { icon: 'teams', text: `Teams ${userProfile.teams}`, label: 'Teams ', value: userProfile.teams, hideIcon: true },
    userProfile.instagram && { icon: 'instagram', text: `Instagram ${userProfile.instagram}`, label: 'Instagram ', value: userProfile.instagram, hideIcon: true },
    userProfile.twitter && { icon: 'twitter', text: `Twitter ${userProfile.twitter}`, label: 'Twitter ', value: userProfile.twitter, hideIcon: true },
    userProfile.linkedin && { icon: 'linkedin', text: `LinkedIn ${userProfile.linkedin}`, label: 'LinkedIn ', value: userProfile.linkedin, hideIcon: true },
    ...(userProfile.socialLinks?.map(link => ({
      icon: 'social' as const,
      text: [link.network, link.handle].filter(Boolean).join(' '),
      label: link.network ? `${link.network} ` : undefined,
      value: link.handle,
      hideIcon: true,
    })) || []),
  ].filter(Boolean) as InfoRow[];

  const handleShare = useCallback(async () => {
    const shareLines = [
      userProfile.name,
      userProfile.email,
      userProfile.phone,
      userProfile.birthday ? `Birthday: ${userProfile.birthday}` : null,
    ].filter(Boolean);

    try {
      await Share.share({
        title: `${userProfile.name}'s contact card`,
        message: shareLines.join('\n'),
      });
    } catch {
      // Ignore share sheet dismiss and platform share errors on this lightweight action.
    }
  }, [userProfile]);

  return (
    <View style={styles.screen}>
      <Header
        title="My Profile"
        centerTitle
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerInset, paddingBottom: bottomNavInset }]}
        showsVerticalScrollIndicator={false}
      >
        <Avatar
          name={userProfile.name}
          color={userProfile.color}
          image={userProfile.image}
          size={88}
          style={styles.avatar}
        />

        {bubbleLabels.length > 0 && (
          <View style={styles.bubblesCard}>
            <TouchableOpacity
              style={styles.bubblesHeader}
              onPress={() => setBubblesExpanded(current => !current)}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.bubblesEyebrow}>Bubbles</Text>
                <Text style={styles.bubblesTitle}>
                  {bubbleLabels.length} {bubbleLabels.length === 1 ? 'bubble' : 'bubbles'}
                </Text>
              </View>
              <View
                style={[
                  styles.chevronWrap,
                  bubblesExpanded && styles.chevronWrapExpanded,
                ]}
              >
                <ChevronDownIcon size={18} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>

            {bubblesExpanded ? (
              <View style={styles.bubblePreviewWrap}>
                <BubbleTags
                  labels={bubbleLabels}
                  bubbleIds={bubbleIds}
                  onTagPress={bubbleId => router.push(`/bubble/${bubbleId}`)}
                  style={styles.bubbleTags}
                />
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bubblePreviewScroller}
              >
                <BubbleTags
                  labels={bubbleLabels}
                  bubbleIds={bubbleIds}
                  onTagPress={bubbleId => router.push(`/bubble/${bubbleId}`)}
                  style={styles.bubblePreviewTags}
                />
              </ScrollView>
            )}
          </View>
        )}

        <InfoCard title="Contact Information" rows={contactRows} />
        <InfoCard title="Links" rows={socialRows} />

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/profile-edit')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.7}>
            <Text style={styles.actionBtnText}>Share Contact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  bubblesCard: {
    marginHorizontal: 17,
    marginBottom: 12,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.stroke,
    overflow: 'hidden',
    ...Shadows.card,
  },
  bubblesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  bubblesEyebrow: {
    ...Typography.cardTitle,
    paddingBottom: Spacing.xs,
  },
  bubblesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
  },
  chevronWrapExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  bubbleTags: {
    marginHorizontal: Spacing.lg,
    marginTop: 0,
    marginBottom: Spacing.lg,
  },
  bubblePreviewWrap: {
    overflow: 'hidden',
  },
  bubblePreviewScroller: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  bubblePreviewTags: {
    marginHorizontal: 0,
    marginBottom: 0,
    flexWrap: 'nowrap',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 17,
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
});

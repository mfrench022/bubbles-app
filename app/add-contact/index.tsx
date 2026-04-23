import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import {
  BubbleTapIcon, ImportCloudIcon, PasteTextIcon,
  UploadPhotoIcon, ManualEntryIcon,
} from '../../src/components/Icons';
import { Colors, Radius, Spacing } from '../../src/theme';

const OPTIONS = [
  {
    id: 'bubble-tap',
    title: 'Bubble Tap',
    description: 'Share your Bubble Tap profile using the system share sheet or a profile link',
    Icon: BubbleTapIcon,
    route: '/add-contact/bubble-tap' as const,
  },
  {
    id: 'import-cloud',
    title: 'Import from Cloud',
    description: 'Add and merge contacts from iCloud, Google contacts, Outlook, and more',
    Icon: ImportCloudIcon,
    route: '/add-contact/cloud' as const,
  },
  {
    id: 'paste-text',
    title: 'Paste Text',
    description: 'Copy and paste contact info from anywhere — email signatures, messages, or business cards',
    Icon: PasteTextIcon,
    route: '/add-contact/paste' as const,
  },
  {
    id: 'upload-photo',
    title: 'Upload Photo',
    description: 'Upload a photo or screenshot and let AI extract contact details automatically',
    Icon: UploadPhotoIcon,
    route: '/add-contact/photo' as const,
  },
  {
    id: 'manual-entry',
    title: 'Manual Entry',
    description: "Enter whatever info you have on hand and we'll update the contact",
    Icon: ManualEntryIcon,
    route: '/add-contact/manual' as const,
  },
];

export default function AddContactScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Header title="Add Contact Info" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={styles.option}
            onPress={() => router.push(opt.route)}
            activeOpacity={0.8}
          >
            <View style={styles.optionIcon}>
              <opt.Icon size={36} color={Colors.text} />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>{opt.title}</Text>
              <Text style={styles.optionDesc}>{opt.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingTop: 8,
    paddingHorizontal: 17,
    paddingBottom: 32,
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(17, 22, 51, 0.74)',
    borderWidth: 1,
    borderColor: Colors.stroke,
  },
  optionIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  optionDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
});

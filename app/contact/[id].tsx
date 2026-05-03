import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Share, TextInput, Keyboard, Animated, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Swipeable } from 'react-native-gesture-handler';
import { useStore, getTodayNoteDate } from '../../src/store';
import { Header, useHeaderInset } from '../../src/components/Header';
import { Avatar } from '../../src/components/Avatar';
import { useBottomNavDockInset } from '../../src/components/BottomNav';
import { InfoCard, InfoRow } from '../../src/components/InfoCard';
import { BubbleTags } from '../../src/components/BubbleTags';
import { SelectionSheet } from '../../src/components/SelectionSheet';
import { TrashIcon, CloseIcon } from '../../src/components/Icons';
import { BubbleColorKey, Colors, Radius, Shadows, Spacing } from '../../src/theme';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const contactId = parseInt(id, 10);

  const contact = useStore(s => s.contacts.find(c => c.id === contactId));
  const contactBubbles = useStore(s => s.bubbles.filter(b => b.contactIds.includes(contactId)));
  const addBubble = useStore(s => s.addBubble);
  const updateContact = useStore(s => s.updateContact);
  const bottomNavInset = useBottomNavDockInset();
  const headerInset = useHeaderInset();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [noteStatus, setNoteStatus] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [noteInputHeight, setNoteInputHeight] = useState(44);
  const [keyboardOffset] = useState(() => new Animated.Value(12));
  const [backdropOpacity] = useState(() => new Animated.Value(0));

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

  const handleAddNote = useCallback(() => {
    if (!contact) return;

    const text = noteDraft.trim();
    if (!text) {
      setNoteStatus('Enter a note to save it.');
      return;
    }

    const existingNotes = Array.isArray(contact.notes) ? contact.notes : [];
    updateContact(contact.id, {
      notes: [...existingNotes, { date: getTodayNoteDate(), text }],
    });
    setNoteDraft('');
    setNoteStatus('Note saved.');
  }, [contact, noteDraft, updateContact]);

  useEffect(() => {
    const animateComposer = (height: number, duration = 250) => {
      Animated.parallel([
        Animated.timing(keyboardOffset, {
          toValue: height + 12,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(backdropOpacity, {
          toValue: height > 0 && composerOpen ? 1 : 0,
          duration,
          useNativeDriver: false,
        }),
      ]).start();
    };

    const handleKeyboardShow = (event: any) => {
      const nextHeight = event.endCoordinates?.height || 0;
      const duration = event.duration ?? 250;
      setKeyboardHeight(nextHeight);
      animateComposer(nextHeight, duration);
    };
    const handleKeyboardHide = () => {
      setKeyboardHeight(0);
      setComposerOpen(false);
      animateComposer(0, 200);
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [backdropOpacity, composerOpen, keyboardOffset]);

  useEffect(() => {
    Animated.timing(backdropOpacity, {
      toValue: composerOpen ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [backdropOpacity, composerOpen]);

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
    contact.slack && { icon: 'slack' as const, text: `Slack ${contact.slack}`, label: 'Slack ', value: contact.slack, hideIcon: true },
    contact.teams && { icon: 'teams' as const, text: `Teams ${contact.teams}`, label: 'Teams ', value: contact.teams, hideIcon: true },
    contact.instagram && { icon: 'instagram' as const, text: `Instagram ${contact.instagram}`, label: 'Instagram ', value: contact.instagram, hideIcon: true },
    contact.twitter && { icon: 'twitter' as const, text: `Twitter ${contact.twitter}`, label: 'Twitter ', value: contact.twitter, hideIcon: true },
    contact.linkedin && { icon: 'linkedin' as const, text: `LinkedIn ${contact.linkedin}`, label: 'LinkedIn ', value: contact.linkedin, hideIcon: true },
    ...(contact.socialLinks?.map(l => ({
      icon: 'social' as const,
      text: [l.network, l.handle].filter(Boolean).join(' '),
      label: l.network ? `${l.network} ` : undefined,
      value: l.handle,
      hideIcon: true,
    })) || []),
  ].filter(r => r && r.text) as InfoRow[];

  const notes = Array.isArray(contact.notes) ? contact.notes : [];
  const hasNotes = notes.length > 0;
  const bubbleLabels = contactBubbles.map(b => b.label.replace(/\n/g, ' '));
  const bubbleIds = contactBubbles.map(b => b.id);
  const handleDeleteNote = useCallback((noteIndex: number) => {
    updateContact(contact.id, {
      notes: notes.filter((_, idx) => idx !== noteIndex),
    });
    setNoteStatus('Note deleted.');
  }, [contact.id, notes, updateContact]);
  const handleOpenComposer = useCallback(() => {
    setComposerOpen(true);
    setNoteStatus('');
  }, []);
  const handleCloseComposer = useCallback(() => {
    Animated.parallel([
      Animated.timing(keyboardOffset, {
        toValue: 12,
        duration: 180,
        useNativeDriver: false,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
    Keyboard.dismiss();
    setComposerOpen(false);
    setKeyboardHeight(0);
    setNoteInputHeight(44);
  }, [backdropOpacity, keyboardOffset]);
  const handleShare = useCallback(async () => {
    const shareLines = [
      contact.name,
      contact.email,
      contact.phone,
      contact.birthday ? `Birthday: ${contact.birthday}` : null,
    ].filter(Boolean);

    try {
      await Share.share({
        title: `${contact.name}'s contact card`,
        message: shareLines.join('\n'),
      });
    } catch {
      // Ignore share sheet dismiss and platform share errors for this lightweight action.
    }
  }, [contact]);

  const notesOverlayVisible = composerOpen;

  const renderNotesRows = () => (
    <>
      {hasNotes ? (
        notes.map((note, idx) => (
          <Swipeable
            key={`${note.date}-${idx}`}
            renderRightActions={() => (
              <TouchableOpacity
                style={styles.noteDeleteAction}
                onPress={() => handleDeleteNote(idx)}
                activeOpacity={0.8}
              >
                <TrashIcon size={22} color={Colors.text} />
              </TouchableOpacity>
            )}
            overshootRight={false}
            rightThreshold={36}
          >
            <View style={[styles.note, idx < notes.length - 1 && styles.noteBorder]}>
              <Text style={styles.noteDate}>{note.date}</Text>
              <Text style={styles.noteText}>{note.text}</Text>
            </View>
          </Swipeable>
        ))
      ) : (
        <View style={styles.note}>
          <Text style={styles.emptyNoteText}>No notes yet.</Text>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.screen}>
      <Header
        title={contact.name}
        showBack
        backStyle="pill"
        onBack={() => router.back()}
        centerTitle
      />

      <Animated.View
        pointerEvents={notesOverlayVisible ? 'auto' : 'none'}
        style={[styles.notesBackdrop, { opacity: backdropOpacity }]}
      >
        <BlurView intensity={42} tint="light" style={StyleSheet.absoluteFillObject} />
        <View style={styles.notesBackdropTint} />
      </Animated.View>

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
            onTagPress={bubbleId => router.push(`/bubble/${bubbleId}`)}
            onAdd={() => setSheetVisible(true)}
          />
        )}

        <InfoCard title="Contact Information" rows={contactRows} />

        {socialRows.length > 0 && (
          <InfoCard title="Links" rows={socialRows} />
        )}

        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>Notes</Text>
          {renderNotesRows()}
          <View style={styles.noteComposer}>
            <TouchableOpacity style={styles.noteInputLauncher} onPress={handleOpenComposer} activeOpacity={0.8}>
              <Text style={[styles.noteInputLauncherText, noteDraft ? styles.noteInputLauncherTextFilled : null]} numberOfLines={1}>
                {noteDraft || 'Where you met, what to remember...'}
              </Text>
            </TouchableOpacity>
            {noteStatus ? <Text style={styles.noteStatus}>{noteStatus}</Text> : null}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push({ pathname: '/add-contact/manual', params: { contactId: String(contactId) } })}
            activeOpacity={0.7}
          >
            <Text style={styles.actionBtnText}>Edit Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.7}>
            <Text style={styles.actionBtnText}>Share Contact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SelectionSheet
        visible={sheetVisible}
        title="Add to Bubble"
        subtitle="Select contacts to include in the new bubble."
        preselectedContactIds={[contactId]}
        onConfirm={handleAddToBubble}
        onCancel={() => setSheetVisible(false)}
      />

      {notesOverlayVisible && (
        <Animated.View style={[styles.notesOverlayCard, { bottom: keyboardOffset }]}>
          <Text style={styles.notesTitle}>Notes</Text>
          <ScrollView
            style={styles.notesListFloating}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {renderNotesRows()}
          </ScrollView>
          <View style={styles.noteComposer}>
            <View style={styles.noteInputRow}>
              <TextInput
                style={[styles.noteInput, { height: Math.max(44, noteInputHeight) }]}
                value={noteDraft}
                onChangeText={text => {
                  setNoteDraft(text);
                  if (noteStatus) setNoteStatus('');
                }}
                onContentSizeChange={event => {
                  const nextHeight = Math.min(180, Math.max(44, Math.ceil(event.nativeEvent.contentSize.height) + 16));
                  setNoteInputHeight(nextHeight);
                }}
                placeholder="Where you met, what to remember..."
                placeholderTextColor={Colors.textMuted}
                multiline
                returnKeyType="send"
                onSubmitEditing={handleAddNote}
                autoFocus
                blurOnSubmit={false}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.noteCloseButton} onPress={handleCloseComposer} activeOpacity={0.7}>
                <CloseIcon size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            {noteStatus ? <Text style={styles.noteStatus}>{noteStatus}</Text> : null}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.appBg,
  },
  notesBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
  },
  notesBackdropTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 24, 48, 0.16)',
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
  notesOverlayCard: {
    position: 'absolute',
    left: 17,
    right: 17,
    zIndex: 30,
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
  noteDeleteAction: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B84D57',
  },
  emptyNoteText: {
    fontSize: 15,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  noteComposer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.stroke,
  },
  notesListFloating: {
    maxHeight: 320,
  },
  noteInputLauncher: {
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBg,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  noteInputLauncherText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  noteInputLauncherTextFilled: {
    color: Colors.text,
  },
  noteInputRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  noteInput: {
    width: '100%',
    minHeight: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingRight: 44,
    color: Colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  noteCloseButton: {
    position: 'absolute',
    right: 6,
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  noteStatus: {
    fontSize: 13,
    color: Colors.textMuted,
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
  notFound: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: 40,
  },
});

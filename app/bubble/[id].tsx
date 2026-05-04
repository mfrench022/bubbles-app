import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, LayoutChangeEvent } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { Header, useHeaderInset } from '../../src/components/Header';
import { BubbleChart } from '../../src/components/BubbleChart';
import { ContactCard } from '../../src/components/ContactCard';
import {
  BOTTOM_NAV_BOTTOM_GUTTER,
  BOTTOM_NAV_SHELL_HEIGHT,
  useBottomNavInset,
} from '../../src/components/BottomNav';
import { SelectionSheet } from '../../src/components/SelectionSheet';
import { BubbleColorKey, Colors } from '../../src/theme';
import { ContactModeButton } from '../../src/components/ContactModeButton';
import { GlassIconButton } from '../../src/components/GlassIconButton';
import { PlusIcon } from '../../src/components/Icons';
import { AddContactsSheet } from '../../src/components/AddContactsSheet';

export default function BubbleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const bubble = useStore(s => s.bubbles.find(b => b.id === id));
  const contacts = useStore(s => s.contacts);
  const addBubble = useStore(s => s.addBubble);
  const updateBubble = useStore(s => s.updateBubble);
  const addContactsToBubble = useStore(s => s.addContactsToBubble);
  const bottomNavInset = useBottomNavInset();
  const headerInset = useHeaderInset();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<'bubble' | 'contact'>('bubble');
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetPreselectedIds, setSheetPreselectedIds] = useState<number[]>([]);
  const [sheetInitialName, setSheetInitialName] = useState('New Bubble');
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [addContactsVisible, setAddContactsVisible] = useState(false);

  const handleChartLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartSize({ width, height });
  }, []);

  const handleSubBubbleTap = useCallback((bubbleId: string) => {
    router.push(`/bubble/${bubbleId}`);
  }, [router]);

  const handleAvatarTap = useCallback((contactId: number) => {
    router.push(`/contact/${contactId}`);
  }, [router]);

  const handleBackgroundTap = useCallback(() => {
    if (bubble?.parentId) {
      router.replace(`/bubble/${bubble.parentId}`);
      return;
    }
    router.replace('/');
  }, [bubble?.parentId, router]);

  const handleCreateBubble = useCallback((name: string, contactIds: number[], colorKey: BubbleColorKey) => {
    if (!bubble) return;
    const newBubble = addBubble({
      label: name,
      x: bubble.x + 5,
      y: bubble.y + 5,
      size: 0,
      colorKey,
      contactIds,
      subBubbleIds: [],
      parentId: bubble.id,
    });
    updateBubble(bubble.id, {
      subBubbleIds: [...(bubble.subBubbleIds || []), newBubble.id],
    });
    setSheetVisible(false);
    setSheetPreselectedIds([]);
    setSheetInitialName('New Bubble');
  }, [bubble, addBubble, updateBubble]);

  const handleCreateBubbleRequest = useCallback((options: {
    parentBubbleId?: string;
    preselectedContactIds: number[];
    initialBubbleName?: string;
  }) => {
    if (!bubble || options.parentBubbleId !== bubble.id) return;
    setSheetPreselectedIds(options.preselectedContactIds);
    setSheetInitialName(options.initialBubbleName || 'New Bubble');
    setSheetVisible(true);
  }, [bubble]);

  const handleAddContacts = useCallback((selectedContactIds: number[]) => {
    if (!bubble || selectedContactIds.length === 0) return;
    addContactsToBubble(bubble.id, selectedContactIds);
    setAddContactsVisible(false);
  }, [addContactsToBubble, bubble]);

  const handleEditBubble = useCallback((name: string, contactIds: number[], colorKey: BubbleColorKey) => {
    if (!bubble) return;
    const descendantContactIds = Array.from(useStore.getState().getDescendantContactIds(bubble.id));
    const nextContactIds = [...new Set([...contactIds, ...descendantContactIds])];
    updateBubble(bubble.id, {
      label: name,
      colorKey,
      contactIds: nextContactIds,
    });
    setEditSheetVisible(false);
  }, [bubble, updateBubble]);

  if (!bubble) {
    return (
      <View style={styles.screen}>
        <Header title="Bubble" centerTitle />
        <Text style={styles.notFound}>Bubble not found.</Text>
      </View>
    );
  }

  const contactsInBubble = bubble.contactIds
    .map(id => contacts.find(c => c.id === id))
    .filter(Boolean) as typeof contacts;
  const availableContacts = useMemo(
    () => contacts.filter(contact => !bubble.contactIds.includes(contact.id)),
    [bubble.contactIds, contacts]
  );
  const sortedContacts = [...contactsInBubble].sort((a, b) => a.name.localeCompare(b.name));
  const title = bubble.label.replace(/\n/g, ' ');

  return (
    <View style={styles.screen}>
      <Header
        title={title}
        centerTitle
        onTitlePress={() => setEditSheetVisible(true)}
        leftSlot={(
          <ContactModeButton
            active={mode === 'contact'}
            onPress={() => setMode(prev => (prev === 'bubble' ? 'contact' : 'bubble'))}
          />
        )}
        showSearch
        onSearchContactPress={cid => router.push(`/contact/${cid}`)}
      />

      {mode === 'bubble' ? (
        <View
          style={[
            styles.chartContainer,
            { marginTop: headerInset, marginBottom: Math.max(bottomNavInset, 12) },
          ]}
          onLayout={handleChartLayout}
        >
          {chartSize.width > 0 && (
            <BubbleChart
              chartWidth={chartSize.width}
              chartHeight={chartSize.height}
              onBubbleTap={handleSubBubbleTap}
              onAvatarTap={handleAvatarTap}
              onBackgroundTap={handleBackgroundTap}
              filterBubbleId={id}
              onCreateBubbleRequest={handleCreateBubbleRequest}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={sortedContacts}
          keyExtractor={item => String(item.id)}
          style={styles.list}
          contentContainerStyle={{ paddingTop: headerInset, paddingBottom: bottomNavInset }}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onPress={() => router.push(`/contact/${item.id}`)}
            />
          )}
        />
      )}
      {mode === 'bubble' ? (
        <View
          style={[
            styles.floatingAddButton,
            { bottom: BOTTOM_NAV_SHELL_HEIGHT + Math.max(insets.bottom, BOTTOM_NAV_BOTTOM_GUTTER) + 22 },
          ]}
        >
          <GlassIconButton onPress={() => setAddContactsVisible(true)} size={64}>
            <PlusIcon size={28} color={Colors.textMuted} />
          </GlassIconButton>
        </View>
      ) : null}
      <SelectionSheet
        visible={sheetVisible}
        title="Create Sub-Bubble"
        subtitle="Select contacts to include."
        preselectedContactIds={sheetPreselectedIds.length > 0 ? sheetPreselectedIds : bubble.contactIds}
        initialBubbleName={sheetInitialName}
        preselectedColorKey={bubble.colorKey}
        onConfirm={handleCreateBubble}
        onCancel={() => {
          setSheetVisible(false);
          setSheetPreselectedIds([]);
          setSheetInitialName('New Bubble');
        }}
      />
      <SelectionSheet
        visible={editSheetVisible}
        title="Edit Bubble"
        subtitle="Update the bubble name, color, and contacts."
        confirmLabel="Save"
        preselectedContactIds={bubble.contactIds}
        initialBubbleName={title}
        preselectedColorKey={bubble.colorKey}
        onConfirm={handleEditBubble}
        onCancel={() => setEditSheetVisible(false)}
      />
      <AddContactsSheet
        visible={addContactsVisible}
        title={`Add to ${title}`}
        subtitle="Select contacts to add to this bubble."
        contacts={availableContacts}
        onConfirm={handleAddContacts}
        onCancel={() => setAddContactsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  chartContainer: {
    flex: 1,
  },
  floatingAddButton: {
    position: 'absolute',
    right: 18,
    zIndex: 80,
  },
  list: {
    flex: 1,
    paddingHorizontal: 17,
    paddingTop: 10,
  },
  notFound: {
    flex: 1,
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: 40,
  },
});

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, LayoutChangeEvent } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { Header, useHeaderInset } from '../../src/components/Header';
import { BubbleChart } from '../../src/components/BubbleChart';
import { ContactCard } from '../../src/components/ContactCard';
import { useBottomNavInset } from '../../src/components/BottomNav';
import { SelectionSheet } from '../../src/components/SelectionSheet';
import { BubbleColorKey, Colors } from '../../src/theme';
import { ContactModeButton } from '../../src/components/ContactModeButton';
import { GlassIconButton } from '../../src/components/GlassIconButton';
import { BackChevronIcon } from '../../src/components/Icons';

export default function BubbleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const bubble = useStore(s => s.bubbles.find(b => b.id === id));
  const contacts = useStore(s => s.contacts);
  const addBubble = useStore(s => s.addBubble);
  const updateBubble = useStore(s => s.updateBubble);
  const bottomNavInset = useBottomNavInset();
  const headerInset = useHeaderInset();

  const [mode, setMode] = useState<'bubble' | 'contact'>('bubble');
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetPreselectedIds, setSheetPreselectedIds] = useState<number[]>([]);
  const [sheetInitialName, setSheetInitialName] = useState('New Bubble');

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

  if (!bubble) {
    return (
      <View style={styles.screen}>
        <Header title="Bubble" showBack onBack={() => router.back()} centerTitle />
        <Text style={styles.notFound}>Bubble not found.</Text>
      </View>
    );
  }

  const contactsInBubble = bubble.contactIds
    .map(id => contacts.find(c => c.id === id))
    .filter(Boolean) as typeof contacts;
  const sortedContacts = [...contactsInBubble].sort((a, b) => a.name.localeCompare(b.name));
  const title = bubble.label.replace(/\n/g, ' ');

  return (
    <View style={styles.screen}>
      <Header
        title={title}
        centerTitle
        leftSlot={(
          <>
            <GlassIconButton onPress={() => router.back()}>
              <BackChevronIcon size={20} color={Colors.textMuted} />
            </GlassIconButton>
            <ContactModeButton
              active={mode === 'contact'}
              onPress={() => setMode(prev => (prev === 'bubble' ? 'contact' : 'bubble'))}
            />
          </>
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

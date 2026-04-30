import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, LayoutChangeEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { Header } from '../../src/components/Header';
import { BubbleChart } from '../../src/components/BubbleChart';
import { ContactCard } from '../../src/components/ContactCard';
import { useBottomNavInset } from '../../src/components/BottomNav';
import { SelectionSheet } from '../../src/components/SelectionSheet';
import { BubbleColorKey, Colors } from '../../src/theme';
import { ContactModeButton } from '../../src/components/ContactModeButton';

export default function MainScreen() {
  const router = useRouter();
  const contacts = useStore(s => s.contacts);
  const bubbles = useStore(s => s.bubbles);
  const addBubble = useStore(s => s.addBubble);
  const bottomNavInset = useBottomNavInset();

  const [mode, setMode] = useState<'bubble' | 'contact'>('bubble');
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [selectedBubbleFilters, setSelectedBubbleFilters] = useState<Set<string>>(new Set());
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleChartLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartSize({ width, height });
  }, []);

  const handleBubbleTap = useCallback((bubbleId: string) => {
    router.push(`/bubble/${bubbleId}`);
  }, [router]);

  const handleAvatarTap = useCallback((contactId: number) => {
    router.push(`/contact/${contactId}`);
  }, [router]);

  const handleAddBubbleTap = useCallback(() => {
    setSheetVisible(true);
  }, []);

  const handleBubbleTagPress = useCallback((bubbleId: string) => {
    setSelectedBubbleFilters(prev => {
      const next = new Set(prev);
      if (next.has(bubbleId)) next.delete(bubbleId);
      else next.add(bubbleId);
      return next;
    });
  }, []);

  const filteredContacts = selectedBubbleFilters.size > 0
    ? contacts.filter(c =>
        bubbles.filter(b => b.contactIds.includes(c.id)).some(b => selectedBubbleFilters.has(b.id))
      )
    : contacts;

  const sortedContacts = [...filteredContacts].sort((a, b) => a.name.localeCompare(b.name));

  const handleCreateBubble = useCallback((name: string, selectedContactIds: number[], colorKey: BubbleColorKey) => {
    addBubble({
      label: name,
      x: 40,
      y: 40,
      size: 22,
      colorKey,
      contactIds: selectedContactIds,
      subBubbleIds: [],
    });
    setSheetVisible(false);
  }, [addBubble]);

  return (
    <View style={styles.screen}>
      <Header
        title={mode === 'bubble' ? 'Bubbles' : 'Contacts'}
        centerTitle
        leftSlot={(
          <ContactModeButton
            active={mode === 'contact'}
            onPress={() => setMode(prev => (prev === 'bubble' ? 'contact' : 'bubble'))}
          />
        )}
        showSearch
        onSearchContactPress={id => router.push(`/contact/${id}`)}
      />

      {mode === 'bubble' ? (
        <View style={styles.chartContainer} onLayout={handleChartLayout}>
          {chartSize.width > 0 && (
            <BubbleChart
              chartWidth={chartSize.width}
              chartHeight={chartSize.height}
              onBubbleTap={handleBubbleTap}
              onAvatarTap={handleAvatarTap}
              onAddBubbleTap={handleAddBubbleTap}
              interactiveCanvas
            />
          )}
        </View>
      ) : (
        <FlatList
          data={sortedContacts}
          keyExtractor={item => String(item.id)}
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomNavInset }]}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onPress={() => router.push(`/contact/${item.id}`)}
              selectedBubbleFilters={selectedBubbleFilters}
              onBubbleTagPress={handleBubbleTagPress}
            />
          )}
        />
      )}

      <SelectionSheet
        visible={sheetVisible}
        title="Create Bubble"
        subtitle="Select contacts to include in the new bubble."
        onConfirm={handleCreateBubble}
        onCancel={() => setSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.appBg,
  },
  chartContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 17,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 2,
  },
});

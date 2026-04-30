import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, ViewStyle, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { Colors, Radius, Shadows, Typography } from '../theme';
import { SearchIcon, BackChevronIcon, BackIcon, CloseIcon } from './Icons';
import { Avatar } from './Avatar';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backStyle?: 'arrow' | 'pill';
  onBack?: () => void;
  showSearch?: boolean;
  onSearchContactPress?: (contactId: number) => void;
  rightSlot?: React.ReactNode;
  centerTitle?: boolean;
  leftSlot?: React.ReactNode;
}

export function Header({
  title,
  showBack = false,
  backStyle = 'pill',
  onBack,
  showSearch = false,
  onSearchContactPress,
  rightSlot,
  centerTitle = false,
  leftSlot,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const contacts = useStore(s => s.contacts);

  const topPad = Math.max(36, insets.top + 10);
  const minHeight = Math.max(84, insets.top + 56);

  const searchResults = searchOpen && searchQuery.trim()
    ? contacts.filter(c => {
        const hay = [c.name, c.email, c.phone, c.company, c.title].filter(Boolean).join(' ').toLowerCase();
        return searchQuery.trim().toLowerCase().split(/\s+/).every(t => hay.includes(t));
      })
    : [];

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setSearchQuery('');
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  const handleResultPress = useCallback((contactId: number) => {
    closeSearch();
    onSearchContactPress?.(contactId);
  }, [closeSearch, onSearchContactPress]);

  return (
    <View style={[styles.container, { paddingTop: topPad, minHeight }]}>
      <BlurView
        pointerEvents="none"
        intensity={14}
        tint="light"
        style={styles.headerBlur}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
        locations={[0, 0.38, 1]}
        style={styles.headerFeather}
      />
      {searchOpen ? (
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={closeSearch} style={styles.searchBackBtn}>
            <SearchIcon size={20} color={Colors.textMuted} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search contacts"
            placeholderTextColor={Colors.textMuted}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClear}>
              <CloseIcon size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.row}>
          <View style={styles.sideRail}>
            {leftSlot ? (
              <View style={styles.leftSlot}>{leftSlot}</View>
            ) : showBack ? (
              backStyle === 'arrow' ? (
                <TouchableOpacity onPress={onBack} style={styles.backArrow} activeOpacity={0.7}>
                  <BackChevronIcon size={20} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={onBack} style={styles.backPill} activeOpacity={0.7}>
                  <BackIcon size={20} />
                </TouchableOpacity>
              )
            ) : null}
          </View>

          <View style={styles.titleWrap}>
            <Text
              style={[
                styles.title,
                centerTitle && styles.titleCenter,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          <View style={[styles.sideRail, styles.sideRailRight]}>
            {showSearch ? (
              <TouchableOpacity onPress={openSearch} style={styles.iconBtn} activeOpacity={0.7}>
                <SearchIcon size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            ) : rightSlot ? (
              <View style={styles.rightSlot}>{rightSlot}</View>
            ) : null}
          </View>
        </View>
      )}

      {searchOpen && searchQuery.trim().length > 0 && (
        <View style={styles.searchResults}>
          {searchResults.length === 0 ? (
            <Text style={styles.searchEmpty}>No matching contacts</Text>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={item => String(item.id)}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchResult}
                  onPress={() => handleResultPress(item.id)}
                  activeOpacity={0.7}
                >
                  <Avatar
                    name={item.name}
                    color={item.color}
                    image={item.image}
                    size={42}
                    showBorder
                  />
                  <Text style={styles.searchResultName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 20,
    flexShrink: 0,
    paddingHorizontal: 17,
    paddingBottom: 8,
  },
  headerFeather: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 88,
  },
  headerBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -72,
    height: 132,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
  },
  sideRail: {
    width: 110,
    minHeight: 46,
    justifyContent: 'center',
  },
  sideRailRight: {
    alignItems: 'flex-end',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  title: {
    ...Typography.title,
    lineHeight: 38,
    textAlign: 'center',
  },
  titleCenter: {
    fontSize: 20,
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  rightSlot: {
    flexShrink: 0,
  },
  leftSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: 23,
    backgroundColor: Colors.iconBtn,
    borderWidth: 1,
    borderColor: Colors.iconBtnBorder,
    ...Shadows.card,
  },
  backArrow: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: 23,
    backgroundColor: Colors.iconBtn,
    borderWidth: 1,
    borderColor: Colors.iconBtnBorder,
    ...Shadows.card,
  },
  backPill: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: 23,
    backgroundColor: Colors.iconBtn,
    borderWidth: 1,
    borderColor: Colors.iconBtnBorder,
    ...Shadows.card,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBg,
    overflow: 'hidden',
    ...Shadows.card,
  },
  searchBackBtn: {
    width: 48,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: 52,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  searchClear: {
    width: 48,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResults: {
    marginTop: 8,
    borderRadius: Radius.xl,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    overflow: 'hidden',
    maxHeight: 360,
    ...Shadows.card,
  },
  searchEmpty: {
    padding: 17,
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 58,
  },
  searchResultName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
  },
});

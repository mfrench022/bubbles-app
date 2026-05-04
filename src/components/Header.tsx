import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { Colors, Radius, Shadows, Typography } from '../theme';
import { SearchIcon, BackChevronIcon, BackIcon, CloseIcon } from './Icons';
import { Avatar } from './Avatar';
import { GlassIconButton } from './GlassIconButton';

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
  reserveSideRails?: boolean;
  onTitlePress?: () => void;
}

export const HEADER_ROW_HEIGHT = 46;
export const HEADER_BOTTOM_GAP = 8;
export const HEADER_HORIZONTAL_PADDING = 17;

export function useHeaderInset() {
  const insets = useSafeAreaInsets();
  const topPad = Math.max(36, insets.top + 10);
  return topPad + HEADER_ROW_HEIGHT + HEADER_BOTTOM_GAP;
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
  reserveSideRails = true,
  onTitlePress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
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
    setSearchFocused(false);
  }, []);

  const dismissSearchKeyboard = useCallback(() => {
    closeSearch();
    Keyboard.dismiss();
  }, [closeSearch]);

  useEffect(() => {
    const collapseSearch = () => {
      if (searchOpen) {
        closeSearch();
      }
    };

    const willHideSubscription = Keyboard.addListener('keyboardWillHide', collapseSearch);
    const didHideSubscription = Keyboard.addListener('keyboardDidHide', collapseSearch);

    return () => {
      willHideSubscription.remove();
      didHideSubscription.remove();
    };
  }, [searchOpen, closeSearch]);

  const handleResultPress = useCallback((contactId: number) => {
    closeSearch();
    onSearchContactPress?.(contactId);
  }, [closeSearch, onSearchContactPress]);

  return (
    <View style={[styles.container, { paddingTop: topPad, minHeight }]}>
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
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search contacts"
            placeholderTextColor={Colors.textMuted}
            autoFocus
            returnKeyType="search"
          />
          {searchFocused && (
            <TouchableOpacity onPress={dismissSearchKeyboard} style={styles.searchClear}>
              <CloseIcon size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.row}>
          <View style={[styles.sideRail, !reserveSideRails && styles.sideRailCollapsed]}>
            {leftSlot ? (
              <View style={styles.leftSlot}>{leftSlot}</View>
            ) : showBack ? (
              backStyle === 'arrow' ? (
                <GlassIconButton onPress={onBack}>
                  <BackChevronIcon size={20} color={Colors.textMuted} />
                </GlassIconButton>
              ) : (
                <GlassIconButton onPress={onBack}>
                  <BackIcon size={20} color={Colors.textMuted} />
                </GlassIconButton>
              )
            ) : null}
          </View>

          <View style={styles.titleWrap}>
            <View style={styles.titlePillShadow}>
              {onTitlePress ? (
                <TouchableOpacity
                  onPress={onTitlePress}
                  activeOpacity={0.82}
                  style={styles.titlePillInner}
                >
                  <BlurView pointerEvents="none" intensity={70} tint="light" style={StyleSheet.absoluteFillObject} />
                  <LinearGradient
                    pointerEvents="none"
                    colors={['rgba(255,255,255,0.40)', 'rgba(255,255,255,0.10)']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <LinearGradient
                    pointerEvents="none"
                    colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0)']}
                    style={styles.titlePillSpecular}
                  />
                  <Text
                    style={[styles.title, centerTitle && styles.titleCenter]}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.titlePillInner}>
                  <BlurView pointerEvents="none" intensity={70} tint="light" style={StyleSheet.absoluteFillObject} />
                  <LinearGradient
                    pointerEvents="none"
                    colors={['rgba(255,255,255,0.40)', 'rgba(255,255,255,0.10)']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <LinearGradient
                    pointerEvents="none"
                    colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0)']}
                    style={styles.titlePillSpecular}
                  />
                  <Text
                    style={[styles.title, centerTitle && styles.titleCenter]}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.sideRail, styles.sideRailRight, !reserveSideRails && styles.sideRailCollapsed]}>
            {showSearch ? (
              <GlassIconButton onPress={openSearch}>
                <SearchIcon size={22} color={Colors.textMuted} />
              </GlassIconButton>
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
              keyboardShouldPersistTaps="handled"
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingBottom: HEADER_BOTTOM_GAP,
  },
  headerFeather: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 88,
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
  sideRailCollapsed: {
    width: 0,
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
  titlePillShadow: {
    alignSelf: 'center',
    shadowColor: '#5A5040',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  titlePillInner: {
    overflow: 'hidden',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    paddingHorizontal: 18,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  titlePillSpecular: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    borderTopLeftRadius: Radius.full,
    borderTopRightRadius: Radius.full,
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

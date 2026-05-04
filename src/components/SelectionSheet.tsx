import React, { useState, useCallback, useEffect } from 'react';
import {
  Animated, View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, Pressable, ScrollView,
} from 'react-native';
import { useStore } from '../store';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {
  BUBBLE_COLOR_OPTIONS,
  BubbleColorKey,
  Colors,
  Radius,
  Spacing,
  getBubblePalette,
} from '../theme';
import { Avatar } from './Avatar';
import { useSwipeDismiss } from './useSwipeDismiss';

const EMPTY_CONTACT_IDS: number[] = [];

interface SelectionSheetProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  preselectedContactIds?: number[];
  initialBubbleName?: string;
  preselectedColorKey?: BubbleColorKey;
  onConfirm: (bubbleName: string, selectedContactIds: number[], colorKey: BubbleColorKey) => void;
  onCancel: () => void;
}

export function SelectionSheet({
  visible,
  title = 'Add to New Bubble',
  subtitle = 'Select more contacts to include.',
  confirmLabel = 'Done',
  preselectedContactIds = EMPTY_CONTACT_IDS,
  initialBubbleName = 'New Bubble',
  preselectedColorKey = 'violet',
  onConfirm,
  onCancel,
}: SelectionSheetProps) {
  const contacts = useStore(s => s.contacts);
  const [bubbleName, setBubbleName] = useState(initialBubbleName);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(preselectedContactIds));
  const [colorKey, setColorKey] = useState<BubbleColorKey>(preselectedColorKey);
  const { animatedStyle, handleGestureEvent, handleGestureStateChange } = useSwipeDismiss({ visible, onDismiss: onCancel });

  useEffect(() => {
    if (!visible) return;
    setBubbleName(initialBubbleName);
    setSearchQuery('');
    setSelectedIds(new Set(preselectedContactIds));
    setColorKey(preselectedColorKey);
  }, [initialBubbleName, preselectedColorKey, preselectedContactIds, visible]);

  const filtered = searchQuery.trim()
    ? contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  const toggleContact = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(bubbleName || 'New Bubble', Array.from(selectedIds), colorKey);
  }, [bubbleName, colorKey, selectedIds, onConfirm]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View pointerEvents="box-none" style={styles.panelContainer}>
          <Animated.View style={[styles.panel, animatedStyle]}>
            <PanGestureHandler
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={handleGestureStateChange}
            >
              <Animated.View style={styles.dragHandle}>
                <View style={styles.grabber} />
              </Animated.View>
            </PanGestureHandler>

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Bubble Name</Text>
                <TextInput
                  style={styles.input}
                  value={bubbleName}
                  onChangeText={setBubbleName}
                  placeholder="New Bubble"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Color</Text>
                <View style={styles.colorGrid}>
                  {BUBBLE_COLOR_OPTIONS.map(option => {
                    const palette = getBubblePalette(option.key);
                    const selected = colorKey === option.key;
                    return (
                      <TouchableOpacity
                        key={option.key}
                        style={[styles.colorOption, selected && styles.colorOptionSelected]}
                        onPress={() => setColorKey(option.key)}
                        activeOpacity={0.85}
                      >
                        <LinearGradient
                          colors={palette.colors}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.colorSwatch}
                        />
                        <Text style={[styles.colorLabel, selected && styles.colorLabelSelected]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Search Contacts</Text>
                <TextInput
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search all contacts"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {filtered.map(contact => (
                <TouchableOpacity
                  key={contact.id}
                  style={[styles.contactRow, selectedIds.has(contact.id) && styles.contactRowSelected]}
                  onPress={() => toggleContact(contact.id)}
                  activeOpacity={0.7}
                >
                  <Avatar name={contact.name} color={contact.color} image={contact.image} size={40} />
                  <Text style={styles.contactName} numberOfLines={1}>{contact.name}</Text>
                  <View style={[styles.check, selectedIds.has(contact.id) && styles.checkSelected]}>
                    {selectedIds.has(contact.id) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={onCancel} activeOpacity={0.7}>
                <Text style={styles.actionBtnText}>Not Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnPrimary]}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionBtnText, styles.actionBtnPrimaryText]}>{confirmLabel}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 36, 48, 0.28)',
  },
  panelContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  panel: {
    width: '100%',
    backgroundColor: Colors.sheetBg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.stroke,
    maxHeight: '80%',
    paddingBottom: 32,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 10,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.strokeStrong,
    alignSelf: 'center',
  },
  dragHandle: {
    height: 28,
    justifyContent: 'center',
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  fields: {
    paddingHorizontal: Spacing.xl,
    gap: 10,
    marginBottom: 8,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 14,
    color: Colors.text,
    fontSize: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: '18%',
    minWidth: 60,
    alignItems: 'center',
    gap: 6,
  },
  colorOptionSelected: {
    transform: [{ scale: 1.04 }],
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  colorLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  colorLabelSelected: {
    color: Colors.text,
  },
  list: {
    maxHeight: 280,
    marginHorizontal: Spacing.xl,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    paddingHorizontal: 8,
  },
  contactRowSelected: {
    backgroundColor: Colors.primary,
  },
  contactName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  checkSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primarySolid,
  },
  checkmark: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.xl,
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primarySolid,
    borderColor: Colors.primarySolid,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  actionBtnPrimaryText: {
    color: Colors.inverseText,
  },
});

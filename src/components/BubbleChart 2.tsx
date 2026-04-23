import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { Bubble } from '../data/bubbles';
import { layoutAvatars, layoutTopLevelBubbles, layoutNestedBubbles, Circle } from '../utils/layout';
import { Avatar } from './Avatar';
import { Colors, Shadows } from '../theme';

interface BubbleChartProps {
  chartWidth: number;
  chartHeight: number;
  onBubbleTap: (bubbleId: string) => void;
  onAvatarTap: (contactId: number) => void;
  onAvatarLongPress?: (contactId: number, bubbleId: string) => void;
  filterBubbleId?: string;
}

interface RenderedAvatar {
  contactId: number;
  bubbleId: string;
  left: number;
  top: number;
  size: number;
}

interface RenderedBubble {
  bubble: Bubble;
  left: number;
  top: number;
  pxSize: number;
  cx: number;
  cy: number;
  hiddenShell?: boolean;
}

export function BubbleChart({
  chartWidth,
  chartHeight,
  onBubbleTap,
  onAvatarTap,
  onAvatarLongPress,
  filterBubbleId,
}: BubbleChartProps) {
  const { bubbles, contacts, getVisualContactIds, getDescendantContactIds } = useStore(s => ({
    bubbles: s.bubbles,
    contacts: s.contacts,
    getVisualContactIds: s.getVisualContactIds,
    getDescendantContactIds: s.getDescendantContactIds,
  }));

  const getContact = useCallback((id: number) => contacts.find(c => c.id === id), [contacts]);

  const { renderedBubbles, renderedAvatars } = useMemo(() => {
    if (!chartWidth || !chartHeight) return { renderedBubbles: [], renderedAvatars: [] };

    const topLevelBubbles = filterBubbleId
      ? bubbles.filter(b => b.id === filterBubbleId)
      : bubbles.filter(b => !b.parentId);

    const layoutMap = filterBubbleId
      ? (() => {
          const bubble = bubbles.find(b => b.id === filterBubbleId);
          if (!bubble) return new Map();
          const padding = 24;
          const size = Math.min(chartWidth, chartHeight) - padding * 2;
          return new Map([[filterBubbleId, {
            ...bubble,
            x: ((chartWidth - size) / 2 / chartWidth) * 100,
            y: ((chartHeight - size) / 2 / chartHeight) * 100,
            size: (size / chartWidth) * 100,
          }]]);
        })()
      : layoutTopLevelBubbles(bubbles, chartWidth, chartHeight);

    const rBubbles: RenderedBubble[] = [];
    const rAvatars: RenderedAvatar[] = [];

    const processBubble = (
      bubble: Bubble,
      layoutData: { x: number; y: number; size: number },
      options?: { hiddenShell?: boolean }
    ) => {
      const pxX = (layoutData.x / 100) * chartWidth;
      const pxY = (layoutData.y / 100) * chartHeight;
      const pxSize = (layoutData.size / 100) * chartWidth;
      const radius = pxSize / 2;
      const cx = pxX + radius;
      const cy = pxY + radius;

      rBubbles.push({ bubble, left: pxX, top: pxY, pxSize, cx, cy, hiddenShell: options?.hiddenShell });

      const nestedBubbles = (bubble.subBubbleIds || []).map(sid => bubbles.find(b => b.id === sid)).filter(Boolean) as Bubble[];
      let nestedLayouts: Array<{ id: string; x: number; y: number; size: number }> = [];

      if (nestedBubbles.length > 0) {
        nestedLayouts = layoutNestedBubbles(layoutData, nestedBubbles, chartWidth, chartHeight);
        nestedLayouts.forEach((nl, i) => {
          processBubble(nestedBubbles[i], nl);
        });
      }

      const visualContactIds = getVisualContactIds(bubble);
      const rawAvatarSize = Math.max(18, radius * 0.38);
      const labelReserveRadius = Math.min(radius * 0.34, Math.max(26, bubble.label.replace(/\n/g, '').length * 4.2));
      const exclusionCircles: Circle[] = [{ x: 0, y: 0, r: labelReserveRadius }];

      nestedLayouts.forEach(nl => {
        const subPxX = (nl.x / 100) * chartWidth;
        const subPxY = (nl.y / 100) * chartHeight;
        const subRadius = ((nl.size / 100) * chartWidth) / 2;
        exclusionCircles.push({
          x: subPxX + subRadius - cx,
          y: subPxY + subRadius - cy,
          r: subRadius,
        });
      });

      const { avatarSize, offsets } = layoutAvatars(visualContactIds.length, radius, rawAvatarSize, {
        exclusionCircles,
        minAvatarSize: bubble.parentId ? 16 : 18,
        spacing: bubble.parentId ? 6 : 8,
        edgePadding: bubble.parentId ? 8 : 10,
      });

      visualContactIds.forEach((contactId, i) => {
        if (!offsets[i]) return;
        rAvatars.push({
          contactId,
          bubbleId: bubble.id,
          left: cx + offsets[i].x - avatarSize / 2,
          top: cy + offsets[i].y - avatarSize / 2,
          size: avatarSize,
        });
      });
    };

    topLevelBubbles.forEach(bubble => {
      const layout = layoutMap.get(bubble.id);
      if (layout) processBubble(bubble, layout, { hiddenShell: filterBubbleId === bubble.id });
    });

    return { renderedBubbles: rBubbles, renderedAvatars: rAvatars };
  }, [bubbles, contacts, chartWidth, chartHeight, filterBubbleId, getVisualContactIds]);

  if (!chartWidth || !chartHeight) return null;

  return (
    <View style={[styles.chart, { width: chartWidth, height: chartHeight }]}>
      <View style={styles.bgGlow} pointerEvents="none" />

      {renderedAvatars.map((av, idx) => {
        const contact = getContact(av.contactId);
        if (!contact) return null;
        return (
          <Avatar
            key={`${av.bubbleId}-${av.contactId}-${idx}`}
            name={contact.name}
            color={contact.color}
            image={contact.image}
            size={av.size}
            showBorder
            style={{
              position: 'absolute',
              left: av.left,
              top: av.top,
              zIndex: 1,
            } as ViewStyle}
            onPress={() => onAvatarTap(av.contactId)}
            onLongPress={onAvatarLongPress ? () => onAvatarLongPress(av.contactId, av.bubbleId) : undefined}
          />
        );
      })}

      {renderedBubbles.map(({ bubble, left, top, pxSize, hiddenShell }) => {
        if (hiddenShell) return null;
        return (
          <TouchableOpacity
            key={bubble.id}
            style={[
              styles.bubble,
              bubble.parentId ? styles.bubbleSub : null,
              pxSize <= 88 ? styles.bubbleSmall : null,
              {
                left,
                top,
                width: pxSize,
                height: pxSize,
                borderRadius: pxSize / 2,
                zIndex: bubble.parentId ? 4 : 3,
              },
            ]}
            onPress={() => onBubbleTap(bubble.id)}
            activeOpacity={0.92}
          >
            <BlurView
              intensity={60}
              tint="light"
              style={[StyleSheet.absoluteFill, { borderRadius: pxSize / 2 }]}
            />
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.26)',
                'rgba(255,255,255,0.08)',
                'rgba(103,118,145,0.16)',
              ]}
              start={{ x: 0.12, y: 0.08 }}
              end={{ x: 0.84, y: 0.92 }}
              style={[StyleSheet.absoluteFill, { borderRadius: pxSize / 2 }]}
            />
            <View
              pointerEvents="none"
              style={[
                styles.bubbleHighlight,
                {
                  width: pxSize * 0.52,
                  height: pxSize * 0.34,
                  borderRadius: pxSize * 0.26,
                },
              ]}
            />
            <Text
              style={[
                styles.bubbleLabel,
                pxSize <= 88 ? styles.bubbleLabelSmall : null,
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {bubble.label.replace(/\n/g, '\n')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    position: 'relative',
    overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: 'transparent',
    shadowColor: 'rgba(108, 130, 216, 0.13)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
  },
  bubble: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    ...Shadows.bubble,
  },
  bubbleSub: {
    borderColor: 'rgba(255,255,255,0.46)',
  },
  bubbleSmall: {
    borderColor: 'rgba(255,255,255,0.44)',
  },
  bubbleHighlight: {
    position: 'absolute',
    top: '11%',
    left: '15%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    opacity: 0.9,
  },
  bubbleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.2,
    paddingHorizontal: 6,
    textShadowColor: 'rgba(0,0,0,0.28)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bubbleLabelSmall: {
    fontSize: 11,
    fontWeight: '700',
  },
});

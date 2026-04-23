import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { Bubble } from '../data/bubbles';
import { layoutAvatars, layoutTopLevelBubbles, layoutNestedBubbles, Circle } from '../utils/layout';
import { Avatar } from './Avatar';
import { Colors, Shadows } from '../theme';
import { PlusIcon, TrashIcon } from './Icons';

interface BubbleChartProps {
  chartWidth: number;
  chartHeight: number;
  onBubbleTap: (bubbleId: string) => void;
  onAvatarTap: (contactId: number) => void;
  onAvatarLongPress?: (contactId: number, bubbleId: string) => void;
  filterBubbleId?: string;
  onCreateBubbleRequest?: (options: {
    parentBubbleId?: string;
    preselectedContactIds: number[];
    initialBubbleName?: string;
  }) => void;
  onAddBubbleTap?: () => void;
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

type DragSource =
  | { type: 'contact'; contactId: number; bubbleId: string; left: number; top: number; size: number }
  | { type: 'bubble'; bubbleId: string; left: number; top: number; size: number; label: string; parentId?: string };

type DragTarget =
  | { type: 'trash' }
  | { type: 'bubble'; bubbleId: string; centerX: number; centerY: number; size: number }
  | { type: 'avatar'; bubbleId: string; contactId: number; centerX: number; centerY: number; size: number };

interface DragState {
  source: DragSource;
  x: number;
  y: number;
  target: DragTarget | null;
}

interface HitSource {
  source: DragSource;
  key: string;
  onTap: () => void;
}

const LONG_PRESS_MS = 240;
const MOVE_CANCEL_THRESHOLD = 10;
const TRASH_SIZE = 72;

export function BubbleChart({
  chartWidth,
  chartHeight,
  onBubbleTap,
  onAvatarTap,
  filterBubbleId,
  onCreateBubbleRequest,
  onAddBubbleTap,
}: BubbleChartProps) {
  const {
    bubbles,
    contacts,
    getVisualContactIds,
    moveContactToBubble,
    removeContactFromBubble,
    removeBubbleCategory,
    nestBubbleIntoBubble,
  } = useStore(s => ({
    bubbles: s.bubbles,
    contacts: s.contacts,
    getVisualContactIds: s.getVisualContactIds,
    moveContactToBubble: s.moveContactToBubble,
    removeContactFromBubble: s.removeContactFromBubble,
    removeBubbleCategory: s.removeBubbleCategory,
    nestBubbleIntoBubble: s.nestBubbleIntoBubble,
  }));

  const getContact = useCallback((id: number) => contacts.find(c => c.id === id), [contacts]);

  const dragAnim = useRef(new Animated.ValueXY()).current;
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [pressingKey, setPressingKey] = useState<string | null>(null);

  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragSourceRef = useRef<DragSource | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const pendingHitRef = useRef<HitSource | null>(null);
  const pressPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => () => {
    if (dragTimerRef.current) {
      clearTimeout(dragTimerRef.current);
    }
  }, []);

  const { renderedBubbles, renderedAvatars } = useMemo(() => {
    if (!chartWidth || !chartHeight) return { renderedBubbles: [], renderedAvatars: [] };
    const showNestedBubbles = Boolean(filterBubbleId);

    const topLevelBubbles = filterBubbleId
      ? bubbles.filter(b => b.id === filterBubbleId)
      : [
          ...bubbles.filter(b => !b.parentId),
          {
            id: '__new-bubble__',
            label: '',
            x: 80,
            y: 72,
            size: 14,
            contactIds: [],
            subBubbleIds: [],
            isNewBubbleTrigger: true,
          },
        ];

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
      : layoutTopLevelBubbles(topLevelBubbles, chartWidth, chartHeight);

    const rBubbles: RenderedBubble[] = [];
    const rAvatars: RenderedAvatar[] = [];

    const processBubble = (
      bubble: Bubble,
      layoutData: { x: number; y: number; size: number },
      options?: { hiddenShell?: boolean; expanded?: boolean }
    ) => {
      const pxX = (layoutData.x / 100) * chartWidth;
      const pxY = (layoutData.y / 100) * chartHeight;
      const pxSize = (layoutData.size / 100) * chartWidth;
      const radius = pxSize / 2;
      const cx = pxX + radius;
      const cy = pxY + radius;

      rBubbles.push({ bubble, left: pxX, top: pxY, pxSize, cx, cy, hiddenShell: options?.hiddenShell });

      const expanded = Boolean(options?.expanded);
      const nestedBubbles = expanded
        ? (bubble.subBubbleIds || []).map(sid => bubbles.find(b => b.id === sid)).filter(Boolean) as Bubble[]
        : [];
      let nestedLayouts: Array<{ id: string; x: number; y: number; size: number }> = [];

      if (expanded && showNestedBubbles && nestedBubbles.length > 0) {
        nestedLayouts = layoutNestedBubbles(layoutData, nestedBubbles, chartWidth, chartHeight);
        nestedLayouts.forEach((nl, i) => {
          processBubble(nestedBubbles[i], nl);
        });
      }

      const visualContactIds = !expanded || bubble.isNewBubbleTrigger
        ? []
        : getVisualContactIds(bubble);
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
      if (layout) {
        processBubble(bubble, layout, {
          hiddenShell: filterBubbleId === bubble.id,
          expanded: filterBubbleId === bubble.id,
        });
      }
    });

    return { renderedBubbles: rBubbles, renderedAvatars: rAvatars };
  }, [bubbles, chartWidth, chartHeight, filterBubbleId, getVisualContactIds]);

  const bubbleMap = useMemo(
    () => new Map(renderedBubbles.map(item => [item.bubble.id, item])),
    [renderedBubbles]
  );

  const avatarInteractionsEnabled = Boolean(filterBubbleId);

  const trashRect = useMemo(() => ({
    left: (chartWidth - TRASH_SIZE) / 2,
    top: Math.max(12, chartHeight - TRASH_SIZE - 12),
    right: (chartWidth + TRASH_SIZE) / 2,
    bottom: Math.max(12, chartHeight - 12),
  }), [chartHeight, chartWidth]);

  const resolveDragTarget = useCallback((source: DragSource, x: number, y: number): DragTarget | null => {
    if (
      x >= trashRect.left &&
      x <= trashRect.right &&
      y >= trashRect.top &&
      y <= trashRect.bottom
    ) {
      return { type: 'trash' };
    }

    if (source.type === 'bubble') {
      const match = renderedBubbles
        .filter(item => !item.hiddenShell && !item.bubble.isNewBubbleTrigger && item.bubble.id !== source.bubbleId)
        .find(item => Math.hypot(x - item.cx, y - item.cy) <= item.pxSize / 2);

      return match
        ? { type: 'bubble', bubbleId: match.bubble.id, centerX: match.cx, centerY: match.cy, size: match.pxSize }
        : null;
    }

    const bubbleHit = renderedBubbles
      .filter(item => !item.hiddenShell && !item.bubble.isNewBubbleTrigger && item.bubble.id !== source.bubbleId)
      .find(item => Math.hypot(x - item.cx, y - item.cy) <= item.pxSize / 2);

    if (bubbleHit) {
      return {
        type: 'bubble',
        bubbleId: bubbleHit.bubble.id,
        centerX: bubbleHit.cx,
        centerY: bubbleHit.cy,
        size: bubbleHit.pxSize,
      };
    }

    if (!filterBubbleId || source.bubbleId !== filterBubbleId) {
      return null;
    }

    const avatarHit = renderedAvatars.find(item => {
      if (item.contactId === source.contactId || item.bubbleId !== filterBubbleId) return false;
      const centerX = item.left + item.size / 2;
      const centerY = item.top + item.size / 2;
      return Math.hypot(x - centerX, y - centerY) <= item.size / 2;
    });

    if (!avatarHit) return null;

    return {
      type: 'avatar',
      bubbleId: avatarHit.bubbleId,
      contactId: avatarHit.contactId,
      centerX: avatarHit.left + avatarHit.size / 2,
      centerY: avatarHit.top + avatarHit.size / 2,
      size: avatarHit.size,
    };
  }, [filterBubbleId, renderedAvatars, renderedBubbles, trashRect]);

  const startDrag = useCallback((source: DragSource, x: number, y: number) => {
    dragSourceRef.current = source;
    const target = resolveDragTarget(source, x, y);
    dragAnim.setValue({ x: x - source.size / 2, y: y - source.size / 2 });
    setDragState({ source, x, y, target });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
  }, [dragAnim, resolveDragTarget]);

  const updateDrag = useCallback((x: number, y: number) => {
    const source = dragSourceRef.current;
    if (!source) return;
    const target = resolveDragTarget(source, x, y);
    dragAnim.setValue({ x: x - source.size / 2, y: y - source.size / 2 });
    setDragState({ source, x, y, target });
  }, [dragAnim, resolveDragTarget]);

  const clearPendingPress = useCallback(() => {
    if (dragTimerRef.current) {
      clearTimeout(dragTimerRef.current);
      dragTimerRef.current = null;
    }
    pendingHitRef.current = null;
    pressPointRef.current = null;
    setPressingKey(null);
  }, []);

  const finishDrag = useCallback(async () => {
    const activeDrag = dragStateRef.current;
    dragSourceRef.current = null;
    setDragState(null);

    if (!activeDrag) return;

    let changed = false;
    if (activeDrag.source.type === 'bubble') {
      if (activeDrag.target?.type === 'trash') {
        changed = removeBubbleCategory(activeDrag.source.bubbleId);
      } else if (activeDrag.target?.type === 'bubble') {
        changed = nestBubbleIntoBubble(activeDrag.source.bubbleId, activeDrag.target.bubbleId);
      }
    } else {
      if (activeDrag.target?.type === 'trash') {
        changed = removeContactFromBubble(activeDrag.source.contactId, activeDrag.source.bubbleId);
      } else if (activeDrag.target?.type === 'bubble') {
        changed = moveContactToBubble(activeDrag.source.contactId, activeDrag.source.bubbleId, activeDrag.target.bubbleId);
      } else if (
        activeDrag.target?.type === 'avatar' &&
        filterBubbleId &&
        activeDrag.source.bubbleId === filterBubbleId
      ) {
        const sourceContact = getContact(activeDrag.source.contactId);
        const targetContact = getContact(activeDrag.target.contactId);
        onCreateBubbleRequest?.({
          parentBubbleId: filterBubbleId,
          preselectedContactIds: [activeDrag.source.contactId, activeDrag.target.contactId],
          initialBubbleName: `${(sourceContact?.name || 'New').split(' ')[0]} ${(targetContact?.name || 'Bubble').split(' ')[0]}`,
        });
        changed = true;
      }
    }

    if (changed) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    }
  }, [
    filterBubbleId,
    getContact,
    moveContactToBubble,
    nestBubbleIntoBubble,
    onCreateBubbleRequest,
    removeBubbleCategory,
    removeContactFromBubble,
  ]);

  const hitTestSource = useCallback((x: number, y: number): HitSource | null => {
      const bubbleHit = renderedBubbles
      .filter(item => !item.hiddenShell && !item.bubble.isNewBubbleTrigger)
      .find(item => Math.hypot(x - item.cx, y - item.cy) <= item.pxSize / 2);

    if (bubbleHit) {
      return {
        source: {
          type: 'bubble',
          bubbleId: bubbleHit.bubble.id,
          left: bubbleHit.left,
          top: bubbleHit.top,
          size: bubbleHit.pxSize,
          label: bubbleHit.bubble.label,
          parentId: bubbleHit.bubble.parentId,
        },
        key: `bubble-${bubbleHit.bubble.id}`,
        onTap: () => onBubbleTap(bubbleHit.bubble.id),
      };
    }

    const avatarHit = renderedAvatars.find(item => (
      Math.hypot(x - (item.left + item.size / 2), y - (item.top + item.size / 2)) <= item.size / 2
    ));

    if (!avatarHit) return null;

    return {
      source: {
        type: 'contact',
        contactId: avatarHit.contactId,
        bubbleId: avatarHit.bubbleId,
        left: avatarHit.left,
        top: avatarHit.top,
        size: avatarHit.size,
      },
      key: `avatar-${avatarHit.bubbleId}-${avatarHit.contactId}`,
      onTap: () => onAvatarTap(avatarHit.contactId),
    };
  }, [onAvatarTap, onBubbleTap, renderedAvatars, renderedBubbles]);

  const chartResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: event => Boolean(
      hitTestSource(event.nativeEvent.locationX, event.nativeEvent.locationY)
    ),
    onMoveShouldSetPanResponder: () => false,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: event => {
      const hit = hitTestSource(event.nativeEvent.locationX, event.nativeEvent.locationY);
      if (!hit) return;

      pendingHitRef.current = hit;
      pressPointRef.current = {
        x: event.nativeEvent.locationX,
        y: event.nativeEvent.locationY,
      };
      setPressingKey(hit.key);

      const dragEnabled = hit.source.type === 'bubble'
        ? hit.source.bubbleId !== '__new-bubble__'
        : avatarInteractionsEnabled;
      if (!dragEnabled) return;

      const startX = event.nativeEvent.locationX;
      const startY = event.nativeEvent.locationY;
      dragTimerRef.current = setTimeout(() => {
        dragTimerRef.current = null;
        setPressingKey(null);
        startDrag(hit.source, startX, startY);
      }, LONG_PRESS_MS);
    },
    onPanResponderMove: event => {
      if (dragStateRef.current) {
        updateDrag(event.nativeEvent.locationX, event.nativeEvent.locationY);
        return;
      }

      if (!dragTimerRef.current) return;
      const hit = pendingHitRef.current;
      const pressPoint = pressPointRef.current;
      if (!hit) return;
      if (!pressPoint) return;
      const moved = Math.hypot(
        event.nativeEvent.locationX - pressPoint.x,
        event.nativeEvent.locationY - pressPoint.y
      );
      if (moved > MOVE_CANCEL_THRESHOLD) {
        clearPendingPress();
      }
    },
    onPanResponderRelease: async event => {
      const hadDrag = Boolean(dragStateRef.current);
      const pendingHit = pendingHitRef.current;
      const pressPoint = pressPointRef.current;
      const moved = pendingHit
        && pressPoint
        ? Math.hypot(
            event.nativeEvent.locationX - pressPoint.x,
            event.nativeEvent.locationY - pressPoint.y
          )
        : Infinity;

      clearPendingPress();

      if (hadDrag) {
        await finishDrag();
        return;
      }

      if (pendingHit && moved <= MOVE_CANCEL_THRESHOLD) {
        pendingHit.onTap();
      }
    },
    onPanResponderTerminate: () => {
      clearPendingPress();
      dragSourceRef.current = null;
      setDragState(null);
    },
  }), [avatarInteractionsEnabled, clearPendingPress, finishDrag, hitTestSource, startDrag, updateDrag]);

  const dragBridgeStyle = useMemo(() => {
    if (!dragState?.target || dragState.target.type === 'trash') return null;
    const dx = dragState.target.centerX - dragState.x;
    const dy = dragState.target.centerY - dragState.y;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const thickness = Math.max(20, Math.min(dragState.source.size, dragState.target.size) * 0.46);

    return {
      width: distance,
      height: thickness,
      left: dragState.x,
      top: dragState.y - thickness / 2,
      transform: [
        { translateX: 0 },
        { rotate: `${angle}rad` },
      ],
    };
  }, [dragState]);

  const renderBubbleShell = useCallback((
    bubble: Bubble,
    pxSize: number,
    style?: ViewStyle,
    options?: { highlighted?: boolean; dragging?: boolean; pressed?: boolean }
  ) => (
    <View
      pointerEvents="none"
      style={[
        styles.bubble,
        bubble.parentId ? styles.bubbleSub : null,
        pxSize <= 88 ? styles.bubbleSmall : null,
        options?.highlighted ? styles.bubbleHighlighted : null,
        options?.dragging ? styles.bubbleDragging : null,
        options?.pressed ? styles.bubblePressed : null,
        {
          width: pxSize,
          height: pxSize,
          borderRadius: pxSize / 2,
        },
        style,
      ]}
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
    </View>
  ), []);

  if (!chartWidth || !chartHeight) return null;

  return (
    <View style={[styles.chart, { width: chartWidth, height: chartHeight }]} {...chartResponder.panHandlers}>
      <View style={styles.bgGlow} pointerEvents="none" />

      {renderedAvatars.map((av, idx) => {
        const contact = getContact(av.contactId);
        if (!contact) return null;

        const dragKey = `avatar-${av.bubbleId}-${av.contactId}`;

        const isSource =
          dragState?.source.type === 'contact' &&
          dragState.source.contactId === av.contactId &&
          dragState.source.bubbleId === av.bubbleId;
        const isMergeTarget =
          dragState?.target?.type === 'avatar' &&
          dragState.target.contactId === av.contactId &&
          dragState.target.bubbleId === av.bubbleId;

        return (
          <View
            key={`${av.bubbleId}-${av.contactId}-${idx}`}
            style={{
              position: 'absolute',
              left: av.left,
              top: av.top,
              width: av.size,
              height: av.size,
              zIndex: isMergeTarget ? 7 : 4,
              opacity: isSource ? 0.18 : 1,
              transform: [{ scale: pressingKey === dragKey ? 0.94 : isMergeTarget ? 1.1 : 1 }],
            }}
            pointerEvents="none"
          >
            <Avatar
              name={contact.name}
              color={contact.color}
              image={contact.image}
              size={av.size}
              showBorder
              style={isMergeTarget ? styles.avatarDropTarget : undefined}
            />
          </View>
        );
      })}

      {renderedBubbles.map(({ bubble, left, top, pxSize, hiddenShell }) => {
        if (hiddenShell) return null;

        const dragKey = `bubble-${bubble.id}`;

        const isSource = dragState?.source.type === 'bubble' && dragState.source.bubbleId === bubble.id;
        const isTarget = dragState?.target?.type === 'bubble' && dragState.target.bubbleId === bubble.id;
        const isTrigger = Boolean(bubble.isNewBubbleTrigger);

        return (
          <View
            key={bubble.id}
            style={{
              position: 'absolute',
              left,
              top,
              width: pxSize,
              height: pxSize,
              zIndex: isTarget ? 8 : bubble.parentId ? 7 : 6,
              opacity: isSource ? 0.2 : 1,
              transform: [{ scale: pressingKey === dragKey ? 0.97 : isTarget ? 1.06 : 1 }],
            }}
            pointerEvents={isTrigger ? 'box-none' : 'none'}
          >
            {isTrigger ? (
              <TouchableOpacity
                style={styles.addBubbleWrap}
                onPress={onAddBubbleTap}
                activeOpacity={0.82}
              >
                {renderBubbleShell(
                  bubble,
                  pxSize,
                  undefined,
                  { pressed: pressingKey === dragKey }
                )}
                <View style={styles.addBubbleIcon}>
                  <PlusIcon size={Math.max(18, pxSize * 0.48)} color={Colors.text} />
                </View>
              </TouchableOpacity>
            ) : (
              renderBubbleShell(bubble, pxSize, undefined, {
                highlighted: isTarget,
                pressed: pressingKey === dragKey,
              })
            )}
          </View>
        );
      })}

      {dragBridgeStyle ? (
        <View
          pointerEvents="none"
          style={[
            styles.mergeBridge,
            dragBridgeStyle,
          ]}
        />
      ) : null}

      {dragState ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.dragGhost,
            {
              width: dragState.source.size,
              height: dragState.source.size,
              transform: dragAnim.getTranslateTransform(),
            },
          ]}
        >
          {dragState.source.type === 'contact' ? (
            (() => {
              const contact = getContact(dragState.source.contactId);
              if (!contact) return null;
              return (
                <Avatar
                  name={contact.name}
                  color={contact.color}
                  image={contact.image}
                  size={dragState.source.size}
                  showBorder
                  style={styles.dragAvatar}
                />
              );
            })()
          ) : (
            renderBubbleShell(
              bubbleMap.get(dragState.source.bubbleId)?.bubble || {
                id: dragState.source.bubbleId,
                label: dragState.source.label,
                x: 0,
                y: 0,
                size: 0,
                contactIds: [],
                subBubbleIds: [],
                parentId: dragState.source.parentId,
              },
              dragState.source.size,
              undefined,
              { dragging: true }
            )
          )}
        </Animated.View>
      ) : null}

      <View
        pointerEvents="none"
        style={[
          styles.trashDrop,
          {
            left: trashRect.left,
            top: trashRect.top,
            opacity: dragState ? 1 : 0,
            transform: [{ scale: dragState?.target?.type === 'trash' ? 1.08 : 1 }],
          },
          dragState?.target?.type === 'trash' ? styles.trashDropActive : null,
        ]}
      >
        <TrashIcon size={30} color={Colors.text} />
      </View>
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
    top: 0,
    left: 0,
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
  bubbleHighlighted: {
    borderColor: 'rgba(163, 215, 255, 0.95)',
    shadowColor: '#94deff',
    shadowOpacity: 0.34,
    shadowRadius: 26,
    elevation: 12,
  },
  bubbleDragging: {
    borderColor: 'rgba(190, 231, 255, 0.9)',
    shadowOpacity: 0.38,
  },
  bubblePressed: {
    borderColor: 'rgba(255,255,255,0.72)',
  },
  addBubbleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  addBubbleIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDropTarget: {
    borderColor: 'rgba(169, 231, 255, 0.96)',
    borderWidth: 2.5,
    shadowColor: '#9be2ff',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  dragGhost: {
    position: 'absolute',
    zIndex: 20,
    opacity: 0.96,
  },
  dragAvatar: {
    shadowColor: '#b0e5ff',
    shadowOpacity: 0.42,
    shadowRadius: 18,
    elevation: 12,
  },
  mergeBridge: {
    position: 'absolute',
    zIndex: 5,
    backgroundColor: 'rgba(178, 232, 255, 0.34)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(220, 248, 255, 0.3)',
  },
  trashDrop: {
    position: 'absolute',
    width: TRASH_SIZE,
    height: TRASH_SIZE,
    borderRadius: TRASH_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47, 54, 73, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    zIndex: 18,
  },
  trashDropActive: {
    backgroundColor: 'rgba(206, 78, 88, 0.88)',
    borderColor: 'rgba(255, 214, 217, 0.9)',
    shadowColor: '#ff6e7f',
    shadowOpacity: 0.42,
    shadowRadius: 16,
    elevation: 10,
  },
});

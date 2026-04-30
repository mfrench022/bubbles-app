import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { Bubble } from '../data/bubbles';
import { layoutAvatars, layoutTopLevelBubbles, layoutNestedBubbles, Circle } from '../utils/layout';
import { Avatar } from './Avatar';
import { Colors, Shadows, getBubblePalette } from '../theme';
import { PlusIcon, TrashIcon } from './Icons';

interface BubbleChartProps {
  chartWidth: number;
  chartHeight: number;
  onBubbleTap: (bubbleId: string) => void;
  onAvatarTap: (contactId: number) => void;
  interactiveCanvas?: boolean;
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

interface CameraState {
  x: number;
  y: number;
}

const LONG_PRESS_MS = 240;
const MOVE_CANCEL_THRESHOLD = 10;
const TRASH_SIZE = 72;
const CANVAS_WORLD_SCALE_X = 2.05;
const CANVAS_WORLD_SCALE_Y = 2.05;
const CANVAS_PAN_PADDING = 56;
const CANVAS_ROAM_PADDING = 24;
const FOCUS_SCALE_MAX = 1.06;
const FOCUS_RADIUS = 180;
const FOCUS_ATTRACTION_RADIUS = 340;
const FOCUS_LOCK_RADIUS = 232;
const FOCUS_LOCK_HARD_RADIUS = 88;
const FOCUS_TARGET_STICKINESS = 42;
const FOCUS_STROKE_OFFSET = 10;
const CAMERA_DRAG_SMOOTHING = 0.34;
const CAMERA_RELEASE_SPRING_TENSION = 120;
const CAMERA_RELEASE_SPRING_FRICTION = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

export function BubbleChart({
  chartWidth,
  chartHeight,
  onBubbleTap,
  onAvatarTap,
  interactiveCanvas = false,
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
  const cameraAnim = useRef(new Animated.ValueXY()).current;
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [pressingKey, setPressingKey] = useState<string | null>(null);
  const [focusedBubbleId, setFocusedBubbleId] = useState<string | null>(null);

  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragSourceRef = useRef<DragSource | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const pendingHitRef = useRef<HitSource | null>(null);
  const pressPointRef = useRef<{ x: number; y: number } | null>(null);
  const gestureStartCameraRef = useRef<CameraState>({ x: 0, y: 0 });
  const cameraRef = useRef<CameraState>({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const focusTargetRef = useRef<string | null>(null);
  const cameraAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const cameraListenerRef = useRef<CameraState>({ x: 0, y: 0 });

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => () => {
    if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
  }, []);

  const enableInfiniteCanvas = interactiveCanvas && !filterBubbleId;
  const layoutDiameter = enableInfiniteCanvas
    ? Math.max(
        chartWidth * CANVAS_WORLD_SCALE_X,
        chartHeight * CANVAS_WORLD_SCALE_Y,
        chartWidth + 280
      )
    : chartWidth;
  const layoutWidth = enableInfiniteCanvas ? layoutDiameter : chartWidth;
  const layoutHeight = enableInfiniteCanvas ? layoutDiameter : chartHeight;

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
            colorKey: 'violet' as const,
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
      : layoutTopLevelBubbles(topLevelBubbles, layoutWidth, layoutHeight, 16, 10, chartWidth, true);

    const rBubbles: RenderedBubble[] = [];
    const rAvatars: RenderedAvatar[] = [];

    const processBubble = (
      bubble: Bubble,
      layoutData: { x: number; y: number; size: number },
      options?: { hiddenShell?: boolean; expanded?: boolean }
    ) => {
      const pxX = (layoutData.x / 100) * layoutWidth;
      const pxY = (layoutData.y / 100) * layoutHeight;
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
        nestedLayouts = layoutNestedBubbles(layoutData, nestedBubbles, layoutWidth, layoutHeight, 4, 4, chartWidth);
        nestedLayouts.forEach((nl, i) => processBubble(nestedBubbles[i], nl));
      }

      const visualContactIds = !expanded || bubble.isNewBubbleTrigger ? [] : getVisualContactIds(bubble);
      const rawAvatarSize = Math.max(18, radius * 0.38);
      const labelReserveRadius = Math.min(radius * 0.34, Math.max(26, bubble.label.replace(/\n/g, '').length * 4.2));
      const exclusionCircles: Circle[] = [{ x: 0, y: 0, r: labelReserveRadius }];

      nestedLayouts.forEach(nl => {
        const subPxX = (nl.x / 100) * layoutWidth;
        const subPxY = (nl.y / 100) * layoutHeight;
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
  }, [bubbles, chartWidth, chartHeight, filterBubbleId, getVisualContactIds, layoutHeight, layoutWidth]);

  const contentBounds = useMemo(() => {
    if (!enableInfiniteCanvas) return null;
    const visibleBubbles = renderedBubbles.filter(item => !item.hiddenShell);
    if (!visibleBubbles.length) return null;

    const bounds = visibleBubbles.reduce(
      (acc, item) => ({
        minX: Math.min(acc.minX, item.left),
        maxX: Math.max(acc.maxX, item.left + item.pxSize),
        minY: Math.min(acc.minY, item.top),
        maxY: Math.max(acc.maxY, item.top + item.pxSize),
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );

    return {
      minX: bounds.minX - CANVAS_PAN_PADDING,
      maxX: bounds.maxX + CANVAS_PAN_PADDING,
      minY: bounds.minY - CANVAS_PAN_PADDING,
      maxY: bounds.maxY + CANVAS_PAN_PADDING,
      centerX: (bounds.minX + bounds.maxX) / 2,
      centerY: (bounds.minY + bounds.maxY) / 2,
      width: bounds.maxX - bounds.minX + CANVAS_PAN_PADDING * 2,
      height: bounds.maxY - bounds.minY + CANVAS_PAN_PADDING * 2,
    };
  }, [enableInfiniteCanvas, renderedBubbles]);

  const bubbleMap = useMemo(() => new Map(renderedBubbles.map(item => [item.bubble.id, item])), [renderedBubbles]);
  const avatarInteractionsEnabled = Boolean(filterBubbleId);
  const focusableBubbles = useMemo(
    () => renderedBubbles.filter(item => !item.hiddenShell && !item.bubble.isNewBubbleTrigger),
    [renderedBubbles]
  );

  const constrainCamera = useCallback((nextCamera: CameraState): CameraState => {
    if (!enableInfiniteCanvas || !contentBounds) {
      return { x: 0, y: 0 };
    }
    let x = nextCamera.x;
    let y = nextCamera.y;

    const minX = chartWidth / 2 - contentBounds.maxX - CANVAS_ROAM_PADDING;
    const maxX = chartWidth / 2 - contentBounds.minX + CANVAS_ROAM_PADDING;
    x = clamp(x, minX, maxX);

    const minY = chartHeight / 2 - contentBounds.maxY - CANVAS_ROAM_PADDING;
    const maxY = chartHeight / 2 - contentBounds.minY + CANVAS_ROAM_PADDING;
    y = clamp(y, minY, maxY);

    return { x, y };
  }, [chartHeight, chartWidth, contentBounds, enableInfiniteCanvas]);

  const getFocusTarget = useCallback((cameraState: CameraState) => {
    if (!enableInfiniteCanvas || !focusableBubbles.length) {
      focusTargetRef.current = null;
      return null;
    }

    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const closest = focusableBubbles.reduce((best, bubble) => {
      const dx = centerX - (bubble.cx + cameraState.x);
      const dy = centerY - (bubble.cy + cameraState.y);
      const distance = Math.hypot(dx, dy);
      if (!best || distance < best.distance) {
        return { bubble, dx, dy, distance };
      }
      return best;
    }, null as { bubble: RenderedBubble; dx: number; dy: number; distance: number } | null);

    if (!closest) {
      focusTargetRef.current = null;
      return null;
    }

    const currentTargetId = focusTargetRef.current;
    const currentTarget = currentTargetId
      ? focusableBubbles.find(item => item.bubble.id === currentTargetId)
      : null;

    if (currentTarget) {
      const currentDx = centerX - (currentTarget.cx + cameraState.x);
      const currentDy = centerY - (currentTarget.cy + cameraState.y);
      const currentDistance = Math.hypot(currentDx, currentDy);

      if (
        currentDistance <= FOCUS_ATTRACTION_RADIUS &&
        currentDistance <= closest.distance + FOCUS_TARGET_STICKINESS
      ) {
        return {
          bubble: currentTarget,
          dx: currentDx,
          dy: currentDy,
          distance: currentDistance,
        };
      }
    }

    focusTargetRef.current = closest.bubble.bubble.id;
    return closest;
  }, [chartHeight, chartWidth, enableInfiniteCanvas, focusableBubbles]);

  const updateFocusedBubble = useCallback((cameraState: CameraState) => {
    const target = getFocusTarget(cameraState);
    const nextFocusedBubble = target?.bubble.bubble.id ?? null;
    if (!nextFocusedBubble) {
      focusTargetRef.current = null;
    } else {
      focusTargetRef.current = nextFocusedBubble;
    }
    setFocusedBubbleId(prev => (prev === nextFocusedBubble ? prev : nextFocusedBubble));
  }, [getFocusTarget]);

  useEffect(() => {
    const syncCamera = () => {
      cameraRef.current = {
        x: cameraListenerRef.current.x,
        y: cameraListenerRef.current.y,
      };
      updateFocusedBubble(cameraRef.current);
    };

    const xListenerId = cameraAnim.x.addListener(({ value }) => {
      cameraListenerRef.current.x = value;
      syncCamera();
    });
    const yListenerId = cameraAnim.y.addListener(({ value }) => {
      cameraListenerRef.current.y = value;
      syncCamera();
    });

    return () => {
      cameraAnim.x.removeListener(xListenerId);
      cameraAnim.y.removeListener(yListenerId);
    };
  }, [cameraAnim, updateFocusedBubble]);

  const applyFocusLock = useCallback((cameraState: CameraState, options?: { dragging?: boolean }): CameraState => {
    if (!enableInfiniteCanvas) return cameraState;

    const target = getFocusTarget(cameraState);
    if (!target) {
      return cameraState;
    }

    if (target.distance <= FOCUS_LOCK_HARD_RADIUS) {
      return constrainCamera({
        x: cameraState.x + target.dx,
        y: cameraState.y + target.dy,
      });
    }

    const attraction = clamp(1 - target.distance / FOCUS_ATTRACTION_RADIUS, 0, 1);
    if (attraction <= 0) {
      return constrainCamera(cameraState);
    }

    const magneticPull = smoothstep(attraction);
    const lockPull = smoothstep(
      1 - (target.distance - FOCUS_LOCK_HARD_RADIUS) / (FOCUS_LOCK_RADIUS - FOCUS_LOCK_HARD_RADIUS)
    );
    const strength = options?.dragging
      ? 0.05 + magneticPull * 0.09 + lockPull * 0.18
      : 0.08 + magneticPull * 0.14 + lockPull * 0.26;

    return constrainCamera({
      x: cameraState.x + target.dx * strength,
      y: cameraState.y + target.dy * strength,
    });
  }, [constrainCamera, enableInfiniteCanvas, getFocusTarget]);

  const applyCamera = useCallback((
    nextCamera: CameraState,
    options?: { dragging?: boolean; animated?: boolean; smoothing?: number }
  ) => {
    const lockedCamera = applyFocusLock(nextCamera, { dragging: options?.dragging });
    const smoothing = options?.smoothing ?? 1;
    const currentCamera = cameraRef.current;
    const smoothedCamera = smoothing >= 1
      ? lockedCamera
      : {
          x: currentCamera.x + (lockedCamera.x - currentCamera.x) * smoothing,
          y: currentCamera.y + (lockedCamera.y - currentCamera.y) * smoothing,
        };

    cameraAnimationRef.current?.stop();
    cameraAnimationRef.current = null;

    if (options?.animated) {
      const animation = Animated.spring(cameraAnim, {
        toValue: smoothedCamera,
        tension: CAMERA_RELEASE_SPRING_TENSION,
        friction: CAMERA_RELEASE_SPRING_FRICTION,
        useNativeDriver: false,
      });
      cameraAnimationRef.current = animation;
      animation.start(() => {
        cameraAnimationRef.current = null;
      });
      return;
    }

    cameraRef.current = smoothedCamera;
    cameraListenerRef.current = smoothedCamera;
    cameraAnim.setValue(smoothedCamera);
    updateFocusedBubble(smoothedCamera);
  }, [applyFocusLock, cameraAnim, updateFocusedBubble]);

  const settleCameraToFocus = useCallback(() => {
    if (!enableInfiniteCanvas) return;
    applyCamera(cameraRef.current, { animated: true });
  }, [applyCamera, enableInfiniteCanvas]);

  useEffect(() => {
    if (!enableInfiniteCanvas || !contentBounds || !chartWidth || !chartHeight) {
      applyCamera({ x: 0, y: 0 });
      return;
    }

    applyCamera(constrainCamera({
      x: chartWidth / 2 - contentBounds.centerX,
      y: chartHeight / 2 - contentBounds.centerY,
    }));
  }, [applyCamera, chartHeight, chartWidth, constrainCamera, contentBounds, enableInfiniteCanvas]);

  const getFocusScale = useCallback((cx: number, cy: number, bubbleId: string) => {
    if (!enableInfiniteCanvas || bubbleId !== focusedBubbleId) return 1;
    const distance = Math.hypot(
      cx + cameraRef.current.x - chartWidth / 2,
      cy + cameraRef.current.y - chartHeight / 2
    );
    const normalized = clamp(1 - distance / FOCUS_RADIUS, 0, 1);
    return 1 + normalized * (FOCUS_SCALE_MAX - 1);
  }, [chartHeight, chartWidth, enableInfiniteCanvas, focusedBubbleId]);

  const trashRect = useMemo(() => ({
    left: (chartWidth - TRASH_SIZE) / 2,
    top: Math.max(12, chartHeight - TRASH_SIZE - 12),
    right: (chartWidth + TRASH_SIZE) / 2,
    bottom: Math.max(12, chartHeight - 12),
  }), [chartHeight, chartWidth]);

  const resolveDragTarget = useCallback((source: DragSource, x: number, y: number): DragTarget | null => {
    if (x >= trashRect.left && x <= trashRect.right && y >= trashRect.top && y <= trashRect.bottom) {
      return { type: 'trash' };
    }

    if (source.type === 'bubble') {
      const match = renderedBubbles
        .filter(item => !item.hiddenShell && !item.bubble.isNewBubbleTrigger && item.bubble.id !== source.bubbleId)
        .find(item => Math.hypot(x - (item.cx + cameraRef.current.x), y - (item.cy + cameraRef.current.y)) <= item.pxSize / 2);
      return match ? { type: 'bubble', bubbleId: match.bubble.id, centerX: match.cx + cameraRef.current.x, centerY: match.cy + cameraRef.current.y, size: match.pxSize } : null;
    }

    const bubbleHit = renderedBubbles
      .filter(item => !item.hiddenShell && !item.bubble.isNewBubbleTrigger && item.bubble.id !== source.bubbleId)
      .find(item => Math.hypot(x - (item.cx + cameraRef.current.x), y - (item.cy + cameraRef.current.y)) <= item.pxSize / 2);

    if (bubbleHit) {
      return {
        type: 'bubble',
        bubbleId: bubbleHit.bubble.id,
        centerX: bubbleHit.cx + cameraRef.current.x,
        centerY: bubbleHit.cy + cameraRef.current.y,
        size: bubbleHit.pxSize,
      };
    }

    if (!filterBubbleId || source.bubbleId !== filterBubbleId) return null;

    const avatarHit = renderedAvatars.find(item => {
      if (item.contactId === source.contactId || item.bubbleId !== filterBubbleId) return false;
      const centerX = item.left + item.size / 2 + cameraRef.current.x;
      const centerY = item.top + item.size / 2 + cameraRef.current.y;
      return Math.hypot(x - centerX, y - centerY) <= item.size / 2;
    });

    if (!avatarHit) return null;

    return {
      type: 'avatar',
      bubbleId: avatarHit.bubbleId,
      contactId: avatarHit.contactId,
      centerX: avatarHit.left + avatarHit.size / 2 + cameraRef.current.x,
      centerY: avatarHit.top + avatarHit.size / 2 + cameraRef.current.y,
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
      if (activeDrag.target?.type === 'trash') changed = removeBubbleCategory(activeDrag.source.bubbleId);
      else if (activeDrag.target?.type === 'bubble') changed = nestBubbleIntoBubble(activeDrag.source.bubbleId, activeDrag.target.bubbleId);
    } else {
      if (activeDrag.target?.type === 'trash') changed = removeContactFromBubble(activeDrag.source.contactId, activeDrag.source.bubbleId);
      else if (activeDrag.target?.type === 'bubble') changed = moveContactToBubble(activeDrag.source.contactId, activeDrag.source.bubbleId, activeDrag.target.bubbleId);
      else if (activeDrag.target?.type === 'avatar' && filterBubbleId && activeDrag.source.bubbleId === filterBubbleId) {
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
  }, [filterBubbleId, getContact, moveContactToBubble, nestBubbleIntoBubble, onCreateBubbleRequest, removeBubbleCategory, removeContactFromBubble]);

  const hitTestSource = useCallback((x: number, y: number): HitSource | null => {
    const bubbleHit = renderedBubbles
      .filter(item => !item.hiddenShell && !item.bubble.isNewBubbleTrigger)
      .find(item => Math.hypot(x - (item.cx + cameraRef.current.x), y - (item.cy + cameraRef.current.y)) <= item.pxSize / 2);

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

    const avatarHit = renderedAvatars.find(item => Math.hypot(
      x - (item.left + item.size / 2 + cameraRef.current.x),
      y - (item.top + item.size / 2 + cameraRef.current.y)
    ) <= item.size / 2);
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

  const updatePan = useCallback((gestureState: PanResponderGestureState) => {
    if (!enableInfiniteCanvas) return;
    isPanningRef.current = true;
    const start = gestureStartCameraRef.current;
    applyCamera(constrainCamera({
      x: start.x + gestureState.dx,
      y: start.y + gestureState.dy,
    }), {
      dragging: true,
      smoothing: CAMERA_DRAG_SMOOTHING,
    });
  }, [applyCamera, constrainCamera, enableInfiniteCanvas]);

  const chartResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: event => (
      enableInfiniteCanvas || Boolean(hitTestSource(event.nativeEvent.locationX, event.nativeEvent.locationY))
    ),
    onMoveShouldSetPanResponder: (_, gestureState) => (
      enableInfiniteCanvas
        ? Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2
        : false
    ),
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: event => {
      gestureStartCameraRef.current = cameraRef.current;
      isPanningRef.current = false;
      pressPointRef.current = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };

      const hit = hitTestSource(event.nativeEvent.locationX, event.nativeEvent.locationY);
      if (!hit) {
        pendingHitRef.current = null;
        return;
      }
      pendingHitRef.current = hit;
      setPressingKey(hit.key);

      const dragEnabled = hit.source.type === 'bubble' ? hit.source.bubbleId !== '__new-bubble__' : avatarInteractionsEnabled;
      if (!dragEnabled) return;

      const startX = event.nativeEvent.locationX;
      const startY = event.nativeEvent.locationY;
      dragTimerRef.current = setTimeout(() => {
        dragTimerRef.current = null;
        setPressingKey(null);
        startDrag(hit.source, startX, startY);
      }, LONG_PRESS_MS);
    },
    onPanResponderMove: (event, gestureState) => {
      if (dragStateRef.current) {
        updateDrag(event.nativeEvent.locationX, event.nativeEvent.locationY);
        return;
      }

      const pressPoint = pressPointRef.current;
      const moved = pressPoint
        ? Math.hypot(event.nativeEvent.locationX - pressPoint.x, event.nativeEvent.locationY - pressPoint.y)
        : 0;

      if (dragTimerRef.current && moved > MOVE_CANCEL_THRESHOLD) {
        clearPendingPress();
      }

      if (enableInfiniteCanvas && moved > MOVE_CANCEL_THRESHOLD) {
        updatePan(gestureState);
      }
    },
    onPanResponderRelease: async event => {
      const hadDrag = Boolean(dragStateRef.current);
      const pendingHit = pendingHitRef.current;
      const pressPoint = pressPointRef.current;
      const wasPanning = isPanningRef.current;
      const moved = pendingHit && pressPoint
        ? Math.hypot(event.nativeEvent.locationX - pressPoint.x, event.nativeEvent.locationY - pressPoint.y)
        : Infinity;
      isPanningRef.current = false;
      clearPendingPress();
      if (hadDrag) {
        await finishDrag();
        return;
      }
      if (enableInfiniteCanvas && wasPanning) {
        settleCameraToFocus();
      }
      if (!wasPanning && pendingHit && moved <= MOVE_CANCEL_THRESHOLD) pendingHit.onTap();
    },
    onPanResponderTerminate: () => {
      clearPendingPress();
      isPanningRef.current = false;
      dragSourceRef.current = null;
      setDragState(null);
      if (enableInfiniteCanvas) {
        settleCameraToFocus();
      }
    },
  }), [
    avatarInteractionsEnabled,
    clearPendingPress,
    enableInfiniteCanvas,
    finishDrag,
    hitTestSource,
    settleCameraToFocus,
    startDrag,
    updateDrag,
    updatePan,
  ]);

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
      transform: [{ translateX: 0 }, { rotate: `${angle}rad` }],
    };
  }, [dragState]);

  const renderBubbleShell = useCallback((
    bubble: Bubble,
    pxSize: number,
    style?: ViewStyle,
    options?: { highlighted?: boolean; dragging?: boolean; pressed?: boolean }
  ) => {
    const isNeutralTrigger = Boolean(bubble.isNewBubbleTrigger);
    const palette = getBubblePalette(bubble.colorKey);

    return (
      <View
        pointerEvents="none"
        style={[
          styles.bubble,
          bubble.parentId ? styles.bubbleSub : null,
          pxSize <= 88 ? styles.bubbleSmall : null,
          options?.highlighted ? styles.bubbleHighlighted : null,
          options?.dragging ? styles.bubbleDragging : null,
          options?.pressed ? styles.bubblePressed : null,
          { width: pxSize, height: pxSize, borderRadius: pxSize / 2 },
          style,
        ]}
      >
        <LinearGradient
          colors={isNeutralTrigger ? ['#CFCBC4', '#EEEAE3'] : palette.colors}
          start={{ x: 0.12, y: 0.08 }}
          end={{ x: 0.84, y: 0.92 }}
          style={[StyleSheet.absoluteFill, { borderRadius: pxSize / 2 }]}
        />
        <LinearGradient
          colors={isNeutralTrigger ? ['rgba(255,255,255,0.34)', 'rgba(255,255,255,0.05)'] : ['rgba(255,255,255,0.24)', 'rgba(255,255,255,0.03)']}
          start={{ x: 0.18, y: 0.08 }}
          end={{ x: 0.84, y: 0.84 }}
          style={[StyleSheet.absoluteFill, { borderRadius: pxSize / 2 }]}
        />
        <View
          style={[
            styles.bubbleHighlight,
            {
              width: pxSize * 0.42,
              height: pxSize * 0.26,
              borderRadius: pxSize * 0.21,
            },
          ]}
        />
        <Text
          style={[styles.bubbleLabel, pxSize <= 88 ? styles.bubbleLabelSmall : null]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {bubble.label.replace(/\n/g, '\n')}
        </Text>
      </View>
    );
  }, []);

  if (!chartWidth || !chartHeight) return null;

  return (
    <View style={[styles.chart, { width: chartWidth, height: chartHeight }]} {...chartResponder.panHandlers}>
      <View style={styles.bgGlow} pointerEvents="none" />

      {enableInfiniteCanvas ? (
        <View pointerEvents="none" style={styles.canvasHint}>
          <Text style={styles.canvasHintText}>Drag to explore.</Text>
        </View>
      ) : null}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.canvasLayer,
          {
            width: layoutWidth,
            height: layoutHeight,
            transform: cameraAnim.getTranslateTransform(),
          },
        ]}
      >
        {renderedAvatars.map((av, idx) => {
          const contact = getContact(av.contactId);
          if (!contact) return null;
          const dragKey = `avatar-${av.bubbleId}-${av.contactId}`;
          const isSource = dragState?.source.type === 'contact' && dragState.source.contactId === av.contactId && dragState.source.bubbleId === av.bubbleId;
          const isMergeTarget = dragState?.target?.type === 'avatar' && dragState.target.contactId === av.contactId && dragState.target.bubbleId === av.bubbleId;

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

        {renderedBubbles.map(({ bubble, left, top, pxSize, hiddenShell, cx, cy }) => {
          if (hiddenShell) return null;
          const dragKey = `bubble-${bubble.id}`;
          const isSource = dragState?.source.type === 'bubble' && dragState.source.bubbleId === bubble.id;
          const isTarget = dragState?.target?.type === 'bubble' && dragState.target.bubbleId === bubble.id;
          const isTrigger = Boolean(bubble.isNewBubbleTrigger);
          const focusScale = getFocusScale(cx, cy, bubble.id);
          const isFocused = bubble.id === focusedBubbleId;
          const palette = getBubblePalette(bubble.colorKey);

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
              }}
              pointerEvents={isTrigger ? 'box-none' : 'none'}
            >
              {isFocused && !isTrigger ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.focusStroke,
                    {
                      width: pxSize + FOCUS_STROKE_OFFSET * 2,
                      height: pxSize + FOCUS_STROKE_OFFSET * 2,
                      borderRadius: (pxSize + FOCUS_STROKE_OFFSET * 2) / 2,
                      borderColor: palette.colors[0],
                    },
                  ]}
                />
              ) : null}
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: pxSize,
                  height: pxSize,
                  transform: [{ scale: pressingKey === dragKey ? focusScale * 0.97 : isTarget ? focusScale * 1.06 : focusScale }],
                }}
                pointerEvents={isTrigger ? 'box-none' : 'none'}
              >
                {isTrigger ? (
                  <TouchableOpacity style={styles.addBubbleWrap} onPress={onAddBubbleTap} activeOpacity={0.82}>
                    {renderBubbleShell(bubble, pxSize, undefined, { pressed: pressingKey === dragKey })}
                    <View style={styles.addBubbleIcon}>
                      <PlusIcon size={Math.max(18, pxSize * 0.48)} color={Colors.textMuted} />
                    </View>
                  </TouchableOpacity>
                ) : (
                  renderBubbleShell(bubble, pxSize, undefined, {
                    highlighted: isTarget,
                    pressed: pressingKey === dragKey,
                  })
                )}
              </View>
            </View>
          );
        })}
      </Animated.View>

      {dragBridgeStyle ? <View pointerEvents="none" style={[styles.mergeBridge, dragBridgeStyle]} /> : null}

      {dragState ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.dragGhost, { width: dragState.source.size, height: dragState.source.size, transform: dragAnim.getTranslateTransform() }]}
        >
          {dragState.source.type === 'contact'
            ? (() => {
                const contact = getContact(dragState.source.contactId);
                if (!contact) return null;
                return <Avatar name={contact.name} color={contact.color} image={contact.image} size={dragState.source.size} showBorder style={styles.dragAvatar} />;
              })()
            : renderBubbleShell(
                bubbleMap.get(dragState.source.bubbleId)?.bubble || {
                  id: dragState.source.bubbleId,
                  label: dragState.source.label,
                  x: 0,
                  y: 0,
                  size: 0,
                  colorKey: 'violet',
                  contactIds: [],
                  subBubbleIds: [],
                  parentId: dragState.source.parentId,
                },
                dragState.source.size,
                undefined,
                { dragging: true }
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
  canvasLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
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
    shadowColor: 'rgba(154, 137, 222, 0.16)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
  },
  canvasHint: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 18,
    alignItems: 'center',
    zIndex: 20,
  },
  canvasHintText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 253, 248, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.stroke,
  },
  focusStroke: {
    position: 'absolute',
    top: -FOCUS_STROKE_OFFSET,
    left: -FOCUS_STROKE_OFFSET,
    borderWidth: 3,
    opacity: 0.95,
  },
  bubble: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.84)',
    overflow: 'hidden',
    ...Shadows.bubble,
  },
  bubbleSub: {
    borderColor: 'rgba(255,255,255,0.72)',
  },
  bubbleSmall: {
    borderColor: 'rgba(255,255,255,0.68)',
  },
  bubbleHighlight: {
    position: 'absolute',
    top: '13%',
    left: '17%',
    backgroundColor: 'rgba(255,255,255,0.22)',
    opacity: 0.82,
  },
  bubbleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.inverseText,
    textAlign: 'center',
    letterSpacing: -0.2,
    paddingHorizontal: 6,
    textShadowColor: 'rgba(30,34,52,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bubbleLabelSmall: {
    fontSize: 11,
    fontWeight: '700',
  },
  bubbleHighlighted: {
    borderColor: '#ffffff',
    shadowColor: '#b9a8ff',
    shadowOpacity: 0.28,
    shadowRadius: 26,
    elevation: 12,
  },
  bubbleDragging: {
    borderColor: '#ffffff',
    shadowOpacity: 0.38,
  },
  bubblePressed: {
    borderColor: '#ffffff',
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
    borderColor: '#ffffff',
    borderWidth: 2.5,
    shadowColor: '#b9a8ff',
    shadowOpacity: 0.24,
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
    backgroundColor: 'rgba(148, 131, 255, 0.22)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.36)',
  },
  trashDrop: {
    position: 'absolute',
    width: TRASH_SIZE,
    height: TRASH_SIZE,
    borderRadius: TRASH_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 253, 248, 0.96)',
    borderWidth: 1,
    borderColor: Colors.strokeStrong,
    zIndex: 18,
    ...Shadows.card,
  },
  trashDropActive: {
    backgroundColor: '#F6D9D5',
    borderColor: '#E8AAA0',
    shadowColor: '#F0B0A8',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 10,
  },
});

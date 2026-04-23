export interface Circle {
  x: number;
  y: number;
  r: number;
}

export interface AvatarOffset {
  x: number;
  y: number;
}

export interface AvatarLayout {
  avatarSize: number;
  offsets: AvatarOffset[];
}

export interface BubbleCircle {
  id?: string;
  pxSize: number;
  r: number;
  cx: number;
  cy: number;
  [key: string]: any;
}

function circlesOverlap(a: Circle, b: Circle, padding = 0): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const minDistance = a.r + b.r + padding;
  return dx * dx + dy * dy < minDistance * minDistance;
}

export function layoutAvatars(
  count: number,
  bubbleRadius: number,
  initialAvatarSize: number,
  options: {
    exclusionCircles?: Circle[];
    minAvatarSize?: number;
    spacing?: number;
    edgePadding?: number;
  } = {}
): AvatarLayout {
  if (count === 0) return { avatarSize: initialAvatarSize, offsets: [] };

  const {
    exclusionCircles = [],
    minAvatarSize = 18,
    spacing = 8,
    edgePadding = 10,
  } = options;

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let avatarSize = Math.round(initialAvatarSize); avatarSize >= minAvatarSize; avatarSize -= 2) {
    const avatarRadius = avatarSize / 2;
    const maxR = bubbleRadius - avatarRadius - edgePadding;
    if (maxR <= 0) continue;

    const positions: AvatarOffset[] = [];
    const candidateCount = Math.max(count * 36, 180);

    for (let idx = 0; idx < candidateCount && positions.length < count; idx++) {
      const t = (idx + 0.5) / candidateCount;
      const r = Math.sqrt(t) * maxR;
      const angle = idx * goldenAngle;
      const candidate: Circle = {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle),
        r: avatarRadius,
      };

      const insideBubble =
        Math.hypot(candidate.x, candidate.y) + avatarRadius <= bubbleRadius - edgePadding;
      if (!insideBubble) continue;

      const hitsExclusion = exclusionCircles.some(ex =>
        circlesOverlap(candidate, ex, spacing)
      );
      if (hitsExclusion) continue;

      const hitsAvatar = positions.some(pos =>
        circlesOverlap(candidate, { ...pos, r: avatarRadius }, spacing)
      );
      if (hitsAvatar) continue;

      positions.push({ x: candidate.x, y: candidate.y });
    }

    if (positions.length === count) {
      return { avatarSize, offsets: positions };
    }
  }

  const avatarSize = minAvatarSize;
  const avatarRadius = avatarSize / 2;
  const ringRadius = Math.max(0, bubbleRadius - avatarRadius - edgePadding - 2);
  const offsets = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * ringRadius * 0.72,
      y: Math.sin(angle) * ringRadius * 0.72,
    };
  });

  return { avatarSize, offsets };
}

export function bubbleToPxCircle(
  bubble: { id: string; x: number; y: number; size: number; [key: string]: any },
  chartW: number,
  chartH: number
): BubbleCircle {
  const size = (bubble.size / 100) * chartW;
  const radius = size / 2;
  const x = (bubble.x / 100) * chartW;
  const y = (bubble.y / 100) * chartH;
  return { ...bubble, pxSize: size, r: radius, cx: x + radius, cy: y + radius };
}

export function pxCircleToBubble(circle: BubbleCircle, chartW: number, chartH: number) {
  return {
    ...circle,
    x: ((circle.cx - circle.r) / chartW) * 100,
    y: ((circle.cy - circle.r) / chartH) * 100,
    size: (circle.pxSize / chartW) * 100,
  };
}

function clampCircleToChart(circle: BubbleCircle, chartW: number, chartH: number, padding: number) {
  circle.cx = Math.min(chartW - padding - circle.r, Math.max(padding + circle.r, circle.cx));
  circle.cy = Math.min(chartH - padding - circle.r, Math.max(padding + circle.r, circle.cy));
}

function clampCircleToParent(circle: BubbleCircle, parent: BubbleCircle, padding: number) {
  const maxDistance = Math.max(0, parent.r - circle.r - padding);
  const dx = circle.cx - parent.cx;
  const dy = circle.cy - parent.cy;
  const distance = Math.hypot(dx, dy);

  if (distance > maxDistance && distance > 0) {
    const ratio = maxDistance / distance;
    circle.cx = parent.cx + dx * ratio;
    circle.cy = parent.cy + dy * ratio;
  } else if (distance === 0 && maxDistance > 0) {
    circle.cy = parent.cy + maxDistance;
  }
}

function resolveBubbleCollisions(
  circles: BubbleCircle[],
  gap: number,
  clampFn: (c: BubbleCircle) => void
): BubbleCircle[] {
  if (circles.length < 2) return circles;

  for (let iter = 0; iter < 160; iter++) {
    let moved = false;
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i];
        const b = circles[j];
        const dx = b.cx - a.cx;
        const dy = b.cy - a.cy;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const minDist = a.r + b.r + gap;
        if (dist >= minDist) continue;
        const overlap = (minDist - dist) / 2;
        const ux = dx / dist;
        const uy = dy / dist;
        a.cx -= ux * overlap;
        a.cy -= uy * overlap;
        b.cx += ux * overlap;
        b.cy += uy * overlap;
        clampFn(a);
        clampFn(b);
        moved = true;
      }
    }
    if (!moved) break;
  }

  return circles;
}

function getCenteredLayoutShift(min: number, max: number, size: number, padding: number): number {
  const desiredShift = size / 2 - (min + max) / 2;
  const minShift = padding - min;
  const maxShift = size - padding - max;
  if (minShift > maxShift) return 0;
  return Math.min(maxShift, Math.max(minShift, desiredShift));
}

function centerBubbleLayout(
  circles: BubbleCircle[],
  chartW: number,
  chartH: number,
  padding: number,
  options: { horizontal?: boolean; vertical?: boolean } = {}
) {
  const { horizontal = true, vertical = true } = options;
  if (!circles.length) return;

  const bounds = circles.reduce(
    (acc, c) => ({
      minX: Math.min(acc.minX, c.cx - c.r),
      maxX: Math.max(acc.maxX, c.cx + c.r),
      minY: Math.min(acc.minY, c.cy - c.r),
      maxY: Math.max(acc.maxY, c.cy + c.r),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  );

  const dx = horizontal
    ? getCenteredLayoutShift(bounds.minX, bounds.maxX, chartW, padding)
    : 0;
  const dy = vertical
    ? getCenteredLayoutShift(bounds.minY, bounds.maxY, chartH, padding)
    : 0;

  circles.forEach(c => {
    c.cx += dx;
    c.cy += dy;
  });
}

export function layoutTopLevelBubbles(
  bubbles: Array<{ id: string; x: number; y: number; size: number; parentId?: string; [key: string]: any }>,
  chartW: number,
  chartH: number,
  gap = 22,
  padding = 12
): Map<string, { x: number; y: number; size: number; [key: string]: any }> {
  const topLevel = bubbles.filter(b => !b.parentId);
  const circles = topLevel.map(b => bubbleToPxCircle(b, chartW, chartH));

  circles.forEach(c => clampCircleToChart(c, chartW, chartH, padding));
  resolveBubbleCollisions(circles, gap, c => clampCircleToChart(c, chartW, chartH, padding));
  centerBubbleLayout(circles, chartW, chartH, padding);

  return new Map(circles.map(c => [c.id as string, pxCircleToBubble(c, chartW, chartH)]));
}

export function layoutNestedBubbles(
  parentBubble: { id?: string; x: number; y: number; size: number; [key: string]: any },
  nestedBubbles: Array<{ id: string; x: number; y: number; size: number; [key: string]: any }>,
  chartW: number,
  chartH: number,
  gap = 4,
  padding = 4
): Array<{ id: string; x: number; y: number; size: number; [key: string]: any }> {
  if (!nestedBubbles.length) return [];

  const parentCircle = bubbleToPxCircle({ id: parentBubble.id || '', ...parentBubble }, chartW, chartH);
  const circles = nestedBubbles.map(b => bubbleToPxCircle(b, chartW, chartH));

  circles.forEach(c => clampCircleToParent(c, parentCircle, padding));
  resolveBubbleCollisions(circles, gap, c => clampCircleToParent(c, parentCircle, padding));

  return circles.map(c => pxCircleToBubble(c, chartW, chartH)) as Array<{ id: string; x: number; y: number; size: number; [key: string]: any }>;
}

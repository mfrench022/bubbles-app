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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
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
    collisionScale?: number;
  } = {}
): AvatarLayout {
  if (count === 0) return { avatarSize: initialAvatarSize, offsets: [] };

  const {
    exclusionCircles = [],
    minAvatarSize = 18,
    spacing = 8,
    edgePadding = 10,
    collisionScale = 1,
  } = options;

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let avatarSize = Math.round(initialAvatarSize); avatarSize >= minAvatarSize; avatarSize -= 2) {
    const avatarRadius = avatarSize / 2;
    const collisionRadius = avatarRadius * collisionScale;
    const maxR = bubbleRadius - collisionRadius - edgePadding;
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
        r: collisionRadius,
      };

      const insideBubble =
        Math.hypot(candidate.x, candidate.y) + collisionRadius <= bubbleRadius - edgePadding;
      if (!insideBubble) continue;

      const hitsExclusion = exclusionCircles.some(ex =>
        circlesOverlap(candidate, ex, spacing)
      );
      if (hitsExclusion) continue;

      const hitsAvatar = positions.some(pos =>
        circlesOverlap(candidate, { ...pos, r: collisionRadius }, spacing)
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
  chartH: number,
  sizeReferenceW = chartW
): BubbleCircle {
  const size = (bubble.size / 100) * sizeReferenceW;
  const radius = size / 2;
  const x = (bubble.x / 100) * chartW;
  const y = (bubble.y / 100) * chartH;
  return { ...bubble, pxSize: size, r: radius, cx: x + radius, cy: y + radius };
}

export function pxCircleToBubble(
  circle: BubbleCircle,
  chartW: number,
  chartH: number,
  sizeReferenceW = chartW
) {
  return {
    ...circle,
    x: ((circle.cx - circle.r) / chartW) * 100,
    y: ((circle.cy - circle.r) / chartH) * 100,
    size: (circle.pxSize / sizeReferenceW) * 100,
  };
}

function clampCircleToChart(circle: BubbleCircle, chartW: number, chartH: number, padding: number) {
  circle.cx = Math.min(chartW - padding - circle.r, Math.max(padding + circle.r, circle.cx));
  circle.cy = Math.min(chartH - padding - circle.r, Math.max(padding + circle.r, circle.cy));
}

function clampCircleToCircularField(
  circle: BubbleCircle,
  chartW: number,
  chartH: number,
  padding: number
) {
  const centerX = chartW / 2;
  const centerY = chartH / 2;
  const maxDistance = Math.max(0, Math.min(chartW, chartH) / 2 - padding - circle.r);
  const dx = circle.cx - centerX;
  const dy = circle.cy - centerY;
  const distance = Math.hypot(dx, dy);

  if (distance > maxDistance && distance > 0) {
    const ratio = maxDistance / distance;
    circle.cx = centerX + dx * ratio;
    circle.cy = centerY + dy * ratio;
  }
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
  }
}

function getCirclePackArea(circles: BubbleCircle[]): number {
  return circles.reduce((sum, circle) => sum + Math.PI * circle.r * circle.r, 0);
}

function applyDensityScale(
  circles: BubbleCircle[],
  options: {
    availableArea: number;
    minScale?: number;
    comfortableOccupancy?: number;
    densityBias?: number;
    countStart?: number;
    countSlope?: number;
  }
) {
  if (!circles.length || options.availableArea <= 0) return;

  const {
    minScale = 0.62,
    comfortableOccupancy = 0.56,
    densityBias = 0.94,
    countStart = 12,
    countSlope = 0.014,
  } = options;

  const occupiedArea = getCirclePackArea(circles);
  const occupancy = occupiedArea / options.availableArea;
  const occupancyScale = occupancy > comfortableOccupancy
    ? Math.sqrt((comfortableOccupancy / occupancy) * densityBias)
    : 1;
  const countScale = 1 - Math.max(0, circles.length - countStart) * countSlope;
  const scale = clamp(Math.min(occupancyScale, countScale), minScale, 1);

  if (scale >= 0.999) return;

  circles.forEach(circle => {
    circle.pxSize *= scale;
    circle.r = circle.pxSize / 2;
  });
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

function seedCircularBubbleLayout(
  circles: BubbleCircle[],
  chartW: number,
  chartH: number,
  gap: number
) {
  if (!circles.length) return;

  const centerX = chartW / 2;
  const centerY = chartH / 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const maxRadius = circles.reduce((max, circle) => Math.max(max, circle.r), 0);
  const radialStep = maxRadius * 0.9 + gap;

  circles.forEach((circle, index) => {
    if (index === 0) {
      circle.cx = centerX;
      circle.cy = centerY;
      return;
    }

    const ringRadius = Math.sqrt(index) * radialStep;
    const angle = index * goldenAngle;
    circle.cx = centerX + Math.cos(angle) * ringRadius;
    circle.cy = centerY + Math.sin(angle) * ringRadius;
  });
}

function seedCircularBubbleLayoutInParent(
  circles: BubbleCircle[],
  parent: BubbleCircle,
  gap: number
) {
  if (!circles.length) return;

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const maxRadius = circles.reduce((max, circle) => Math.max(max, circle.r), 0);
  const radialStep = maxRadius * 0.9 + gap;

  circles.forEach((circle, index) => {
    if (index === 0) {
      circle.cx = parent.cx;
      circle.cy = parent.cy;
      return;
    }

    const ringRadius = Math.sqrt(index) * radialStep;
    const angle = index * goldenAngle;
    circle.cx = parent.cx + Math.cos(angle) * ringRadius;
    circle.cy = parent.cy + Math.sin(angle) * ringRadius;
  });
}

export function layoutTopLevelBubbles(
  bubbles: Array<{ id: string; x: number; y: number; size: number; parentId?: string; [key: string]: any }>,
  chartW: number,
  chartH: number,
  gap = 22,
  padding = 12,
  sizeReferenceW = chartW,
  circular = false
): Map<string, { x: number; y: number; size: number; [key: string]: any }> {
  const topLevel = bubbles.filter(b => !b.parentId);
  const circles = topLevel.map(b => bubbleToPxCircle(b, chartW, chartH, sizeReferenceW));
  const clampFn = circular
    ? (circle: BubbleCircle) => clampCircleToCircularField(circle, chartW, chartH, padding)
    : (circle: BubbleCircle) => clampCircleToChart(circle, chartW, chartH, padding);
  const fieldRadius = Math.max(0, Math.min(chartW, chartH) / 2 - padding);
  const availableArea = circular
    ? Math.PI * fieldRadius * fieldRadius
    : Math.max(0, (chartW - padding * 2) * (chartH - padding * 2));

  applyDensityScale(circles, {
    availableArea,
    minScale: circular ? 0.74 : 0.8,
    comfortableOccupancy: circular ? 0.68 : 0.58,
    densityBias: circular ? 0.96 : 0.98,
    countStart: circular ? 18 : 20,
    countSlope: circular ? 0.006 : 0.004,
  });

  if (circular) {
    seedCircularBubbleLayout(circles, chartW, chartH, gap);
  }

  circles.forEach(clampFn);
  resolveBubbleCollisions(circles, gap, clampFn);
  centerBubbleLayout(circles, chartW, chartH, padding);
  circles.forEach(clampFn);
  resolveBubbleCollisions(circles, gap, clampFn);

  return new Map(circles.map(c => [c.id as string, pxCircleToBubble(c, chartW, chartH, sizeReferenceW)]));
}

export function layoutNestedBubbles(
  parentBubble: { id?: string; x: number; y: number; size: number; [key: string]: any },
  nestedBubbles: Array<{ id: string; x: number; y: number; size: number; [key: string]: any }>,
  chartW: number,
  chartH: number,
  gap = 4,
  padding = 4,
  sizeReferenceW = chartW
): Array<{ id: string; x: number; y: number; size: number; [key: string]: any }> {
  if (!nestedBubbles.length) return [];

  const parentCircle = bubbleToPxCircle({ id: parentBubble.id || '', ...parentBubble }, chartW, chartH, sizeReferenceW);
  const circles = nestedBubbles.map(b => bubbleToPxCircle(b, chartW, chartH, sizeReferenceW));
  const availableRadius = Math.max(0, parentCircle.r - padding);

  applyDensityScale(circles, {
    availableArea: Math.PI * availableRadius * availableRadius,
    minScale: 0.68,
    comfortableOccupancy: 0.58,
    densityBias: 0.94,
    countStart: 6,
    countSlope: 0.025,
  });

  seedCircularBubbleLayoutInParent(circles, parentCircle, gap);
  circles.forEach(c => clampCircleToParent(c, parentCircle, padding));
  resolveBubbleCollisions(circles, gap, c => clampCircleToParent(c, parentCircle, padding));
  circles.forEach(c => clampCircleToParent(c, parentCircle, padding));

  return circles.map(c => pxCircleToBubble(c, chartW, chartH, sizeReferenceW)) as Array<{ id: string; x: number; y: number; size: number; [key: string]: any }>;
}

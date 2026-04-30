import { StyleSheet } from 'react-native';

export type BubbleColorKey =
  | 'violet'
  | 'indigo'
  | 'sky'
  | 'teal'
  | 'mint'
  | 'lime'
  | 'gold'
  | 'coral'
  | 'rose'
  | 'plum';

export const BUBBLE_COLOR_OPTIONS = [
  { key: 'violet', label: 'Violet', colors: ['#6E5BFF', '#B8A7FF'], soft: '#ECE7FF' },
  { key: 'indigo', label: 'Indigo', colors: ['#4D68F6', '#93A3FF'], soft: '#E8ECFF' },
  { key: 'sky', label: 'Sky', colors: ['#2F86F6', '#8FD2FF'], soft: '#E5F3FF' },
  { key: 'teal', label: 'Teal', colors: ['#0E8D95', '#69D0D3'], soft: '#E2F6F5' },
  { key: 'mint', label: 'Mint', colors: ['#0E9F78', '#85DEB6'], soft: '#E3F8EE' },
  { key: 'lime', label: 'Lime', colors: ['#719A33', '#B8DB70'], soft: '#EFF7DF' },
  { key: 'gold', label: 'Gold', colors: ['#D18A29', '#F4C86F'], soft: '#FBF1DA' },
  { key: 'coral', label: 'Coral', colors: ['#EC6E62', '#F7B091'], soft: '#FCE7E1' },
  { key: 'rose', label: 'Rose', colors: ['#D65C89', '#F0ABC3'], soft: '#FBE6EE' },
  { key: 'plum', label: 'Plum', colors: ['#7750C5', '#B79AF2'], soft: '#EFE8FB' },
] as const satisfies ReadonlyArray<{
  key: BubbleColorKey;
  label: string;
  colors: readonly [string, string];
  soft: string;
}>;

const bubblePaletteMap: Record<BubbleColorKey, (typeof BUBBLE_COLOR_OPTIONS)[number]> =
  Object.fromEntries(BUBBLE_COLOR_OPTIONS.map(option => [option.key, option])) as Record<
    BubbleColorKey,
    (typeof BUBBLE_COLOR_OPTIONS)[number]
  >;

export function getBubblePalette(colorKey: BubbleColorKey = 'violet') {
  return bubblePaletteMap[colorKey] || bubblePaletteMap.violet;
}

export const Colors = {
  bg: '#F3EEE6',
  appBg: '#F7F4EE',
  surface: '#FFFDF8',
  surfaceAlt: '#F1EBE2',
  text: '#1F2430',
  textMuted: '#6E7687',
  textSoft: '#8D94A3',
  inverseText: '#FFFFFF',
  stroke: '#E3DCD0',
  strokeStrong: '#CFC5B5',
  thumbnailStroke: '#F5EFE6',
  toggleActive: '#ECE6FF',
  headerBg: 'transparent',
  iconBtn: '#F0EADF',
  iconBtnBorder: '#DED5C7',
  cardBg: '#FFFDF8',
  inputBg: '#F3EEE5',
  inputBorder: '#DDD3C6',
  sheetBg: '#FFF9F1',
  danger: '#C85656',
  primary: '#ECE6FF',
  primarySolid: '#6559E8',
  shadow: '#B9AD9A',
};

export const Typography = {
  title: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -1.4,
    color: Colors.text,
  },
  titleDetail: {
    fontSize: 21,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: Colors.text,
    textAlign: 'center' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text,
  },
  bodyMuted: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: Colors.textMuted,
  },
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
  full: 999,
};

export const Shadows = {
  bubble: {
    shadowColor: '#2a1f4a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 26,
    elevation: 9,
  },
  card: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
};

export const commonStyles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenBg: {
    flex: 1,
    backgroundColor: Colors.appBg,
  },
  glassCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.stroke,
    ...Shadows.card,
  },
});

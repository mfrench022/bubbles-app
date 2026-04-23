import { StyleSheet } from 'react-native';

export const Colors = {
  bg: '#cfd4d9',
  appBg: 'transparent',
  text: '#f9f8f7',
  textMuted: 'rgba(249, 248, 247, 0.74)',
  glass: 'rgba(255, 255, 255, 0.12)',
  glassHover: 'rgba(255, 255, 255, 0.18)',
  stroke: 'rgba(255, 255, 255, 0.34)',
  thumbnailStroke: 'rgba(255, 255, 255, 0.82)',
  toggleActive: 'rgba(10, 92, 255, 0.12)',
  headerBg: 'transparent',
  iconBtn: 'rgba(255, 255, 255, 0.12)',
  iconBtnBorder: 'rgba(255, 255, 255, 0.18)',
  cardBg: 'rgba(255, 255, 255, 0.13)',
  inputBg: 'rgba(255, 255, 255, 0.14)',
  inputBorder: 'rgba(255, 255, 255, 0.26)',
  sheetBg: 'rgba(104, 114, 128, 0.82)',
  danger: '#d9534f',
  primary: 'rgba(10, 92, 255, 0.12)',
  primarySolid: '#0a5cff',
};

export const Typography = {
  title: {
    fontSize: 33,
    fontWeight: '600' as const,
    letterSpacing: -1.3,
    color: Colors.text,
  },
  titleDetail: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
    color: Colors.text,
    textAlign: 'center' as const,
  },
  body: {
    fontSize: 17,
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
  full: 999,
};

export const Shadows = {
  bubble: {
    shadowColor: '#34404f',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 8,
  },
  card: {
    shadowColor: '#324050',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 6,
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
  },
});

import { createTheme } from '@shopify/restyle';

const palette = {
  black: '#000000',
  white: '#FFFFFF',
  orange: '#FF8A00',
  teal: '#2ED1C4',
  gray900: '#0B0B0B',
  gray800: '#151515',
  gray700: '#1E1E1E',
  gray600: '#2A2A2A',
  gray500: '#3A3A3A',
};

export const theme = createTheme({
  colors: {
    background: palette.black,
    surface: palette.gray900,
    surfaceMuted: palette.gray800,
    border: 'rgba(255,255,255,0.18)',
    text: palette.white,
    textMuted: 'rgba(255,255,255,0.7)',
    accent: palette.orange,
    accent2: palette.teal,
    white: palette.white,
    black: palette.black,
  },
  spacing: {
    0: 0,
    2: 2,
    4: 4,
    6: 6,
    8: 8,
    10: 10,
    12: 12,
    14: 14,
    16: 16,
    20: 20,
    24: 24,
    32: 32,
  },
  radii: {
    xs: 6,
    sm: 10,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
    round: 9999,
  },
  textVariants: {
    defaults: {
      color: 'text',
    },
    label: {
      fontSize: 14,
      fontWeight: '700',
      color: 'text',
    },
    value: {
      fontSize: 16,
      fontWeight: '700',
      color: 'text',
    },
  },
});

export type Theme = typeof theme;


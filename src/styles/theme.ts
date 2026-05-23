import { ThemeColors } from '../types';

export const darkTheme: ThemeColors = {
  background: '#0A0A14',
  surface: '#12121F',
  surfaceElevated: '#1A1A2E',
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  secondary: '#2563EB',
  accent: '#06B6D4',
  text: '#F1F0FF',
  textSecondary: '#C4C2D4',
  textMuted: '#6B698A',
  border: '#2A2840',
  borderLight: '#1E1C30',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  card: '#16162A',
  tabBar: '#111120',
  statusBar: '#0A0A14',
  inputBackground: '#1A1A2E',
  shadow: '#000000',
};

export const lightTheme: ThemeColors = {
  background: '#F4F3FF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  secondary: '#2563EB',
  accent: '#0891B2',
  text: '#1A1730',
  textSecondary: '#4A4869',
  textMuted: '#9896B0',
  border: '#E2E0F0',
  borderLight: '#F0EFF8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  card: '#FFFFFF',
  tabBar: '#FFFFFF',
  statusBar: '#F4F3FF',
  inputBackground: '#F0EFF8',
  shadow: '#7C3AED',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 38,
};

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOW = {
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const PROJECT_COLORS = [
  '#7C3AED',
  '#2563EB',
  '#DC2626',
  '#16A34A',
  '#D97706',
  '#DB2777',
  '#0891B2',
] as const;

export const PROJECT_ICONS = [
  'briefcase',
  'code-slash',
  'rocket',
  'star',
  'heart',
  'bulb',
  'trophy',
  'leaf',
  'flame',
  'diamond',
  'color-palette',
  'musical-notes',
];

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  completed: 'Concluído',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  in_progress: '#2563EB',
  completed: '#10B981',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
};

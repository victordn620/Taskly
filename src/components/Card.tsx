import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { CardProps } from '../types';
import { BORDER_RADIUS, SHADOW, SPACING } from '../styles/theme';

export function Card({ children, style, onPress, elevated = false }: CardProps) {
  const { colors, isDark } = useTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      ...(elevated && isDark
        ? { ...SHADOW.md, shadowColor: colors.shadow }
        : elevated
        ? { ...SHADOW.sm, shadowColor: '#7C3AED' }
        : {}),
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
  },
});

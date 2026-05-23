import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { ButtonProps } from '../types';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../styles/theme';

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: FONT_SIZE.sm },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: FONT_SIZE.md },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: FONT_SIZE.lg },
  }[size];

  const variantStyles = {
    primary: {
      bg: colors.primary,
      text: '#FFFFFF',
      border: 'transparent',
    },
    secondary: {
      bg: colors.secondary,
      text: '#FFFFFF',
      border: 'transparent',
    },
    outline: {
      bg: 'transparent',
      text: colors.primary,
      border: colors.primary,
    },
    ghost: {
      bg: 'transparent',
      text: colors.textSecondary,
      border: 'transparent',
    },
    danger: {
      bg: colors.error,
      text: '#FFFFFF',
      border: 'transparent',
    },
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: variantStyles.bg,
          borderColor: variantStyles.border,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'auto',
        },
        variant === 'outline' && { borderWidth: 1.5 },
      ]}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && (
            <Ionicons
              name={icon as any}
              size={sizeStyles.fontSize}
              color={variantStyles.text}
              style={{ marginRight: 6 }}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: variantStyles.text, fontSize: sizeStyles.fontSize },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../styles/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  rightLabel?: string;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  rightIcon,
  onRightPress,
  rightLabel,
}: HeaderProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      {showBack ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      <View style={styles.titleArea}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {(rightIcon || rightLabel) ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={styles.rightBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {rightLabel && (
            <Text style={[styles.rightLabel, { color: colors.primary }]}>
              {rightLabel}
            </Text>
          )}
          {rightIcon && (
            <Ionicons name={rightIcon as any} size={22} color={colors.primary} />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0,
  },
  backBtn: {
    width: 36,
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    marginTop: 1,
  },
  rightBtn: {
    width: 60,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
  },
  rightLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  spacer: {
    width: 36,
  },
});

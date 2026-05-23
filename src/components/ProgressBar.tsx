import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ProgressBarProps } from '../types';
import { BORDER_RADIUS, FONT_SIZE } from '../styles/theme';

export function ProgressBar({
  progress,
  color,
  height = 6,
  showLabel = false,
  style,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const clampedProgress = Math.min(100, Math.max(0, progress));
  const barColor = color || colors.primary;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: colors.borderLight,
            borderRadius: BORDER_RADIUS.full,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              backgroundColor: barColor,
              borderRadius: BORDER_RADIUS.full,
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textMuted }]}>
          {clampedProgress}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
});

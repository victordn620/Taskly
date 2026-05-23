import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { ProjectCardProps } from '../types';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../styles/theme';
import { ProgressBar } from './ProgressBar';

export function ProjectCard({
  project,
  taskCount,
  completedCount,
  onPress,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const { colors } = useTheme();
  const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.88}
    >
      {/* Top accent */}
      <View style={[styles.topAccent, { backgroundColor: project.color }]} />

      <View style={styles.body}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: project.color + '22' },
            ]}
          >
            <Ionicons
              name={project.icon as any}
              size={20}
              color={project.color}
            />
          </View>

          {/* Action buttons */}
          {(onEdit || onDelete) && (
            <View style={styles.actions}>
              {onEdit && (
                <TouchableOpacity
                  onPress={onEdit}
                  style={styles.actionBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  onPress={onDelete}
                  style={styles.actionBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={colors.error}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Name */}
        <Text
          style={[styles.name, { color: colors.text }]}
          numberOfLines={1}
        >
          {project.name}
        </Text>

        {/* Description */}
        {project.description ? (
          <Text
            style={[styles.description, { color: colors.textMuted }]}
            numberOfLines={2}
          >
            {project.description}
          </Text>
        ) : null}

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons
              name="checkbox-outline"
              size={14}
              color={colors.textMuted}
            />
            <Text style={[styles.statText, { color: colors.textMuted }]}>
              {completedCount}/{taskCount} tarefas
            </Text>
          </View>
          <Text style={[styles.progressLabel, { color: project.color }]}>
            {progress}%
          </Text>
        </View>

        {/* Progress bar */}
        <ProgressBar progress={progress} color={project.color} height={4} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  topAccent: {
    height: 3,
    width: '100%',
  },
  body: {
    padding: SPACING.md,
    gap: SPACING.xs + 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    padding: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: FONT_SIZE.sm,
  },
  progressLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
});

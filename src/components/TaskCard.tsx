import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { TaskCardProps } from '../types';
import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  SPACING,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../styles/theme';
import { formatDateShort, isOverdue } from '../utils/helpers';
import { useProjects } from '../contexts/ProjectContext';

export function TaskCard({
  task,
  onPress,
  onToggleComplete,
  onDelete,
  showProject = false,
}: TaskCardProps) {
  const { colors } = useTheme();
  const { getProjectById } = useProjects();

  const isCompleted = task.status === 'completed';
  const overdue = isOverdue(task.dueDate) && !isCompleted;
  const project = showProject ? getProjectById(task.projectId) : undefined;

  const priorityColor = PRIORITY_COLORS[task.priority];
  const statusColor = STATUS_COLORS[task.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: priorityColor,
        },
        isCompleted && { opacity: 0.65 },
      ]}
      activeOpacity={0.85}
    >
      {/* Left priority bar */}
      <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />

      {/* Checkbox */}
      <TouchableOpacity
        onPress={onToggleComplete}
        style={[
          styles.checkbox,
          {
            borderColor: isCompleted ? colors.success : colors.border,
            backgroundColor: isCompleted ? colors.success : 'transparent',
          },
        ]}
      >
        {isCompleted && (
          <Ionicons name="checkmark" size={12} color="#fff" />
        )}
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            isCompleted && { textDecorationLine: 'line-through', color: colors.textMuted },
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text
            style={[styles.description, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            {task.description}
          </Text>
        ) : null}

        <View style={styles.meta}>
          {/* Status badge */}
          <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {STATUS_LABELS[task.status]}
            </Text>
          </View>

          {/* Priority */}
          <View style={[styles.badge, { backgroundColor: priorityColor + '22' }]}>
            <Ionicons name="flag" size={10} color={priorityColor} />
            <Text style={[styles.badgeText, { color: priorityColor }]}>
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>

          {/* Due date */}
          {task.dueDate && (
            <View style={styles.dateRow}>
              <Ionicons
                name="calendar-outline"
                size={11}
                color={overdue ? colors.error : colors.textMuted}
              />
              <Text
                style={[
                  styles.dateText,
                  { color: overdue ? colors.error : colors.textMuted },
                ]}
              >
                {formatDateShort(task.dueDate)}
              </Text>
            </View>
          )}

          {/* Project tag */}
          {project && (
            <View style={[styles.projectTag, { backgroundColor: project.color + '22' }]}>
              <Text style={[styles.projectText, { color: project.color }]}>
                {project.name}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Delete */}
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderLeftWidth: 3,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
    paddingRight: SPACING.sm,
    overflow: 'hidden',
  },
  priorityBar: {
    width: 0, // handled by borderLeft
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 5,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  description: {
    fontSize: FONT_SIZE.sm,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dateText: {
    fontSize: FONT_SIZE.xs,
  },
  projectTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  projectText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  deleteBtn: {
    padding: SPACING.xs,
    marginLeft: 4,
  },
});

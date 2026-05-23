import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TaskContext';
import { useProjects } from '../../contexts/ProjectContext';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { CreateTaskModal } from './CreateTaskModal';
import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  SPACING,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../../styles/theme';
import { formatDate, getDaysUntilDue, isOverdue } from '../../utils/helpers';

export function TaskDetailsScreen() {
  const { colors } = useTheme();
  const { getTaskById, toggleTaskComplete, deleteTask } = useTasks();
  const { getProjectById } = useProjects();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const taskId = route.params?.taskId as string;
  const task = getTaskById(taskId);

  const [showEdit, setShowEdit] = useState(false);

  if (!task) return <Loading fullScreen message="Carregando tarefa..." />;

  const project = getProjectById(task.projectId);
  const priorityColor = PRIORITY_COLORS[task.priority];
  const statusColor = STATUS_COLORS[task.status];
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
  const daysLeft = getDaysUntilDue(task.dueDate);
  const isCompleted = task.status === 'completed';

  const handleDelete = () => {
    Alert.alert('Excluir tarefa', `Excluir "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Detalhes</Text>
        <TouchableOpacity
          onPress={() => setShowEdit(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Priority accent bar */}
        <View
          style={[styles.accentBar, { backgroundColor: priorityColor }]}
        />

        {/* Title block */}
        <View
          style={[
            styles.titleCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.titleRow}>
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: priorityColor + '25', borderColor: priorityColor },
              ]}
            >
              <Ionicons name="flag" size={14} color={priorityColor} />
            </View>
            <Text
              style={[
                styles.taskTitle,
                { color: colors.text },
                isCompleted && { textDecorationLine: 'line-through', color: colors.textMuted },
              ]}
            >
              {task.title}
            </Text>
          </View>

          {task.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {task.description}
            </Text>
          ) : (
            <Text style={[styles.description, { color: colors.textMuted, fontStyle: 'italic' }]}>
              Sem descrição.
            </Text>
          )}
        </View>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <InfoTile
            icon="radio-button-on"
            label="Status"
            colors={colors}
          >
            <View style={[styles.badgePill, { backgroundColor: statusColor + '22' }]}>
              <View style={[styles.badgeDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.badgeText, { color: statusColor }]}>
                {STATUS_LABELS[task.status]}
              </Text>
            </View>
          </InfoTile>

          <InfoTile
            icon="flag-outline"
            label="Prioridade"
            colors={colors}
          >
            <View style={[styles.badgePill, { backgroundColor: priorityColor + '22' }]}>
              <Ionicons name="flag" size={11} color={priorityColor} />
              <Text style={[styles.badgeText, { color: priorityColor }]}>
                {PRIORITY_LABELS[task.priority]}
              </Text>
            </View>
          </InfoTile>

          <InfoTile
            icon="calendar-outline"
            label="Data limite"
            colors={colors}
          >
            {task.dueDate ? (
              <View style={styles.dateRow}>
                <Text
                  style={[
                    styles.dateText,
                    { color: overdue ? colors.error : colors.text },
                  ]}
                >
                  {formatDate(task.dueDate)}
                </Text>
                {daysLeft !== null && (
                  <Text
                    style={[
                      styles.daysLeft,
                      {
                        color: overdue
                          ? colors.error
                          : daysLeft <= 3
                          ? colors.warning
                          : colors.textMuted,
                      },
                    ]}
                  >
                    {overdue
                      ? `${Math.abs(daysLeft)}d atrasada`
                      : daysLeft === 0
                      ? 'Hoje!'
                      : `${daysLeft}d restantes`}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={[styles.dateText, { color: colors.textMuted }]}>
                Sem data limite
              </Text>
            )}
          </InfoTile>

          <InfoTile
            icon="briefcase-outline"
            label="Projeto"
            colors={colors}
          >
            {project ? (
              <View style={styles.projectRow}>
                <View
                  style={[
                    styles.projectIconSmall,
                    { backgroundColor: project.color + '22' },
                  ]}
                >
                  <Ionicons
                    name={project.icon as any}
                    size={12}
                    color={project.color}
                  />
                </View>
                <Text style={[styles.dateText, { color: colors.text }]}>
                  {project.name}
                </Text>
              </View>
            ) : (
              <Text style={[styles.dateText, { color: colors.textMuted }]}>—</Text>
            )}
          </InfoTile>
        </View>

        {/* Timestamps */}
        <View
          style={[
            styles.timestampCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.tsRow}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.tsLabel, { color: colors.textMuted }]}>Criada em</Text>
            <Text style={[styles.tsValue, { color: colors.textSecondary }]}>
              {formatDate(task.createdAt)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.tsRow}>
            <Ionicons name="refresh-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.tsLabel, { color: colors.textMuted }]}>Atualizada</Text>
            <Text style={[styles.tsValue, { color: colors.textSecondary }]}>
              {formatDate(task.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title={isCompleted ? 'Reabrir tarefa' : 'Marcar concluída'}
            onPress={() => toggleTaskComplete(task.id)}
            variant={isCompleted ? 'outline' : 'primary'}
            icon={isCompleted ? 'refresh-outline' : 'checkmark-circle-outline'}
            fullWidth
            size="lg"
          />
          <Button
            title="Editar tarefa"
            onPress={() => setShowEdit(true)}
            variant="outline"
            icon="create-outline"
            fullWidth
            size="lg"
          />
          <Button
            title="Excluir tarefa"
            onPress={handleDelete}
            variant="danger"
            icon="trash-outline"
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>

      <CreateTaskModal
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        editTask={task}
      />
    </SafeAreaView>
  );
}

interface InfoTileProps {
  icon: string;
  label: string;
  children: React.ReactNode;
  colors: any;
}

function InfoTile({ icon, label, children, colors }: InfoTileProps) {
  return (
    <View
      style={[
        styles.infoTile,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.tileHeader}>
        <Ionicons name={icon as any} size={14} color={colors.textMuted} />
        <Text style={[styles.tileLabel, { color: colors.textMuted }]}>{label}</Text>
      </View>
      <View style={styles.tileValue}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  scroll: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  accentBar: {
    height: 3,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.xs,
  },
  titleCard: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  priorityDot: {
    width: 30,
    height: 30,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  taskTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    flex: 1,
    lineHeight: 30,
  },
  description: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  infoTile: {
    width: '48.5%',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm + 2,
    gap: SPACING.xs,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tileLabel: {
    fontSize: FONT_SIZE.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: FONT_WEIGHT.semibold,
  },
  tileValue: {},
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
  },
  dateRow: {
    gap: 2,
  },
  dateText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  daysLeft: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  projectIconSmall: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timestampCard: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  tsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.xs + 2,
  },
  tsLabel: {
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  tsValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  divider: {
    height: 1,
  },
  actions: {
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
});

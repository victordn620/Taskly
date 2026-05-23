import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TaskContext';
import { useProjects } from '../../contexts/ProjectContext';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Task, TaskPriority, TaskStatus } from '../../types';
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

interface Props {
  visible: boolean;
  onClose: () => void;
  editTask?: Task;
  defaultProjectId?: string;
}

const STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export function CreateTaskModal({ visible, onClose, editTask, defaultProjectId }: Props) {
  const { colors } = useTheme();
  const { createTask, updateTask } = useTasks();
  const { projects } = useProjects();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editTask;

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setStatus(editTask.status);
      setPriority(editTask.priority);
      setProjectId(editTask.projectId);
      setDueDate(editTask.dueDate ? editTask.dueDate.substring(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setProjectId(defaultProjectId || projects[0]?.id || '');
      setDueDate('');
    }
    setErrors({});
  }, [editTask, visible, defaultProjectId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Título é obrigatório';
    if (!projectId) e.project = 'Selecione um projeto';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        title: title.trim(),
        description,
        status,
        priority,
        projectId,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        tags: [],
      };
      if (isEditing && editTask) {
        await updateTask(editTask.id, data);
      } else {
        await createTask(data);
      }
      onClose();
    } catch {
      setErrors({ general: 'Ocorreu um erro. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={isEditing ? 'Editar tarefa' : 'Nova tarefa'}
    >
      <View style={styles.content}>
        <Input
          label="Título"
          placeholder="O que precisa ser feito?"
          value={title}
          onChangeText={v => { setTitle(v); setErrors(e => ({ ...e, title: undefined! })); }}
          icon="create-outline"
          error={errors.title}
        />

        <Input
          label="Descrição (opcional)"
          placeholder="Detalhes da tarefa..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Project selector */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Projeto</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.projectScroll}
          contentContainerStyle={styles.projectScrollContent}
        >
          {projects.map(p => (
            <TouchableOpacity
              key={p.id}
              onPress={() => setProjectId(p.id)}
              style={[
                styles.projectChip,
                {
                  backgroundColor:
                    projectId === p.id ? p.color + '22' : colors.inputBackground,
                  borderColor: projectId === p.id ? p.color : colors.border,
                },
              ]}
            >
              <Ionicons
                name={p.icon as any}
                size={14}
                color={projectId === p.id ? p.color : colors.textMuted}
              />
              <Text
                style={[
                  styles.chipText,
                  { color: projectId === p.id ? p.color : colors.textSecondary },
                ]}
              >
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {errors.project && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.project}</Text>
        )}

        {/* Status */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Status</Text>
        <View style={styles.optionRow}>
          {STATUSES.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setStatus(s)}
              style={[
                styles.optionBtn,
                {
                  backgroundColor:
                    status === s ? STATUS_COLORS[s] + '22' : colors.inputBackground,
                  borderColor: status === s ? STATUS_COLORS[s] : colors.border,
                  flex: 1,
                },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: STATUS_COLORS[s] }]} />
              <Text
                style={[
                  styles.optionText,
                  { color: status === s ? STATUS_COLORS[s] : colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {STATUS_LABELS[s]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Priority */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Prioridade</Text>
        <View style={styles.optionRow}>
          {PRIORITIES.map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.optionBtn,
                {
                  backgroundColor:
                    priority === p ? PRIORITY_COLORS[p] + '22' : colors.inputBackground,
                  borderColor: priority === p ? PRIORITY_COLORS[p] : colors.border,
                  flex: 1,
                },
              ]}
            >
              <Ionicons
                name="flag"
                size={12}
                color={priority === p ? PRIORITY_COLORS[p] : colors.textMuted}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: priority === p ? PRIORITY_COLORS[p] : colors.textSecondary },
                ]}
              >
                {PRIORITY_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Due date */}
        <Input
          label="Data limite (AAAA-MM-DD)"
          placeholder="Ex: 2025-12-31"
          value={dueDate}
          onChangeText={setDueDate}
          icon="calendar-outline"
          keyboardType="numeric"
        />

        {errors.general && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.general}</Text>
        )}

        <Button
          title={isEditing ? 'Salvar alterações' : 'Criar tarefa'}
          onPress={handleSave}
          loading={loading}
          fullWidth
          size="lg"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
    paddingBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  projectScroll: {
    marginBottom: SPACING.xs,
  },
  projectScrollContent: {
    gap: SPACING.xs,
    paddingBottom: 4,
  },
  projectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  optionRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  optionText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.xs,
  },
});

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TaskContext';
import { useProjects } from '../../contexts/ProjectContext';
import { TaskCard } from '../../components/TaskCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Loading } from '../../components/Loading';
import { CreateTaskModal } from './CreateTaskModal';
import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  PRIORITY_LABELS,
  SPACING,
  STATUS_LABELS,
} from '../../styles/theme';
import { filterTasks, sortTasksByPriority } from '../../utils/helpers';
import { TaskPriority, TaskStatus } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

type StatusFilter = TaskStatus | 'all';
type PriorityFilter = TaskPriority | 'all';

export function TasksScreen() {
  const { colors } = useTheme();
  const { tasks, isLoading, toggleTaskComplete, deleteTask } = useTasks();
  const { getProjectById } = useProjects();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const projectId = route.params?.projectId as string | undefined;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 250);

  const project = projectId ? getProjectById(projectId) : undefined;

  const filtered = useMemo(() => {
    const base = projectId
      ? tasks.filter(t => t.projectId === projectId)
      : tasks;
    return sortTasksByPriority(
      filterTasks(base, debouncedSearch, statusFilter, priorityFilter)
    );
  }, [tasks, debouncedSearch, statusFilter, priorityFilter, projectId]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Excluir tarefa', `Excluir "${title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deleteTask(id),
      },
    ]);
  };

  if (isLoading) return <Loading fullScreen message="Carregando tarefas..." />;

  const statusOptions: StatusFilter[] = ['all', 'pending', 'in_progress', 'completed'];
  const priorityOptions: PriorityFilter[] = ['all', 'high', 'medium', 'low'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            {project ? project.name : 'Tarefas'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {filtered.length} tarefa{filtered.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  showFilters ? colors.primary + '22' : colors.inputBackground,
                borderColor:
                  showFilters ? colors.primary : colors.border,
              },
            ]}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={showFilters ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
          <Button
            title="Nova"
            onPress={() => setShowCreate(true)}
            icon="add"
            size="sm"
          />
        </View>
      </View>

      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Ionicons name="search" size={16} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar tarefas..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={[styles.filtersContainer, { borderColor: colors.border }]}>
          <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Status</Text>
          <View style={styles.chipRow}>
            {statusOptions.map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => setStatusFilter(s)}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      statusFilter === s ? colors.primary : colors.inputBackground,
                    borderColor:
                      statusFilter === s ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: statusFilter === s ? '#fff' : colors.textSecondary },
                  ]}
                >
                  {s === 'all' ? 'Todos' : STATUS_LABELS[s]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Prioridade</Text>
          <View style={styles.chipRow}>
            {priorityOptions.map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriorityFilter(p)}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      priorityFilter === p ? colors.primary : colors.inputBackground,
                    borderColor:
                      priorityFilter === p ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: priorityFilter === p ? '#fff' : colors.textSecondary },
                  ]}
                >
                  {p === 'all' ? 'Todas' : PRIORITY_LABELS[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title={search ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa ainda'}
            subtitle={
              search
                ? `Sem resultados para "${search}"`
                : 'Crie sua primeira tarefa para começar!'
            }
            actionLabel={!search ? 'Criar tarefa' : undefined}
            onAction={!search ? () => setShowCreate(true) : undefined}
          />
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            showProject={!projectId}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
            onToggleComplete={() => toggleTaskComplete(item.id)}
            onDelete={() => handleDelete(item.id, item.title)}
          />
        )}
      />

      <CreateTaskModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        defaultProjectId={projectId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.extrabold,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
    alignItems: 'center',
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    paddingVertical: 4,
  },
  filtersContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  filterLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    flexGrow: 1,
  },
});

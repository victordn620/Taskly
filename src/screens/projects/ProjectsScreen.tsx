import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../contexts/ThemeContext';
import { useProjects } from '../../contexts/ProjectContext';
import { useTasks } from '../../contexts/TaskContext';
import { ProjectCard } from '../../components/ProjectCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Loading } from '../../components/Loading';
import { CreateProjectModal } from './CreateProjectModal';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/theme';
import { Project } from '../../types';

export function ProjectsScreen() {
  const { colors } = useTheme();
  const { projects, isLoading, deleteProject } = useProjects();
  const { tasks, deleteTask } = useTasks();
  const navigation = useNavigation<any>();

  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState<Project | undefined>();

  const handleDelete = (project: Project) => {
    Alert.alert(
      'Excluir projeto',
      `Excluir "${project.name}"? As tarefas associadas também serão removidas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            // Delete associated tasks first
            const associated = tasks.filter(t => t.projectId === project.id);
            for (const task of associated) {
              await deleteTask(task.id);
            }
            await deleteProject(project.id);
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <Loading fullScreen message="Carregando projetos..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Projetos</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {projects.length} projeto{projects.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Button
          title="Novo"
          onPress={() => { setEditProject(undefined); setShowCreate(true); }}
          icon="add"
          size="sm"
        />
      </View>

      <FlatList
        data={projects}
        keyExtractor={p => p.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="briefcase-outline"
            title="Nenhum projeto ainda"
            subtitle="Crie seu primeiro projeto para começar a organizar suas tarefas."
            actionLabel="Criar projeto"
            onAction={() => setShowCreate(true)}
          />
        }
        renderItem={({ item }) => {
          const projectTasks = tasks.filter(t => t.projectId === item.id);
          const completed = projectTasks.filter(t => t.status === 'completed').length;
          return (
            <ProjectCard
              project={item}
              taskCount={projectTasks.length}
              completedCount={completed}
              onPress={() =>
                navigation.navigate('TasksList', { projectId: item.id })
              }
              onEdit={() => { setEditProject(item); setShowCreate(true); }}
              onDelete={() => handleDelete(item)}
            />
          );
        }}
      />

      <CreateProjectModal
        visible={showCreate}
        onClose={() => { setShowCreate(false); setEditProject(undefined); }}
        editProject={editProject}
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
    borderBottomWidth: 0,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.extrabold,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  list: {
    padding: SPACING.md,
    flexGrow: 1,
  },
});

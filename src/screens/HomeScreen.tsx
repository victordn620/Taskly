import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { useProjects } from '../contexts/ProjectContext';
import { useStats } from '../hooks/useStats';
import { ProgressBar } from '../components/ProgressBar';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING, STATUS_COLORS } from '../styles/theme';
import { getGreeting, sortTasksByPriority } from '../utils/helpers';

export function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { tasks, toggleTaskComplete, deleteTask } = useTasks();
  const { projects } = useProjects();
  const stats = useStats();
  const navigation = useNavigation<any>();

  const recentTasks = sortTasksByPriority(
    tasks.filter(t => t.status !== 'completed')
  ).slice(0, 4);

  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: colors.textMuted }]}>
              {getGreeting()}, 👋
            </Text>
            <Text style={[styles.name, { color: colors.text }]}>
              {firstName}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.avatarText}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero card */}
        <LinearGradient
          colors={['#7C3AED', '#4C1D95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Progresso geral</Text>
              <Text style={styles.heroPercent}>{stats.completionRate}%</Text>
            </View>
            <View style={styles.heroIcon}>
              <Ionicons name="trophy" size={28} color="#fff" />
            </View>
          </View>
          <ProgressBar
            progress={stats.completionRate}
            color="rgba(255,255,255,0.9)"
            height={6}
          />
          <Text style={styles.heroSub}>
            {stats.completedTasks} de {stats.totalTasks} tarefas concluídas
          </Text>
        </LinearGradient>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard
            label="Projetos"
            value={stats.totalProjects}
            icon="briefcase"
            color={colors.secondary}
            colors={colors}
            onPress={() => navigation.navigate('Projects')}
          />
          <StatCard
            label="Pendentes"
            value={stats.pendingTasks}
            icon="time"
            color={STATUS_COLORS.pending}
            colors={colors}
            onPress={() => navigation.navigate('Tasks')}
          />
          <StatCard
            label="Fazendo"
            value={stats.inProgressTasks}
            icon="sync"
            color={STATUS_COLORS.in_progress}
            colors={colors}
            onPress={() => navigation.navigate('Tasks')}
          />
          <StatCard
            label="Feitas"
            value={stats.completedTasks}
            icon="checkmark-circle"
            color={STATUS_COLORS.completed}
            colors={colors}
            onPress={() => navigation.navigate('Tasks')}
          />
        </View>

        {/* Recent tasks */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tarefas prioritárias
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              Ver todas
            </Text>
          </TouchableOpacity>
        </View>

        {recentTasks.length === 0 ? (
          <EmptyState
            icon="checkmark-done-circle"
            title="Tudo em dia!"
            subtitle="Nenhuma tarefa pendente. Bom trabalho!"
          />
        ) : (
          recentTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              showProject
              onPress={() => navigation.navigate('Tasks', { screen: 'TaskDetails', params: { taskId: task.id } })}
              onToggleComplete={() => toggleTaskComplete(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        )}

        {/* Projects quick access */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Projetos ativos
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {projects.slice(0, 3).map(project => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const done = projectTasks.filter(t => t.status === 'completed').length;
          const progress = projectTasks.length > 0
            ? Math.round((done / projectTasks.length) * 100)
            : 0;
          return (
            <TouchableOpacity
              key={project.id}
              style={[styles.projectRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Projects')}
              activeOpacity={0.85}
            >
              <View style={[styles.projectIcon, { backgroundColor: project.color + '22' }]}>
                <Ionicons name={project.icon as any} size={18} color={project.color} />
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <View style={styles.projectRowMeta}>
                  <Text style={[styles.projectName, { color: colors.text }]}>{project.name}</Text>
                  <Text style={[styles.projectProgress, { color: project.color }]}>{progress}%</Text>
                </View>
                <ProgressBar progress={progress} color={project.color} height={4} />
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  colors: any;
  onPress: () => void;
}

function StatCard({ label, value, icon, color, colors, onPress }: StatCardProps) {
  return (
    <TouchableOpacity
      style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={16} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  greeting: {
    fontSize: FONT_SIZE.sm,
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.extrabold,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.lg,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  heroPercent: {
    color: '#fff',
    fontSize: FONT_SIZE.display,
    fontWeight: FONT_WEIGHT.extrabold,
    lineHeight: 42,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: FONT_SIZE.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.extrabold,
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  seeAll: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.xs,
  },
  projectIcon: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectRowMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  projectProgress: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
});

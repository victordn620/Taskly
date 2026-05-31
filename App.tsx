import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type ThemeMode = 'dark' | 'light';

type TaskItem = {
  id: string;
  title: string;
  project: string;
  status: 'Pendente' | 'Em andamento' | 'Concluída';
  priority: 'Alta' | 'Média' | 'Baixa';
};

const demoTasks: TaskItem[] = [
  { id: '1', title: 'Criar tela de login', project: 'Auth', status: 'Concluída', priority: 'Alta' },
  { id: '2', title: 'Ajustar navegação', project: 'App', status: 'Em andamento', priority: 'Média' },
  { id: '3', title: 'Publicar no GitHub', project: 'Entrega', status: 'Pendente', priority: 'Alta' },
];

export default function App() {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [activeFilter, setActiveFilter] = useState<'Todas' | TaskItem['status']>('Todas');

  const colors = mode === 'dark' ? darkColors : lightColors;

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'Todas') {
      return demoTasks;
    }

    return demoTasks.filter((task) => task.status === activeFilter);
  }, [activeFilter]);

  const completedCount = demoTasks.filter((task) => task.status === 'Concluída').length;
  const completionRate = Math.round((completedCount / demoTasks.length) * 100);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <ExpoStatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={colors.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={[styles.kicker, { color: colors.muted }]}>Expo Snack ready</Text>
              <Text style={[styles.title, { color: colors.text }]}>Taskly</Text>
              <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Um demo simples para apresentar no Snack e subir no GitHub.</Text>
            </View>

            <TouchableOpacity
              style={[styles.modeButton, { backgroundColor: colors.surface }]}
              onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              activeOpacity={0.85}
            >
              <Ionicons
                name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
                size={18}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Concluídas" value={`${completedCount}`} colors={colors} />
            <StatCard label="Taxa" value={`${completionRate}%`} colors={colors} />
            <StatCard label="Total" value={`${demoTasks.length}`} colors={colors} />
          </View>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Filtros</Text>
          <View style={styles.filterRow}>
            {(['Todas', 'Pendente', 'Em andamento', 'Concluída'] as const).map((filter) => {
              const active = filter === activeFilter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: active ? colors.primary : colors.surfaceAlt,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterText, { color: active ? '#FFFFFF' : colors.text }]}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tarefas</Text>
          <View style={styles.taskList}>
            {filteredTasks.map((task) => (
              <View key={task.id} style={[styles.taskItem, { borderColor: colors.borderAlt, backgroundColor: colors.surfaceAlt }]}>
                <View style={[styles.taskDot, { backgroundColor: statusColor(task.status) }]} />
                <View style={styles.taskBody}>
                  <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
                  <Text style={[styles.taskMeta, { color: colors.secondaryText }]}>
                    {task.project} • {task.priority}
                  </Text>
                </View>
                <Text style={[styles.taskStatus, { color: statusColor(task.status) }]}>{task.status}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Ionicons name="logo-github" size={18} color={colors.secondaryText} />
          <Text style={[styles.footerText, { color: colors.secondaryText }]}>Pronto para colar no Snack e publicar no GitHub.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, colors }: { label: string; value: string; colors: ThemeColors }) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.statLabel, { color: colors.secondaryText }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderAlt: string;
  text: string;
  secondaryText: string;
  muted: string;
  primary: string;
  hero: [string, string, string];
};

const darkColors: ThemeColors = {
  background: '#070B16',
  surface: '#10182A',
  surfaceAlt: '#141E34',
  border: '#24304A',
  borderAlt: '#1B2740',
  text: '#F4F7FF',
  secondaryText: '#AAB5D1',
  muted: '#7B88AA',
  primary: '#7C3AED',
  hero: ['#10182A', '#1A1140', '#070B16'],
};

const lightColors: ThemeColors = {
  background: '#F4F7FF',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F4FA',
  border: '#DCE3F1',
  borderAlt: '#E8EDF7',
  text: '#0E1728',
  secondaryText: '#52607A',
  muted: '#7886A5',
  primary: '#5B21B6',
  hero: ['#FFFFFF', '#EDE9FE', '#F4F7FF'],
};

function statusColor(status: TaskItem['status']) {
  switch (status) {
    case 'Concluída':
      return '#10B981';
    case 'Em andamento':
      return '#3B82F6';
    default:
      return '#F59E0B';
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: 18,
    paddingBottom: 28,
    gap: 16,
  },
  hero: {
    borderRadius: 28,
    padding: 20,
    gap: 18,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    marginBottom: 6,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },
  modeButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  card: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  filterText: {
    fontWeight: '700',
    fontSize: 13,
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  taskDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  taskBody: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  taskMeta: {
    fontSize: 13,
  },
  taskStatus: {
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useStats } from '../hooks/useStats';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
} from '../styles/theme';

export function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const stats = useStats();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'U';

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSavingProfile(true);
    try {
      await updateUser({ name: editName.trim(), email: editEmail.trim() });
      setShowEditModal(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile hero */}
        <LinearGradient
          colors={['#7C3AED', '#4C1D95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.avatarRing}>
            <Text style={styles.avatarLetter}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.heroName}>{user?.name}</Text>
          <Text style={styles.heroEmail}>{user?.email}</Text>

          <TouchableOpacity
            style={styles.editAvatarBtn}
            onPress={() => {
              setEditName(user?.name || '');
              setEditEmail(user?.email || '');
              setShowEditModal(true);
            }}
          >
            <Ionicons name="create-outline" size={14} color="#fff" />
            <Text style={styles.editAvatarText}>Editar perfil</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats summary */}
        <View style={styles.statsRow}>
          <StatPill
            value={stats.totalProjects}
            label="Projetos"
            color={colors.secondary}
            colors={colors}
          />
          <StatPill
            value={stats.totalTasks}
            label="Tarefas"
            color={colors.primary}
            colors={colors}
          />
          <StatPill
            value={stats.completedTasks}
            label="Concluídas"
            color={colors.success}
            colors={colors}
          />
          <StatPill
            value={`${stats.completionRate}%`}
            label="Taxa"
            color={colors.accent}
            colors={colors}
          />
        </View>

        {/* Preferences section */}
        <SectionHeader title="Preferências" colors={colors} />

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="moon-outline"
            label="Modo escuro"
            colors={colors}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary + '88' }}
                thumbColor={isDark ? colors.primary : colors.textMuted}
              />
            }
          />
          <Divider colors={colors} />
          <SettingRow
            icon="notifications-outline"
            label="Notificações"
            subtitle="Em breve"
            colors={colors}
            right={
              <Switch
                value={false}
                disabled
                trackColor={{ false: colors.border, true: colors.primary + '88' }}
                thumbColor={colors.textMuted}
              />
            }
          />
        </View>

        {/* App section */}
        <SectionHeader title="Aplicativo" colors={colors} />

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="information-circle-outline"
            label="Versão"
            colors={colors}
            right={
              <Text style={[styles.valueText, { color: colors.textMuted }]}>1.0.0</Text>
            }
          />
          <Divider colors={colors} />
          <SettingRow
            icon="code-slash-outline"
            label="Tecnologias"
            subtitle="Expo + React Native + TypeScript"
            colors={colors}
          />
          <Divider colors={colors} />
          <SettingRow
            icon="school-outline"
            label="Desenvolvido por"
            subtitle="Projeto Taskly"
            colors={colors}
          />
        </View>

        {/* Account section */}
        <SectionHeader title="Conta" colors={colors} />

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              setEditName(user?.name || '');
              setEditEmail(user?.email || '');
              setShowEditModal(true);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Editar perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <Divider colors={colors} />
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: colors.error + '18' }]}>
              <Ionicons name="log-out-outline" size={18} color={colors.error} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.error }]}>Sair da conta</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      {/* Edit profile modal */}
      <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar perfil"
      >
        <View style={styles.modalContent}>
          <Input
            label="Nome completo"
            placeholder="Seu nome"
            value={editName}
            onChangeText={setEditName}
            icon="person-outline"
            autoCapitalize="words"
          />
          <Input
            label="Email"
            placeholder="seu@email.com"
            value={editEmail}
            onChangeText={setEditEmail}
            icon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Button
            title="Salvar alterações"
            onPress={handleSaveProfile}
            loading={savingProfile}
            fullWidth
            size="lg"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, colors }: { title: string; colors: any }) {
  return (
    <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>{title}</Text>
  );
}

function Divider({ colors }: { colors: any }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

interface SettingRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  colors: any;
  right?: React.ReactNode;
}

function SettingRow({ icon, label, subtitle, colors, right }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name={icon as any} size={18} color={colors.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}

interface StatPillProps {
  value: number | string;
  label: string;
  color: string;
  colors: any;
}

function StatPill({ value, label, color, colors }: StatPillProps) {
  return (
    <View style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: SPACING.xl,
  },
  hero: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: SPACING.xs,
  },
  avatarLetter: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.extrabold,
    color: '#fff',
  },
  heroName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: '#fff',
  },
  heroEmail: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  editAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginTop: SPACING.xs,
  },
  editAvatarText: {
    color: '#fff',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    gap: 2,
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.extrabold,
  },
  statLabel: {
    fontSize: 10,
  },
  sectionHeader: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  card: {
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    minHeight: 54,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  settingSubtitle: {
    fontSize: FONT_SIZE.xs,
    marginTop: 1,
  },
  valueText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  divider: {
    height: 1,
    marginLeft: SPACING.md + 36 + SPACING.sm,
  },
  modalContent: {
    gap: 4,
    paddingBottom: SPACING.md,
  },
});

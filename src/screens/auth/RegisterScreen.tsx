import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthStackParamList } from '../../types';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const { colors } = useTheme();
  const { register } = useAuth();
  const navigation = useNavigation<Nav>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome é obrigatório';
    if (!email.trim()) e.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email inválido';
    if (!password) e.password = 'Senha é obrigatória';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (password !== confirm) e.confirm = 'Senhas não conferem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) =>
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#7C3AED', '#5B21B6']}
            style={styles.logoGradient}
          >
            <Ionicons name="cloud" size={32} color="#fff" />
          </LinearGradient>
          <Text style={[styles.appName, { color: colors.text }]}>
            Cloud<Text style={{ color: colors.primaryLight }}>Tasks</Text>
          </Text>
        </View>

        {/* Card */}
        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Criar conta</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
            Comece a organizar seus projetos gratuitamente
          </Text>

          <Input
            label="Nome completo"
            placeholder="Seu nome"
            value={name}
            onChangeText={v => { setName(v); clearError('name'); }}
            icon="person-outline"
            autoCapitalize="words"
            error={errors.name}
          />
          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={v => { setEmail(v); clearError('email'); }}
            icon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
          />
          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={v => { setPassword(v); clearError('password'); }}
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />
          <Input
            label="Confirmar senha"
            placeholder="Repita a senha"
            value={confirm}
            onChangeText={v => { setConfirm(v); clearError('confirm'); }}
            icon="shield-checkmark-outline"
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirm}
          />

          <Button
            title="Criar conta"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            size="lg"
          />
        </View>

        {/* Login */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Já tem conta?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>
              Entrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  appName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '300',
  },
  card: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.lg,
  },
  footerText: { fontSize: FONT_SIZE.md },
  footerLink: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
});

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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthStackParamList } from '../../types';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState('victor.daniel@taskly.app');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email inválido';
    if (!password) e.password = 'Senha é obrigatória';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top gradient blob */}
        <View style={styles.blobContainer} pointerEvents="none">
          <LinearGradient
            colors={['#7C3AED44', 'transparent']}
            style={styles.blob}
          />
        </View>

        {/* Logo */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#7C3AED', '#5B21B6']}
            style={styles.logoGradient}
          >
            <Ionicons name="checkmark-done" size={36} color="#fff" />
          </LinearGradient>
          <Text style={[styles.appName, { color: colors.text }]}>
            Tas<Text style={{ color: colors.primaryLight }}>kly</Text>
          </Text>
          <Text style={[styles.welcome, { color: colors.textMuted }]}>
            Bem-vindo de volta 👋
          </Text>
        </View>

        {/* Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Entrar na conta
          </Text>

          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: undefined })); }}
            icon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: undefined })); }}
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          />

          {/* Demo hint */}
          <View style={[styles.hint, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <Ionicons name="information-circle-outline" size={16} color={colors.primaryLight} />
            <Text style={[styles.hintText, { color: colors.primaryLight }]}>
              Demo: victor.daniel@taskly.app / 123456
            </Text>
          </View>
        </View>

        {/* Register */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Não tem conta?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>
              Criar conta
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
  blobContainer: {
    position: 'absolute',
    top: -80,
    left: -80,
    right: -80,
  },
  blob: {
    width: '200%',
    height: 300,
    borderRadius: 200,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: SPACING.xl,
    gap: SPACING.xs,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  appName: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  welcome: {
    fontSize: FONT_SIZE.md,
    marginTop: 4,
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
    marginBottom: SPACING.md,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.xs,
  },
  hintText: {
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.md,
  },
  footerLink: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
});

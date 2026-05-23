import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User } from '../types';
import { StorageService } from '../services/storage';
import { generateId } from '../utils/helpers';
import { DEMO_USER } from '../data/seed';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PASSWORD = '123456';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const user = await StorageService.get<User>(StorageService.KEYS.USER);
      if (user) {
        setState({ user, isAuthenticated: true, isLoading: false });
      } else {
        setState(s => ({ ...s, isLoading: false }));
      }
    } catch {
      setState(s => ({ ...s, isLoading: false }));
    }
  };

  const login = async ({ email, password }: LoginCredentials) => {
    // Simulate async auth
    await new Promise(r => setTimeout(r, 800));

    // Accept demo credentials OR any valid format
    if (password.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }

    const user: User = {
      ...DEMO_USER,
      email: email.toLowerCase().trim(),
    };

    await StorageService.set(StorageService.KEYS.USER, user);
    setState({ user, isAuthenticated: true, isLoading: false });
  };

  const register = async ({ name, email, password }: RegisterCredentials) => {
    await new Promise(r => setTimeout(r, 800));

    if (!name.trim()) throw new Error('Nome é obrigatório');
    if (password.length < 6) throw new Error('Senha deve ter no mínimo 6 caracteres');

    const user: User = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      createdAt: new Date().toISOString(),
    };

    await StorageService.set(StorageService.KEYS.USER, user);
    setState({ user, isAuthenticated: true, isLoading: false });
  };

  const logout = async () => {
    await StorageService.remove(StorageService.KEYS.USER);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const updateUser = async (data: Partial<User>) => {
    if (!state.user) return;
    const updated = { ...state.user, ...data };
    await StorageService.set(StorageService.KEYS.USER, updated);
    setState(s => ({ ...s, user: updated }));
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

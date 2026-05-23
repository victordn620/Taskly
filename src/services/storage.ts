import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@cloudtasks:user',
  AUTH: '@cloudtasks:auth',
  PROJECTS: '@cloudtasks:projects',
  TASKS: '@cloudtasks:tasks',
  THEME: '@cloudtasks:theme',
} as const;

export const StorageService = {
  KEYS,

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch {}
  },
};

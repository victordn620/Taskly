import React, { createContext, useContext, useState, useEffect } from 'react';
import { TaskContextType, Task } from '../types';
import { StorageService } from '../services/storage';
import { generateId } from '../utils/helpers';
import { DEMO_TASKS } from '../data/seed';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const saved = await StorageService.get<Task[]>(StorageService.KEYS.TASKS);
      if (saved && saved.length > 0) {
        setTasks(saved);
      } else {
        setTasks(DEMO_TASKS);
        await StorageService.set(StorageService.KEYS.TASKS, DEMO_TASKS);
      }
    } catch {
      setTasks(DEMO_TASKS);
    } finally {
      setIsLoading(false);
    }
  };

  const persist = async (updated: Task[]) => {
    setTasks(updated);
    await StorageService.set(StorageService.KEYS.TASKS, updated);
  };

  const createTask = async (
    data: Omit<Task, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => {
    const task: Task = {
      ...data,
      id: generateId(),
      ownerId: 'user-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await persist([task, ...tasks]);
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
    );
    await persist(updated);
  };

  const deleteTask = async (id: string) => {
    await persist(tasks.filter(t => t.id !== id));
  };

  const getTaskById = (id: string) => tasks.find(t => t.id === id);

  const getTasksByProject = (projectId: string) =>
    tasks.filter(t => t.projectId === projectId);

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(id, { status: newStatus });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        createTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByProject,
        toggleTaskComplete,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextType {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be inside TaskProvider');
  return ctx;
}

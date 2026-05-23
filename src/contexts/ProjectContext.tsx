import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectContextType, Project } from '../types';
import { StorageService } from '../services/storage';
import { generateId } from '../utils/helpers';
import { DEMO_PROJECTS } from '../data/seed';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const saved = await StorageService.get<Project[]>(StorageService.KEYS.PROJECTS);
      if (saved && saved.length > 0) {
        setProjects(saved);
      } else {
        // Seed with demo data on first run
        setProjects(DEMO_PROJECTS);
        await StorageService.set(StorageService.KEYS.PROJECTS, DEMO_PROJECTS);
      }
    } catch {
      setProjects(DEMO_PROJECTS);
    } finally {
      setIsLoading(false);
    }
  };

  const persist = async (updated: Project[]) => {
    setProjects(updated);
    await StorageService.set(StorageService.KEYS.PROJECTS, updated);
  };

  const createProject = async (
    data: Omit<Project, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => {
    const project: Project = {
      ...data,
      id: generateId(),
      ownerId: 'user-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await persist([project, ...projects]);
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const updated = projects.map(p =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    await persist(updated);
  };

  const deleteProject = async (id: string) => {
    await persist(projects.filter(p => p.id !== id));
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  return (
    <ProjectContext.Provider
      value={{ projects, isLoading, createProject, updateProject, deleteProject, getProjectById }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects(): ProjectContextType {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be inside ProjectProvider');
  return ctx;
}

import { useMemo } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { useProjects } from '../contexts/ProjectContext';
import { computeDashboardStats } from '../utils/helpers';

export function useStats() {
  const { tasks } = useTasks();
  const { projects } = useProjects();

  const stats = useMemo(
    () => computeDashboardStats(tasks, projects),
    [tasks, projects]
  );

  return stats;
}

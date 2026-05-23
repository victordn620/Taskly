import { TaskStatus, TaskPriority, DashboardStats, Task, Project } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export function getDaysUntilDue(dueDate?: string): number | null {
  if (!dueDate) return null;
  const diff = new Date(dueDate).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculateProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
}

export function computeDashboardStats(tasks: Task[], projects: Project[]): DashboardStats {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return {
    totalTasks: total,
    completedTasks: completed,
    inProgressTasks: inProgress,
    pendingTasks: pending,
    totalProjects: projects.length,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getPriorityOrder(priority: TaskPriority): number {
  const order: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
  return order[priority];
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
  );
}

export function filterTasks(
  tasks: Task[],
  query: string,
  status?: TaskStatus | 'all',
  priority?: TaskPriority | 'all'
): Task[] {
  return tasks.filter(task => {
    const matchesQuery =
      !query ||
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = !status || status === 'all' || task.status === status;
    const matchesPriority = !priority || priority === 'all' || task.priority === priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.substring(0, max) + '...';
}

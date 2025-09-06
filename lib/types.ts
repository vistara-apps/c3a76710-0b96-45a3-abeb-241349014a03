export interface User {
  userId: string;
  displayName: string;
  farcasterUsername: string;
}

export interface Task {
  taskId: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: Date;
  isCompleted: boolean;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  projectId: string;
  userId: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  dueTodayTasks: number;
  dueThisWeekTasks: number;
  completionRate: number;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

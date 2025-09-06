import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Project, User } from './types';

interface TaskFlowState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Data state
  tasks: Task[];
  projects: Project[];
  
  // UI state
  activeSection: string;
  isLoading: boolean;
  error: string | null;
  
  // Premium features state
  hasNotificationAccess: boolean;
  hasProjectLinking: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setTasks: (tasks: Task[]) => void;
  setProjects: (projects: Project[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTask: (taskId: string) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  setActiveSection: (section: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setNotificationAccess: (access: boolean) => void;
  setProjectLinking: (access: boolean) => void;
  
  // Computed getters
  getTodayTasks: () => Task[];
  getThisWeekTasks: () => Task[];
  getTasksByProject: (projectId: string) => Task[];
  getCompletedTasks: () => Task[];
  getTaskStats: () => {
    total: number;
    completed: number;
    dueToday: number;
    dueThisWeek: number;
    completionRate: number;
  };
}

export const useTaskFlowStore = create<TaskFlowState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      tasks: [],
      projects: [],
      activeSection: 'home',
      isLoading: false,
      error: null,
      hasNotificationAccess: false,
      hasProjectLinking: false,

      // Actions
      setUser: (user) => set({ user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setTasks: (tasks) => set({ tasks }),
      setProjects: (projects) => set({ projects }),
      
      addTask: (task) => set((state) => ({ 
        tasks: [task, ...state.tasks] 
      })),
      
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.taskId === taskId 
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        )
      })),
      
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task.taskId !== taskId)
      })),
      
      toggleTask: (taskId) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.taskId === taskId
            ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date() }
            : task
        )
      })),
      
      addProject: (project) => set((state) => ({
        projects: [project, ...state.projects]
      })),
      
      updateProject: (projectId, updates) => set((state) => ({
        projects: state.projects.map(project =>
          project.projectId === projectId
            ? { ...project, ...updates, updatedAt: new Date() }
            : project
        )
      })),
      
      deleteProject: (projectId) => set((state) => ({
        projects: state.projects.filter(project => project.projectId !== projectId),
        tasks: state.tasks.map(task =>
          task.projectId === projectId
            ? { ...task, projectId: undefined }
            : task
        )
      })),
      
      setActiveSection: (section) => set({ activeSection: section }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setNotificationAccess: (access) => set({ hasNotificationAccess: access }),
      setProjectLinking: (access) => set({ hasProjectLinking: access }),

      // Computed getters
      getTodayTasks: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return get().tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate < tomorrow;
        });
      },
      
      getThisWeekTasks: () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        
        return get().tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate >= startOfWeek && taskDate < endOfWeek;
        });
      },
      
      getTasksByProject: (projectId) => {
        return get().tasks.filter(task => task.projectId === projectId);
      },
      
      getCompletedTasks: () => {
        return get().tasks.filter(task => task.isCompleted);
      },
      
      getTaskStats: () => {
        const tasks = get().tasks;
        const completed = tasks.filter(task => task.isCompleted);
        const todayTasks = get().getTodayTasks();
        const weekTasks = get().getThisWeekTasks();
        
        return {
          total: tasks.length,
          completed: completed.length,
          dueToday: todayTasks.length,
          dueThisWeek: weekTasks.length,
          completionRate: tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0,
        };
      },
    }),
    {
      name: 'taskflow-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasNotificationAccess: state.hasNotificationAccess,
        hasProjectLinking: state.hasProjectLinking,
      }),
    }
  )
);

import { useCallback } from 'react';
import { useTaskFlowStore } from '@/lib/store';
import { Task, Project } from '@/lib/types';
import { generateId } from '@/lib/utils';
import toast from 'react-hot-toast';

export function useData() {
  const {
    user,
    setTasks,
    setProjects,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addProject,
    updateProject,
    deleteProject,
    setLoading,
    setError,
  } = useTaskFlowStore();

  const loadUserData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load tasks and projects in parallel
      const [tasksResponse, projectsResponse] = await Promise.all([
        fetch(`/api/tasks?userId=${user.userId}`),
        fetch(`/api/projects?userId=${user.userId}`),
      ]);

      const [tasksData, projectsData] = await Promise.all([
        tasksResponse.json(),
        projectsResponse.json(),
      ]);

      if (tasksData.success) {
        setTasks(tasksData.tasks);
      }

      if (projectsData.success) {
        setProjects(projectsData.projects);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load your data');
    } finally {
      setLoading(false);
    }
  }, [user, setTasks, setProjects, setLoading, setError]);

  const createTask = useCallback(async (taskData: {
    title: string;
    description?: string;
    dueDate: Date;
    projectId?: string;
  }) => {
    if (!user) {
      toast.error('Please authenticate first');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          ...taskData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task');
      }

      addTask(data.task);
      toast.success('Task created successfully!');
      return data.task;
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, addTask, setLoading]);

  const updateTaskData = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      setLoading(true);

      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          ...updates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update task');
      }

      updateTask(taskId, data.task);
      toast.success('Task updated successfully!');
      return data.task;
    } catch (error) {
      console.error('Error updating task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [updateTask, setLoading]);

  const deleteTaskData = useCallback(async (taskId: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/tasks?taskId=${taskId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete task');
      }

      deleteTask(taskId);
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [deleteTask, setLoading]);

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    try {
      // Optimistically update UI
      toggleTask(taskId);

      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          isCompleted: true, // This will be toggled by the API
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        toggleTask(taskId);
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  }, [toggleTask]);

  const createProject = useCallback(async (projectData: {
    title: string;
    description?: string;
    status?: 'active' | 'completed' | 'paused';
  }) => {
    if (!user) {
      toast.error('Please authenticate first');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          ...projectData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      addProject(data.project);
      toast.success('Project created successfully!');
      return data.project;
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, addProject, setLoading]);

  const updateProjectData = useCallback(async (projectId: string, updates: Partial<Project>) => {
    try {
      setLoading(true);

      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          ...updates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update project');
      }

      updateProject(projectId, data.project);
      toast.success('Project updated successfully!');
      return data.project;
    } catch (error) {
      console.error('Error updating project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [updateProject, setLoading]);

  const deleteProjectData = useCallback(async (projectId: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/projects?projectId=${projectId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete project');
      }

      deleteProject(projectId);
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [deleteProject, setLoading]);

  return {
    loadUserData,
    createTask,
    updateTask: updateTaskData,
    deleteTask: deleteTaskData,
    toggleTask: toggleTaskCompletion,
    createProject,
    updateProject: updateProjectData,
    deleteProject: deleteProjectData,
  };
}

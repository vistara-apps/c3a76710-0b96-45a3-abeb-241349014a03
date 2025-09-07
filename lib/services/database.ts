import { supabase, supabaseAdmin } from '../supabase';
import { Task, Project, User } from '../types';

export class DatabaseService {
  /**
   * User operations
   */
  async createUser(userData: {
    userId: string;
    displayName: string;
    farcasterUsername: string;
    farcasterFid: number;
  }): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        user_id: userData.userId,
        display_name: userData.displayName,
        farcaster_username: userData.farcasterUsername,
        farcaster_fid: userData.farcasterFid,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      userId: data.user_id,
      displayName: data.display_name,
      farcasterUsername: data.farcaster_username,
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }

    return {
      userId: data.user_id,
      displayName: data.display_name,
      farcasterUsername: data.farcaster_username,
    };
  }

  async getUserByFarcasterFid(fid: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('farcaster_fid', fid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }

    return {
      userId: data.user_id,
      displayName: data.display_name,
      farcasterUsername: data.farcaster_username,
    };
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        display_name: updates.displayName,
        farcaster_username: updates.farcasterUsername,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      userId: data.user_id,
      displayName: data.display_name,
      farcasterUsername: data.farcaster_username,
    };
  }

  /**
   * Task operations
   */
  async createTask(taskData: Omit<Task, 'createdAt' | 'updatedAt'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        task_id: taskData.taskId,
        user_id: taskData.userId,
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.dueDate.toISOString(),
        is_completed: taskData.isCompleted,
        project_id: taskData.projectId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      taskId: data.task_id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      dueDate: new Date(data.due_date),
      isCompleted: data.is_completed,
      projectId: data.project_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(task => ({
      taskId: task.task_id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      dueDate: new Date(task.due_date),
      isCompleted: task.is_completed,
      projectId: task.project_id,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at),
    }));
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate.toISOString();
    if (updates.isCompleted !== undefined) updateData.is_completed = updates.isCompleted;
    if (updates.projectId !== undefined) updateData.project_id = updates.projectId;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('task_id', taskId)
      .select()
      .single();

    if (error) throw error;

    return {
      taskId: data.task_id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      dueDate: new Date(data.due_date),
      isCompleted: data.is_completed,
      projectId: data.project_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('task_id', taskId);

    if (error) throw error;
  }

  /**
   * Project operations
   */
  async createProject(projectData: Omit<Project, 'createdAt' | 'updatedAt'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        project_id: projectData.projectId,
        user_id: projectData.userId,
        title: projectData.title,
        description: projectData.description,
        status: projectData.status,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      projectId: data.project_id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      status: data.status,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(project => ({
      projectId: project.project_id,
      userId: project.user_id,
      title: project.title,
      description: project.description,
      status: project.status,
      createdAt: new Date(project.created_at),
      updatedAt: new Date(project.updated_at),
    }));
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) throw error;

    return {
      projectId: data.project_id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      status: data.status,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('project_id', projectId);

    if (error) throw error;
  }

  /**
   * Subscription operations (for premium features)
   */
  async createSubscription(
    userId: string,
    featureType: string,
    expiresAt?: Date
  ): Promise<void> {
    const { error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        feature_type: featureType,
        is_active: true,
        expires_at: expiresAt?.toISOString(),
      });

    if (error) throw error;
  }

  async getUserSubscriptions(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;

    return data || [];
  }

  async hasActiveSubscription(userId: string, featureType: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('feature_type', featureType)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) return false;

    // Check if subscription has expired
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        // Deactivate expired subscription
        await supabase
          .from('user_subscriptions')
          .update({ is_active: false })
          .eq('id', data.id);
        return false;
      }
    }

    return true;
  }

  async deactivateSubscription(userId: string, featureType: string): Promise<void> {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('feature_type', featureType);

    if (error) throw error;
  }
}

export const databaseService = new DatabaseService();

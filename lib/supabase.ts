import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          display_name: string;
          farcaster_username: string;
          farcaster_fid: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name: string;
          farcaster_username: string;
          farcaster_fid: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string;
          farcaster_username?: string;
          farcaster_fid?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          task_id: string;
          user_id: string;
          title: string;
          description: string | null;
          due_date: string;
          is_completed: boolean;
          project_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          task_id: string;
          user_id: string;
          title: string;
          description?: string | null;
          due_date: string;
          is_completed?: boolean;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          task_id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          due_date?: string;
          is_completed?: boolean;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          project_id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: 'active' | 'completed' | 'paused';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: 'active' | 'completed' | 'paused';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          project_id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: 'active' | 'completed' | 'paused';
          created_at?: string;
          updated_at?: string;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          feature_type: string;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          feature_type: string;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          feature_type?: string;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

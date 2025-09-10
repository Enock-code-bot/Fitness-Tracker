import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://yqjjmrdpibcbtpfartvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxamptcmRwaWJjYnRwZmFydHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjMwODQsImV4cCI6MjA3Mjc5OTA4NH0.7kO55ovI1HDxIypRuSl40yJuQPSZRqoPb7A25ID-IiQ';

// Log configuration for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

// Validate configuration
if (!supabaseUrl) {
  throw new Error('Supabase URL is not configured.');
}

if (!supabaseAnonKey) {
  throw new Error('Supabase Anon Key is not configured.');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://')) {
  console.warn('Supabase URL should start with https://. Current URL:', supabaseUrl);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection (optional, for debugging)
supabase.auth.getSession().then(({ error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error);
  } else {
    console.log('Supabase connection successful');
  }
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          total_points: number;
          current_streak: number;
          longest_streak: number;
          preferred_units: string;
          notification_preferences: Record<string, boolean>;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          preferred_units?: string;
          notification_preferences?: Record<string, boolean>;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          preferred_units?: string;
          notification_preferences?: Record<string, boolean>;
          created_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          duration: number;
          calories_burned: number;
          date: string;
          notes: string;
          category_id: string | null;
          template_id: string | null;
          steps_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          duration: number;
          calories_burned: number;
          date?: string;
          notes?: string;
          category_id?: string | null;
          template_id?: string | null;
          steps_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          duration?: number;
          calories_burned?: number;
          date?: string;
          notes?: string;
          category_id?: string | null;
          template_id?: string | null;
          steps_count?: number | null;
          created_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          target_workouts: number;
          target_calories: number;
          target_duration: number;
          target_steps: number | null;
          target_water_ml: number | null;
          start_date: string;
          end_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          target_workouts: number;
          target_calories: number;
          target_duration: number;
          target_steps?: number | null;
          target_water_ml?: number | null;
          start_date?: string;
          end_date: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          target_workouts?: number;
          target_calories?: number;
          target_duration?: number;
          target_steps?: number | null;
          target_water_ml?: number | null;
          start_date?: string;
          end_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      workout_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          created_at?: string;
        };
      };
      workout_templates: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          description: string | null;
          exercises: Array<{
            name: string;
            sets?: number;
            reps?: number;
            duration?: number;
            weight?: number;
          }>;
          estimated_duration: number | null;
          estimated_calories: number | null;
          difficulty: string | null;
          is_public: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          description?: string | null;
          exercises?: Array<{
            name: string;
            sets?: number;
            reps?: number;
            duration?: number;
            weight?: number;
          }>;
          estimated_duration?: number | null;
          estimated_calories?: number | null;
          difficulty?: string | null;
          is_public?: boolean;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          description?: string | null;
          exercises?: Array<{
            name: string;
            sets?: number;
            reps?: number;
            duration?: number;
            weight?: number;
          }>;
          estimated_duration?: number | null;
          estimated_calories?: number | null;
          difficulty?: string | null;
          is_public?: boolean;
          created_by?: string;
          created_at?: string;
        };
      };
      steps: {
        Row: {
          id: string;
          user_id: string;
          steps_count: number;
          date: string;
          source: string;
          distance_km: number | null;
          calories_burned: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          steps_count: number;
          date?: string;
          source?: string;
          distance_km?: number | null;
          calories_burned?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          steps_count?: number;
          date?: string;
          source?: string;
          distance_km?: number | null;
          calories_burned?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      water_intake: {
        Row: {
          id: string;
          user_id: string;
          amount_ml: number;
          drink_type: string;
          date: string;
          time: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount_ml: number;
          drink_type?: string;
          date?: string;
          time?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount_ml?: number;
          drink_type?: string;
          date?: string;
          time?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      friends: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: string;
          target_value: number;
          duration_days: number;
          start_date: string;
          end_date: string;
          is_public: boolean;
          created_by: string;
          reward_points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type: string;
          target_value: number;
          duration_days?: number;
          start_date?: string;
          end_date: string;
          is_public?: boolean;
          created_by: string;
          reward_points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          type?: string;
          target_value?: number;
          duration_days?: number;
          start_date?: string;
          end_date?: string;
          is_public?: boolean;
          created_by?: string;
          reward_points?: number;
          created_at?: string;
        };
      };
      challenge_participants: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          joined_at: string;
          current_progress: number;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          joined_at?: string;
          current_progress?: number;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          joined_at?: string;
          current_progress?: number;
          completed_at?: string | null;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          description: string | null;
          icon: string | null;
          points: number;
          unlocked_at: string;
          metadata: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          description?: string | null;
          icon?: string | null;
          points?: number;
          unlocked_at?: string;
          metadata?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          description?: string | null;
          icon?: string | null;
          points?: number;
          unlocked_at?: string;
          metadata?: Record<string, unknown>;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string | null;
          scheduled_for: string;
          is_sent: boolean;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message?: string | null;
          scheduled_for: string;
          is_sent?: boolean;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string | null;
          scheduled_for?: string;
          is_sent?: boolean;
          sent_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

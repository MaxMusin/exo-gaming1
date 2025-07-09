import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      leaderboard: {
        Row: {
          id: string;
          name: string;
          score: number;
          max_combo: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          score: number;
          max_combo?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          score?: number;
          max_combo?: number | null;
          created_at?: string;
        };
      };
    };
  };
}

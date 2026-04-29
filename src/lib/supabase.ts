import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Student = {
  id: string;
  name: string;
  uid: string | null;
  year: number;
  course: string;
  section: string;
  created_at: string;
};

export type Project = {
  id: string;
  project_number: number;
  title: string;
  description: string;
  created_at: string;
};

export type Team = {
  id: string;
  project_id: string;
  team_leader_id: string;
  teammate_id: string | null;
  section: string;
  technologies: string[];
  additional_notes: string | null;
  created_at: string;
  project?: Project;
  team_leader?: Student;
  teammate?: Student;
};

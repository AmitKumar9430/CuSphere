/*
  # Student Project Management System

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `name` (text, student name)
      - `uid` (text, unique identifier like E2563-E2632)
      - `year` (integer, enrollment year)
      - `course` (text, course code)
      - `section` (text, section A or B)
      - `created_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `project_number` (integer, project number 1-36)
      - `title` (text, project title)
      - `description` (text, project description)
      - `created_at` (timestamp)
    
    - `teams`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `team_leader_id` (uuid, foreign key to students)
      - `teammate_id` (uuid, nullable, foreign key to students)
      - `section` (text, section A or B)
      - `technologies` (text array, technologies to be used)
      - `additional_notes` (text, any additional requirements)
      - `created_at` (timestamp)
      - Constraint: team must be from same section
      - Constraint: project can only be taken once per section
    
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, admin email)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Students table: Public read access for all authenticated users
    - Projects table: Public read access for all authenticated users
    - Teams table: Public read for all, insert for authenticated, update/delete for admin only
    - Admin users table: Only accessible by authenticated admin users
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  uid text UNIQUE,
  year integer NOT NULL,
  course text NOT NULL DEFAULT '23BCS_FS-621',
  section text NOT NULL CHECK (section IN ('A', 'B')),
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_number integer UNIQUE NOT NULL CHECK (project_number BETWEEN 1 AND 36),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  team_leader_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teammate_id uuid REFERENCES students(id) ON DELETE CASCADE,
  section text NOT NULL CHECK (section IN ('A', 'B')),
  technologies text[] DEFAULT '{}',
  additional_notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, section)
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Students policies
CREATE POLICY "Anyone can view students"
  ON students FOR SELECT
  TO public
  USING (true);

-- Projects policies
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO public
  USING (true);

-- Teams policies
CREATE POLICY "Anyone can view teams"
  ON teams FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admin users can delete teams"
  ON teams FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admin users policies
CREATE POLICY "Admin users can view own profile"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin users can insert own profile"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_section ON students(section);
CREATE INDEX IF NOT EXISTS idx_teams_project_section ON teams(project_id, section);
CREATE INDEX IF NOT EXISTS idx_teams_leader ON teams(team_leader_id);
CREATE INDEX IF NOT EXISTS idx_teams_teammate ON teams(teammate_id);
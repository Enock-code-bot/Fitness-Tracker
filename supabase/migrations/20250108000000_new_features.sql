/*
  # Fitness Tracker - New Features Schema

  1. New Tables for Enhanced Features
    - `steps` - Daily step tracking with health integration
    - `water_intake` - Hydration tracking with goals
    - `workout_templates` - Predefined exercise templates
    - `workout_categories` - Exercise categorization
    - `friends` - Social connections for challenges
    - `challenges` - Social challenges and competitions
    - `achievements` - User milestones and badges
    - `notifications` - Reminder schedules and preferences

  2. Table Extensions
    - `workouts` - Add category_id, template_id, steps_count
    - `goals` - Add step goals, water goals
    - `profiles` - Add social features, achievements tracking

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create workout categories table
CREATE TABLE IF NOT EXISTS workout_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Create workout templates table
CREATE TABLE IF NOT EXISTS workout_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES workout_categories(id) ON DELETE CASCADE,
  description text,
  exercises jsonb, -- Array of exercises with sets, reps, etc.
  estimated_duration integer, -- minutes
  estimated_calories integer,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_public boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create steps table for pedometer tracking
CREATE TABLE IF NOT EXISTS steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  steps_count integer NOT NULL CHECK (steps_count >= 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  source text DEFAULT 'manual', -- 'manual', 'google_fit', 'apple_health', 'wearable'
  distance_km numeric(5,2), -- optional distance tracking
  calories_burned integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date, source)
);

-- Create water intake table
CREATE TABLE IF NOT EXISTS water_intake (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_ml integer NOT NULL CHECK (amount_ml > 0),
  drink_type text DEFAULT 'water', -- water, coffee, tea, juice, etc.
  date date NOT NULL DEFAULT CURRENT_DATE,
  time time NOT NULL DEFAULT CURRENT_TIME,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create friends table for social features
CREATE TABLE IF NOT EXISTS friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('steps', 'workouts', 'calories', 'water', 'duration')),
  target_value integer NOT NULL,
  duration_days integer NOT NULL DEFAULT 7,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  is_public boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reward_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create challenge participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  current_progress integer DEFAULT 0,
  completed_at timestamptz,
  UNIQUE(challenge_id, user_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- 'steps_milestone', 'workout_streak', 'water_goal', etc.
  title text NOT NULL,
  description text,
  icon text,
  points integer DEFAULT 0,
  unlocked_at timestamptz DEFAULT now(),
  metadata jsonb -- Additional achievement data
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('workout_reminder', 'water_reminder', 'goal_reminder', 'challenge_reminder')),
  title text NOT NULL,
  message text,
  scheduled_for timestamptz NOT NULL,
  is_sent boolean DEFAULT false,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Extend existing workouts table
ALTER TABLE workouts
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES workout_categories(id),
ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES workout_templates(id),
ADD COLUMN IF NOT EXISTS steps_count integer;

-- Extend existing goals table
ALTER TABLE goals
ADD COLUMN IF NOT EXISTS target_steps integer,
ADD COLUMN IF NOT EXISTS target_water_ml integer;

-- Extend existing profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS preferred_units text DEFAULT 'metric' CHECK (preferred_units IN ('metric', 'imperial')),
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"workout_reminders": true, "water_reminders": true, "goal_reminders": true, "challenge_updates": true}';

-- Enable Row Level Security on new tables
ALTER TABLE workout_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_categories (public read, admin create)
CREATE POLICY "Anyone can read workout categories"
  ON workout_categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for workout_templates
CREATE POLICY "Users can read public templates and own templates"
  ON workout_templates FOR SELECT
  TO authenticated
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create templates"
  ON workout_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates"
  ON workout_templates FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- RLS Policies for steps
CREATE POLICY "Users can manage own steps"
  ON steps FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for water_intake
CREATE POLICY "Users can manage own water intake"
  ON water_intake FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for friends
CREATE POLICY "Users can manage own friendships"
  ON friends FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for challenges
CREATE POLICY "Users can read public challenges and own challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create challenges"
  ON challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own challenges"
  ON challenges FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- RLS Policies for challenge_participants
CREATE POLICY "Users can manage own challenge participation"
  ON challenge_participants FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Users can manage own achievements"
  ON achievements FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can manage own notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS steps_user_date_idx ON steps(user_id, date DESC);
CREATE INDEX IF NOT EXISTS water_intake_user_date_idx ON water_intake(user_id, date DESC);
CREATE INDEX IF NOT EXISTS friends_user_status_idx ON friends(user_id, status);
CREATE INDEX IF NOT EXISTS challenges_date_range_idx ON challenges(start_date, end_date);
CREATE INDEX IF NOT EXISTS challenge_participants_challenge_idx ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS notifications_user_scheduled_idx ON notifications(user_id, scheduled_for) WHERE is_sent = false;
CREATE INDEX IF NOT EXISTS achievements_user_type_idx ON achievements(user_id, type);

-- Insert default workout categories
INSERT INTO workout_categories (name, description, icon, color) VALUES
  ('Cardio', 'Heart-pumping exercises like running, cycling, swimming', '🏃', '#FF6B6B'),
  ('Strength', 'Weight training and resistance exercises', '💪', '#4ECDC4'),
  ('Flexibility', 'Yoga, stretching, and mobility exercises', '🧘', '#45B7D1'),
  ('Sports', 'Team sports and recreational activities', '⚽', '#96CEB4'),
  ('HIIT', 'High-intensity interval training', '🔥', '#FFEAA7'),
  ('CrossFit', 'Functional fitness and mixed exercises', '🏋️', '#DDA0DD')
ON CONFLICT (name) DO NOTHING;

-- Insert sample workout templates
INSERT INTO workout_templates (name, category_id, description, exercises, estimated_duration, estimated_calories, difficulty, is_public) VALUES
  ('Morning Cardio Blast', (SELECT id FROM workout_categories WHERE name = 'Cardio'), 'Quick 20-minute cardio session to start your day', '[{"name": "Jumping Jacks", "sets": 3, "reps": 30}, {"name": "High Knees", "sets": 3, "duration": 60}, {"name": "Burpees", "sets": 3, "reps": 10}]', 20, 150, 'beginner', true),
  ('Upper Body Strength', (SELECT id FROM workout_categories WHERE name = 'Strength'), 'Focus on building upper body strength', '[{"name": "Push-ups", "sets": 4, "reps": 12}, {"name": "Dumbbell Rows", "sets": 4, "reps": 10}, {"name": "Shoulder Press", "sets": 4, "reps": 8}]', 45, 200, 'intermediate', true),
  ('Evening Yoga Flow', (SELECT id FROM workout_categories WHERE name = 'Flexibility'), 'Relaxing yoga sequence for better flexibility', '[{"name": "Sun Salutation", "sets": 5}, {"name": "Warrior Pose", "sets": 3, "duration": 30}, {"name": "Childs Pose", "sets": 3, "duration": 60}]', 30, 100, 'beginner', true)
ON CONFLICT DO NOTHING;

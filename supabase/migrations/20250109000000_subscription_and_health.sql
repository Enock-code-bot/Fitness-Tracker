-- Add subscription and health fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription text DEFAULT 'free' CHECK (subscription IN ('free', 'basic', 'pro', 'elite')),
ADD COLUMN IF NOT EXISTS height_cm numeric(5,2), -- height in centimeters
ADD COLUMN IF NOT EXISTS weight_kg numeric(5,2), -- weight in kilograms
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female', 'other'));

-- Insert sample achievements for demo
INSERT INTO achievements (user_id, type, title, description, icon, points) VALUES
  ('00000000-0000-0000-0000-000000000000', 'first_workout', 'First Workout', 'Completed your first workout', '🏃', 10),
  ('00000000-0000-0000-0000-000000000000', 'strength_master', 'Strength Master', 'Completed 10 strength workouts', '💪', 50),
  ('00000000-0000-0000-0000-000000000000', 'goal_achiever', 'Goal Achiever', 'Achieved your first fitness goal', '🏆', 25)
ON CONFLICT DO NOTHING;

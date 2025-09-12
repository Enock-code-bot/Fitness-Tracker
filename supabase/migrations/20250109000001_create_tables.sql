-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  full_name text,
  subscription text DEFAULT 'free' CHECK (subscription IN ('free', 'basic', 'pro', 'elite')),
  height_cm numeric(5,2),
  weight_kg numeric(5,2),
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  total_points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  duration integer NOT NULL, -- in minutes
  calories_burned integer NOT NULL,
  date date NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  target_workouts integer,
  target_calories integer,
  target_duration integer,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create steps table
CREATE TABLE IF NOT EXISTS steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  steps_count integer NOT NULL,
  date date NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, date)
);

-- Create water_intake table
CREATE TABLE IF NOT EXISTS water_intake (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_ml integer NOT NULL, -- in milliliters
  date date NOT NULL,
  time time NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  icon text,
  points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for workouts
CREATE POLICY "Users can view own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON workouts FOR DELETE USING (auth.uid() = user_id);

-- Create policies for goals
CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

-- Create policies for steps
CREATE POLICY "Users can view own steps" ON steps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own steps" ON steps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own steps" ON steps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own steps" ON steps FOR DELETE USING (auth.uid() = user_id);

-- Create policies for water_intake
CREATE POLICY "Users can view own water intake" ON water_intake FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own water intake" ON water_intake FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own water intake" ON water_intake FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own water intake" ON water_intake FOR DELETE USING (auth.uid() = user_id);

-- Create policies for achievements
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own achievements" ON achievements FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample achievements for demo
INSERT INTO achievements (user_id, type, title, description, icon, points) VALUES
  ('00000000-0000-0000-0000-000000000000', 'first_workout', 'First Workout', 'Completed your first workout', '🏃', 10),
  ('00000000-0000-0000-0000-000000000000', 'strength_master', 'Strength Master', 'Completed 10 strength workouts', '💪', 50),
  ('00000000-0000-0000-0000-000000000000', 'goal_achiever', 'Goal Achiever', 'Achieved your first fitness goal', '🏆', 25)
ON CONFLICT DO NOTHING;

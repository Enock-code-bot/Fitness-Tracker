import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { WeeklyChart } from './WeeklyChart';
import { RecentWorkouts } from './RecentWorkouts';
import { GoalProgress } from './GoalProgress';
import WaterTracker from './WaterTracker';
import StepTracker from './StepTracker';
import Leaderboard from './Leaderboard';
import { AIChatbot } from './AIChatbot';
import { PremiumFeature } from '../PremiumFeature';
import { Activity, Target, Clock, Flame } from 'lucide-react';

interface DashboardData {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  weeklyData: Array<{ day: string; workouts: number; calories: number; duration: number }>;
  recentWorkouts: Array<{
    id: string;
    type: string;
    duration: number;
    calories_burned: number;
    date: string;
  }>;
  activeGoals: Array<{
    id: string;
    type: string;
    target_workouts: number;
    target_calories: number;
    target_duration: number;
    progress_workouts: number;
    progress_calories: number;
    progress_duration: number;
  }>;
}

export function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Get current week dates
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

      // Fetch workouts for stats
      const { data: workouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .lte('date', endOfWeek.toISOString().split('T')[0])
        .order('date', { ascending: false });

      // Fetch recent workouts
      const { data: recentWorkouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      // Fetch active goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Calculate weekly data
      const weeklyData = [];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dayWorkouts = workouts?.filter(w => w.date === date.toISOString().split('T')[0]) || [];
        
        weeklyData.push({
          day: days[i],
          workouts: dayWorkouts.length,
          calories: dayWorkouts.reduce((sum, w) => sum + w.calories_burned, 0),
          duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
        });
      }

      // Calculate goal progress
      const activeGoals = goals?.map(goal => {
        const goalWorkouts = workouts?.filter(w => {
          const workoutDate = new Date(w.date);
          const goalStart = new Date(goal.start_date);
          const goalEnd = new Date(goal.end_date);
          return workoutDate >= goalStart && workoutDate <= goalEnd;
        }) || [];

        return {
          ...goal,
          progress_workouts: goalWorkouts.length,
          progress_calories: goalWorkouts.reduce((sum, w) => sum + w.calories_burned, 0),
          progress_duration: goalWorkouts.reduce((sum, w) => sum + w.duration, 0),
        };
      }) || [];

      const dashboardData: DashboardData = {
        totalWorkouts: workouts?.length || 0,
        totalDuration: workouts?.reduce((sum, w) => sum + w.duration, 0) || 0,
        totalCalories: workouts?.reduce((sum, w) => sum + w.calories_burned, 0) || 0,
        weeklyData,
        recentWorkouts: recentWorkouts || [],
        activeGoals,
      };

      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-slate-500">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Track your fitness progress and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="This Week"
          value={data.totalWorkouts}
          unit="workouts"
          icon={Activity}
          color="blue"
        />
        <StatsCard
          title="Duration"
          value={data.totalDuration}
          unit="minutes"
          icon={Clock}
          color="green"
        />
        <StatsCard
          title="Calories"
          value={data.totalCalories}
          unit="burned"
          icon={Flame}
          color="orange"
        />
        <StatsCard
          title="Goals"
          value={data.activeGoals.length}
          unit="active"
          icon={Target}
          color="purple"
        />
      </div>

      {/* New Trackers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WaterTracker />
        <StepTracker />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Chart - Basic Premium Feature */}
        <PremiumFeature requiredTier="basic" featureName="Advanced Analytics">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Weekly Overview</h2>
            <WeeklyChart data={data.weeklyData} />
          </div>
        </PremiumFeature>

        {/* Goal Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Goal Progress</h2>
          <GoalProgress goals={data.activeGoals} />
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Workouts</h2>
        <RecentWorkouts workouts={data.recentWorkouts} />
      </div>

      {/* Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Leaderboard />
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3" role="group" aria-label="Quick fitness actions">
            <button
              className="w-full bg-slate-600 text-white py-3 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors"
              aria-label="Log a new workout session"
              type="button"
            >
              Log New Workout
            </button>
            <button
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 transition-colors"
              aria-label="Set a new fitness goal"
              type="button"
            >
              Set New Goal
            </button>
            <button
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 transition-colors"
              aria-label="Browse workout templates"
              type="button"
            >
              View Templates
            </button>
          </div>
        </div>
      </div>

      {/* AI Chatbot - Elite Premium Feature */}
      <PremiumFeature requiredTier="elite" featureName="AI Fitness Coach">
        <div>
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="fixed bottom-8 right-8 bg-slate-600 text-white rounded-full p-4 shadow-lg hover:bg-slate-700 transition-colors"
            aria-label="Toggle AI Chatbot"
          >
            Chat
          </button>
          {showChatbot && <AIChatbot isOpen={showChatbot} onToggle={() => setShowChatbot(false)} userName={user?.user_metadata?.full_name} />}
        </div>
      </PremiumFeature>
    </div>
  );
}

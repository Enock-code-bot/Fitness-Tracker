import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  total_workouts: number;
  total_calories: number;
  total_steps: number;
  total_water_ml: number;
  points: number;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);

    try {
      // Calculate date range based on timeframe
      const now = new Date();
      let startDate: string;

      switch (timeframe) {
        case 'week': {
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          startDate = weekStart.toISOString().split('T')[0];
          break;
        }
        case 'month': {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          startDate = monthStart.toISOString().split('T')[0];
          break;
        }
        default:
          startDate = '2020-01-01'; // Far in the past for "all time"
      }

      // Fetch user profiles with their stats
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, total_points')
        .order('total_points', { ascending: false })
        .limit(20);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // For each profile, calculate their stats for the timeframe
      const leaderboardData = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get workout stats
          const { data: workouts } = await supabase
            .from('workouts')
            .select('calories_burned')
            .eq('user_id', profile.id)
            .gte('date', startDate);

          // Get step stats
          const { data: steps } = await supabase
            .from('steps')
            .select('steps_count')
            .eq('user_id', profile.id)
            .gte('date', startDate);

          // Get water intake stats
          const { data: water } = await supabase
            .from('water_intake')
            .select('amount_ml')
            .eq('user_id', profile.id)
            .gte('date', startDate);

          const totalWorkouts = workouts?.length || 0;
          const totalCalories = workouts?.reduce((sum, w) => sum + w.calories_burned, 0) || 0;
          const totalSteps = steps?.reduce((sum, s) => sum + s.steps_count, 0) || 0;
          const totalWater = water?.reduce((sum, w) => sum + w.amount_ml, 0) || 0;

          // Calculate points (simple scoring system)
          const points = (totalWorkouts * 10) + (totalCalories * 0.1) + (totalSteps * 0.01) + (totalWater * 0.05);

          return {
            user_id: profile.id,
            full_name: profile.full_name || 'Anonymous',
            total_workouts: totalWorkouts,
            total_calories: totalCalories,
            total_steps: totalSteps,
            total_water_ml: totalWater,
            points: Math.round(points),
          };
        })
      );

      // Sort by points and take top 10
      const sortedLeaderboard = leaderboardData
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);

      setLeaderboard(sortedLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getRankStyle = (index: number) => {
    if (index < 3) {
      return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
    }
    return 'bg-white border-gray-200';
  };

  const currentUserRank = leaderboard.findIndex(entry => entry.user_id === user?.id) + 1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">🏆 Leaderboard</h3>

        {/* Timeframe Selector */}
        <div className="flex bg-gray-100 rounded-md p-1" role="tablist" aria-label="Leaderboard timeframe selection">
          {(['week', 'month', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 ${
                timeframe === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              role="tab"
              aria-selected={timeframe === period}
              aria-controls={`leaderboard-${period}`}
              type="button"
            >
              {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Current User Highlight */}
          {user && currentUserRank > 0 && currentUserRank <= 10 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  Your current rank: <strong>#{currentUserRank}</strong>
                </span>
                <span className="text-sm text-blue-600">
                  {leaderboard[currentUserRank - 1]?.points || 0} points
                </span>
              </div>
            </div>
          )}

          {/* Leaderboard List */}
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.user_id}
                className={`flex items-center justify-between p-4 border rounded-md transition-colors ${
                  getRankStyle(index)
                } ${entry.user_id === user?.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {entry.full_name}
                      {entry.user_id === user?.id && (
                        <span className="ml-2 text-xs text-blue-600">(You)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.total_workouts} workouts • {entry.total_steps.toLocaleString()} steps
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    {entry.points.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">points</div>
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🏆</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No data yet</h4>
              <p className="text-gray-600">
                Start logging workouts and activities to see the leaderboard!
              </p>
            </div>
          )}
        </>
      )}

      {/* Scoring Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">How points are calculated:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• 10 points per workout</div>
          <div>• 0.1 points per calorie burned</div>
          <div>• 0.01 points per step</div>
          <div>• 0.05 points per ml of water</div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface StepData {
  id: string;
  steps_count: number;
  date: string;
  source: string;
  distance_km?: number;
  calories_burned?: number;
}

const StepTracker: React.FC = () => {
  const { user } = useAuth();
  const [stepData, setStepData] = useState<StepData | null>(null);
  const [dailyGoal] = useState(10000); // 10,000 steps default
  const [manualSteps, setManualSteps] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTodaySteps();
    }
  }, [user]);

  const fetchTodaySteps = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('steps')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching steps:', error);
    } else {
      setStepData(data);
    }
  };

  const addManualSteps = async () => {
    if (!user || manualSteps <= 0) return;

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    const stepEntry = {
      user_id: user.id,
      steps_count: manualSteps,
      date: today,
      source: 'manual',
      distance_km: (manualSteps * 0.0008), // Rough estimate: 1 step ≈ 0.8 meters
      calories_burned: Math.round(manualSteps * 0.04), // Rough estimate: 0.04 calories per step
    };

    const { error } = await supabase
      .from('steps')
      .upsert(stepEntry, { onConflict: 'user_id,date' });

    if (error) {
      console.error('Error adding steps:', error);
    } else {
      await fetchTodaySteps();
      setManualSteps(0);
    }
    setLoading(false);
  };

  const getCurrentSteps = () => {
    return stepData?.steps_count || 0;
  };

  const getProgressPercentage = () => {
    return Math.min((getCurrentSteps() / dailyGoal) * 100, 100);
  };

  const getDistanceKm = () => {
    return stepData?.distance_km || 0;
  };

  const getCaloriesBurned = () => {
    return stepData?.calories_burned || 0;
  };

  const quickAddSteps = [1000, 2000, 5000];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🚶 Step Counter</h3>

      {/* Current Steps Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-green-600">{getCurrentSteps().toLocaleString()}</div>
        <div className="text-sm text-gray-600">steps today</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Daily Goal</span>
          <span>{getCurrentSteps()} / {dailyGoal.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{getDistanceKm().toFixed(1)}km</div>
          <div className="text-xs text-gray-600">Distance</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-orange-600">{getCaloriesBurned()}</div>
          <div className="text-xs text-gray-600">Calories</div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick Add:</p>
        <div className="flex gap-2 mb-3" role="group" aria-label="Quick step amount selection">
          {quickAddSteps.map((steps) => (
            <button
              key={steps}
              onClick={() => setManualSteps(steps)}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 transition-colors text-sm"
              aria-label={`Add ${steps.toLocaleString()} steps`}
              type="button"
            >
              +{steps.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="number"
            value={manualSteps}
            onChange={(e) => setManualSteps(Number(e.target.value))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter steps"
            min="1"
          />
          <button
            onClick={addManualSteps}
            disabled={loading || manualSteps <= 0}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      {/* Health Integration Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-center">
          <div className="text-blue-600 text-sm">
            <strong>💡 Tip:</strong> For automatic step tracking, connect your health app (Google Fit, Apple Health) in settings.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepTracker;

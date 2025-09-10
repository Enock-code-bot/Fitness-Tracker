import React from 'react';
import { Target, Clock, Flame } from 'lucide-react';

interface Goal {
  id: string;
  type: string;
  target_workouts: number;
  target_calories: number;
  target_duration: number;
  progress_workouts: number;
  progress_calories: number;
  progress_duration: number;
}

interface GoalProgressProps {
  goals: Goal[];
}

export function GoalProgress({ goals }: GoalProgressProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No active goals</p>
        <p className="text-sm mt-1">Set some goals to track your progress!</p>
      </div>
    );
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium capitalize">{goal.type} Goal</h3>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          
          <div className="space-y-3">
            {/* Workouts Progress */}
            <div className="flex items-center space-x-3">
              <Target className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Workouts</span>
                  <span>{goal.progress_workouts}/{goal.target_workouts}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${calculateProgress(goal.progress_workouts, goal.target_workouts)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Duration Progress */}
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Duration</span>
                  <span>{goal.progress_duration}/{goal.target_duration} min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${calculateProgress(goal.progress_duration, goal.target_duration)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Calories Progress */}
            <div className="flex items-center space-x-3">
              <Flame className="h-4 w-4 text-orange-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Calories</span>
                  <span>{goal.progress_calories}/{goal.target_calories}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all"
                    style={{ width: `${calculateProgress(goal.progress_calories, goal.target_calories)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
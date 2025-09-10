import React from 'react';
import { Calendar, Clock, Flame } from 'lucide-react';

interface Workout {
  id: string;
  type: string;
  duration: number;
  calories_burned: number;
  date: string;
}

interface RecentWorkoutsProps {
  workouts: Workout[];
}

export function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  if (workouts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No recent workouts</p>
        <p className="text-sm mt-1">Start logging your workouts to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workouts.map((workout) => (
        <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{workout.type}</h4>
              <p className="text-sm text-gray-600">
                {new Date(workout.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{workout.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="h-4 w-4" />
              <span>{workout.calories_burned} cal</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
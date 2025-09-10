import React from 'react';
import { Edit2, Trash2, Target, Clock, Flame, Calendar, Play, Pause } from 'lucide-react';
import { Goal } from './GoalManager';

interface GoalListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onToggle: (goalId: string, isActive: boolean) => void;
}

export function GoalList({ goals, onEdit, onDelete, onToggle }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set</h3>
        <p className="text-gray-600">Create your first fitness goal to start tracking your progress!</p>
      </div>
    );
  }

  const isGoalExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getGoalStatus = (goal: Goal) => {
    if (!goal.is_active) return 'Paused';
    if (isGoalExpired(goal.end_date)) return 'Expired';
    return 'Active';
  };

  const getStatusColor = (goal: Goal) => {
    const status = getGoalStatus(goal);
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="divide-y divide-gray-200">
        {goals.map((goal) => (
          <div key={goal.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-medium text-gray-900 capitalize">
                    {goal.type} Goal
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal)}`}>
                    {getGoalStatus(goal)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="h-4 w-4 mr-2 text-blue-600" />
                    {goal.target_workouts} workouts
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    {goal.target_duration} minutes
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Flame className="h-4 w-4 mr-2 text-orange-600" />
                    {goal.target_calories} calories
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(goal.start_date).toLocaleDateString()} - {new Date(goal.end_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onToggle(goal.id, goal.is_active)}
                  className={`p-2 rounded-lg transition-colors ${
                    goal.is_active 
                      ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                      : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                  title={goal.is_active ? 'Pause goal' : 'Resume goal'}
                >
                  {goal.is_active ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => onEdit(goal)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit goal"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(goal.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete goal"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
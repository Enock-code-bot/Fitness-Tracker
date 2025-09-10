import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Goal } from './GoalManager';

interface GoalFormProps {
  goal?: Goal | null;
  onSave: (goal: Omit<Goal, 'id'>) => Promise<void>;
  onClose: () => void;
}

export function GoalForm({ goal, onSave, onClose }: GoalFormProps) {
  const [formData, setFormData] = useState({
    type: 'weekly',
    target_workouts: '',
    target_calories: '',
    target_duration: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setFormData({
        type: goal.type,
        target_workouts: goal.target_workouts.toString(),
        target_calories: goal.target_calories.toString(),
        target_duration: goal.target_duration.toString(),
        start_date: goal.start_date,
        end_date: goal.end_date,
        is_active: goal.is_active,
      });
    } else {
      // Set default end date based on type
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7); // Default to 1 week
      
      setFormData(prev => ({
        ...prev,
        end_date: endDate.toISOString().split('T')[0],
      }));
    }
  }, [goal]);

  useEffect(() => {
    // Update end date when type changes
    if (!goal) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(startDate);
      
      if (formData.type === 'daily') {
        endDate.setDate(startDate.getDate() + 1);
      } else {
        endDate.setDate(startDate.getDate() + 7);
      }
      
      setFormData(prev => ({
        ...prev,
        end_date: endDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.type, formData.start_date, goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        type: formData.type,
        target_workouts: parseInt(formData.target_workouts),
        target_calories: parseInt(formData.target_calories),
        target_duration: parseInt(formData.target_duration),
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label htmlFor="target_workouts" className="block text-sm font-medium text-gray-700 mb-1">
              Target Workouts
            </label>
            <input
              type="number"
              id="target_workouts"
              name="target_workouts"
              value={formData.target_workouts}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="target_duration" className="block text-sm font-medium text-gray-700 mb-1">
              Target Duration (minutes)
            </label>
            <input
              type="number"
              id="target_duration"
              name="target_duration"
              value={formData.target_duration}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="target_calories" className="block text-sm font-medium text-gray-700 mb-1">
              Target Calories
            </label>
            <input
              type="number"
              id="target_calories"
              name="target_calories"
              value={formData.target_calories}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              min={formData.start_date}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Active goal
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : (goal ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
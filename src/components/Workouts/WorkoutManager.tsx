import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { WorkoutForm } from './WorkoutForm';
import { WorkoutList } from './WorkoutList';
import { Plus } from 'lucide-react';

export interface Workout {
  id: string;
  type: string;
  duration: number;
  calories_burned: number;
  date: string;
  notes: string;
}

export function WorkoutManager() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const fetchWorkouts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkout = async (workoutData: Omit<Workout, 'id'>) => {
    if (!user) return;

    try {
      if (editingWorkout) {
        // Update existing workout
        const { error } = await supabase
          .from('workouts')
          .update(workoutData)
          .eq('id', editingWorkout.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new workout
        const { error } = await supabase
          .from('workouts')
          .insert([{ ...workoutData, user_id: user.id }]);

        if (error) throw error;
      }

      await fetchWorkouts();
      setShowForm(false);
      setEditingWorkout(null);
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setShowForm(true);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!user || !confirm('Are you sure you want to delete this workout?')) return;

    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingWorkout(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Workouts</h1>
          <p className="text-slate-600 mt-1">Log and manage your fitness activities</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Workout
        </button>
      </div>

      {showForm && (
        <WorkoutForm
          workout={editingWorkout}
          onSave={handleSaveWorkout}
          onClose={handleCloseForm}
        />
      )}

      <WorkoutList
        workouts={workouts}
        onEdit={handleEditWorkout}
        onDelete={handleDeleteWorkout}
      />
    </div>
  );
}
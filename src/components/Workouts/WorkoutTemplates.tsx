import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface WorkoutTemplate {
  id: string;
  name: string;
  category_id: string;
  description?: string;
  exercises: Array<{
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
    weight?: number;
  }>;
  estimated_duration?: number;
  estimated_calories?: number;
  difficulty?: string;
  is_public: boolean;
}

interface WorkoutCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

const WorkoutTemplates: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [categories, setCategories] = useState<WorkoutCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTemplates();
  }, [user]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('workout_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchTemplates = async () => {
    if (!user) return;

    let query = supabase
      .from('workout_templates')
      .select(`
        *,
        workout_categories (
          name,
          icon,
          color
        )
      `)
      .or(`created_by.eq.${user.id},is_public.eq.true`)
      .order('name');

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data || []);
    }
  };

  const startWorkoutFromTemplate = async (template: WorkoutTemplate) => {
    if (!user) return;

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    // Create workout entries for each exercise in the template
    const workoutPromises = template.exercises.map(async (exercise) => {
      return supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          type: exercise.name,
          duration: exercise.duration || template.estimated_duration || 30,
          calories_burned: Math.round((template.estimated_calories || 200) / template.exercises.length),
          date: today,
          notes: `From template: ${template.name}`,
          category_id: template.category_id,
          template_id: template.id,
        });
    });

    try {
      await Promise.all(workoutPromises);
      alert('Workout started successfully! You can now log your actual performance.');
    } catch (error) {
      console.error('Error starting workout:', error);
      alert('Failed to start workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Workout Templates</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
          Create Template
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                )}
              </div>
              {template.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                  {template.difficulty}
                </span>
              )}
            </div>

            {/* Template Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Exercises:</span>
                <span className="font-medium">{template.exercises.length}</span>
              </div>
              {template.estimated_duration && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{template.estimated_duration} min</span>
                </div>
              )}
              {template.estimated_calories && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Calories:</span>
                  <span className="font-medium">{template.estimated_calories}</span>
                </div>
              )}
            </div>

            {/* Exercise Preview */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {template.exercises.slice(0, 3).map((exercise, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    • {exercise.name}
                    {exercise.sets && exercise.reps && ` (${exercise.sets}×${exercise.reps})`}
                    {exercise.duration && ` (${exercise.duration}min)`}
                  </div>
                ))}
                {template.exercises.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{template.exercises.length - 3} more exercises
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => startWorkoutFromTemplate(template)}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Starting...' : 'Start Workout'}
            </button>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">
            {selectedCategory === 'all'
              ? 'Create your first workout template to get started.'
              : 'No templates found in this category.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTemplates;

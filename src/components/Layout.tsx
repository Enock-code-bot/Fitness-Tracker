import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Activity, User, Target, BarChart3, Droplets, Footprints, Trophy, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'workouts' | 'goals' | 'water' | 'steps' | 'templates' | 'leaderboard' | 'pricing';
  onTabChange: (tab: 'dashboard' | 'workouts' | 'goals' | 'water' | 'steps' | 'templates' | 'leaderboard' | 'pricing') => void;
}

interface HealthData {
  height_cm?: number;
  weight_kg?: number;
  date_of_birth?: string;
  gender?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { signOut, user } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    if (user) {
      fetchHealthData();
      fetchAchievements();
    }
  }, [user]);

  const fetchHealthData = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('height_cm, weight_kg, date_of_birth, gender')
      .eq('id', user.id)
      .single();
    if (error) {
      console.error('Error fetching health data:', error);
    } else {
      setHealthData(data);
    }
  };

  const fetchAchievements = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('achievements')
      .select('id, title, description, icon')
      .eq('user_id', user.id);
    if (error) {
      console.error('Error fetching achievements:', error);
      // Fallback to sample achievements
      setAchievements([
        { id: '1', title: 'First Workout', description: 'Completed your first workout', icon: '🏃' },
        { id: '2', title: 'Strength Master', description: 'Completed 10 strength workouts', icon: '💪' },
        { id: '3', title: 'Goal Achiever', description: 'Achieved your first fitness goal', icon: '🏆' }
      ]);
    } else {
      setAchievements(data || []);
    }
  };

  const calculateBMI = () => {
    if (healthData?.height_cm && healthData?.weight_kg) {
      const heightM = healthData.height_cm / 100;
      return (healthData.weight_kg / (heightM * heightM)).toFixed(1);
    }
    return 'Not calculated';
  };

  const getFitnessLevel = () => {
    // Simple logic based on achievements or workouts
    if (achievements.length > 2) return 'Advanced';
    if (achievements.length > 0) return 'Intermediate';
    return 'Beginner';
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'workouts', label: 'Workouts', icon: Activity },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'pricing', label: 'Pricing', icon: Trophy },
  ] as const;

  return (
<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-slate-700 mr-2" />
              <h1 className="text-xl font-semibold text-slate-900">FitTracker</h1>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
                aria-haspopup="true"
                aria-expanded={profileDropdownOpen}
              >
                <User className="h-6 w-6 text-slate-700" />
                <span>{user?.user_metadata?.full_name || 'User'}</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 p-4">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
                      <p className="text-sm text-slate-600">{user?.email}</p>
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-slate-900">Health Assessments</h3>
                      <ul className="text-sm text-slate-700 list-disc list-inside">
                        <li>BMI: {calculateBMI()}</li>
                        <li>Body Fat %: Not measured</li>
                        <li>Fitness Level: {getFitnessLevel()}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-slate-900">Badges</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {achievements.length > 0 ? achievements.slice(0, 3).map((achievement) => (
                          <div key={achievement.id} className="flex items-center p-2 bg-yellow-50 rounded" title={achievement.description}>
                            <span className="text-xl mr-2">{achievement.icon}</span> {achievement.title}
                          </div>
                        )) : (
                          <>
                            <div className="flex items-center p-2 bg-yellow-50 rounded">
                              <span className="text-xl mr-2">🏃</span> First Workout
                            </div>
                            <div className="flex items-center p-2 bg-slate-50 rounded">
                              <span className="text-xl mr-2">💪</span> Strength Master
                            </div>
                            <div className="flex items-center p-2 bg-slate-50 rounded">
                              <span className="text-xl mr-2">🏆</span> Goal Achiever
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => onTabChange(id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === id
                          ? 'bg-slate-100 text-slate-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      aria-current={activeTab === id ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5 mr-3 text-slate-700" />
                      {label}
                    </button>
                  </li>
                ))}
                {/* Additional tabs for new sections */}
                <li>
                  <button
                    onClick={() => onTabChange('water')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'water'
                        ? 'bg-slate-100 text-slate-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    aria-current={activeTab === 'water' ? 'page' : undefined}
                  >
                    <Droplets className="h-5 w-5 mr-3 text-slate-700" />
                    Water Intake
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onTabChange('steps')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'steps'
                        ? 'bg-slate-100 text-slate-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    aria-current={activeTab === 'steps' ? 'page' : undefined}
                  >
                    <Footprints className="h-5 w-5 mr-3 text-slate-700" />
                    Step Counter
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onTabChange('templates')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'templates'
                        ? 'bg-slate-100 text-slate-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    aria-current={activeTab === 'templates' ? 'page' : undefined}
                  >
                    <FileText className="h-5 w-5 mr-3 text-slate-700" />
                    Workout Templates
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onTabChange('leaderboard')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'leaderboard'
                        ? 'bg-slate-100 text-slate-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    aria-current={activeTab === 'leaderboard' ? 'page' : undefined}
                  >
                    <Trophy className="h-5 w-5 mr-3 text-slate-700" />
                    Leaderboard
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

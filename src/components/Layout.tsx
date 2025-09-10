import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, LogOut, User, Target, BarChart3, Droplets, Footprints, Trophy, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'workouts' | 'goals' | 'profile' | 'water' | 'steps' | 'templates' | 'leaderboard';
  onTabChange: (tab: 'dashboard' | 'workouts' | 'goals' | 'profile' | 'water' | 'steps' | 'templates' | 'leaderboard') => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'workouts', label: 'Workouts', icon: Activity },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">FitTracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.full_name || 'User'}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
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
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      aria-current={activeTab === id ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5 mr-3" />
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
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    aria-current={activeTab === 'water' ? 'page' : undefined}
                  >
                    <Droplets className="h-5 w-5 mr-3" />
                    Water Intake
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onTabChange('steps')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'steps'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    aria-current={activeTab === 'steps' ? 'page' : undefined}
                  >
                    <Footprints className="h-5 w-5 mr-3" />
                    Step Counter
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onTabChange('templates')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'templates'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    aria-current={activeTab === 'templates' ? 'page' : undefined}
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    Workout Templates
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onTabChange('leaderboard')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'leaderboard'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    aria-current={activeTab === 'leaderboard' ? 'page' : undefined}
                  >
                    <Trophy className="h-5 w-5 mr-3" />
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
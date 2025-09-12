import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { WorkoutManager } from './components/Workouts/WorkoutManager';
import { GoalManager } from './components/Goals/GoalManager';
import WaterTracker from './components/Dashboard/WaterTracker';
import StepTracker from './components/Dashboard/StepTracker';
import WorkoutTemplates from './components/Workouts/WorkoutTemplates';
import Leaderboard from './components/Dashboard/Leaderboard';
import { AIChatbot } from './components/Dashboard/AIChatbot';
import { Pricing } from './components/Pricing';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workouts' | 'goals' | 'water' | 'steps' | 'templates' | 'leaderboard' | 'pricing'>('dashboard');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'workouts':
        return <WorkoutManager />;
      case 'goals':
        return <GoalManager />;
      case 'water':
        return <WaterTracker />;
      case 'steps':
        return <StepTracker />;
      case 'templates':
        return <WorkoutTemplates />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'pricing':
        return <Pricing />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
      {user && (
        <AIChatbot
          isOpen={isChatbotOpen}
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
          userName={user.user_metadata?.full_name}
        />
      )}
      {user && !isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Open AI Chatbot"
        >
          💬
        </button>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PremiumFeatureProps {
  requiredTier?: 'basic' | 'pro' | 'elite';
  featureName: string;
  children: React.ReactNode;
  showUpgrade?: boolean;
}

export function PremiumFeature({
  requiredTier = 'basic',
  featureName,
  children,
  showUpgrade = true
}: PremiumFeatureProps) {
  const { subscription } = useAuth();

  const tierLevels = { free: 0, basic: 1, pro: 2, elite: 3 };
  const currentLevel = tierLevels[subscription as keyof typeof tierLevels] || 0;
  const requiredLevel = tierLevels[requiredTier];

  const hasAccess = currentLevel >= requiredLevel;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center z-10">
        <div className="bg-white rounded-lg p-6 text-center max-w-sm mx-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Lock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Premium Feature
          </h3>
          <p className="text-gray-600 mb-4">
            Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Premium to access {featureName}.
          </p>
          <button
            onClick={() => {
              // Navigate to pricing tab
              window.location.hash = '#pricing';
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </button>
        </div>
      </div>
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
    </div>
  );
}

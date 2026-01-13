import React from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { getFeatureDisplayName, getMinimumTierForFeature, getTierDisplayName } from '../../config/featureConfig';
import type { FeatureKey } from '../../config/featureConfig';

interface UpgradePromptProps {
  feature: FeatureKey;
  className?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature, className = '' }) => {
  const { subscriptionPlan } = useTenant();
  
  const featureName = getFeatureDisplayName(feature);
  const requiredTier = getMinimumTierForFeature(feature);
  const requiredTierDisplay = getTierDisplayName(requiredTier);
  const currentTierDisplay = subscriptionPlan ? getTierDisplayName(subscriptionPlan) : 'No Plan';

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <svg 
            className="w-12 h-12 text-blue-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {featureName} - Premium Feature
          </h3>
          
          <p className="text-gray-600 mb-4">
            This feature is available on the <span className="font-semibold text-blue-700">{requiredTierDisplay}</span> plan and above.
          </p>
          
          <div className="bg-white rounded-md p-4 mb-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Plan:</span>
              <span className="font-semibold text-gray-900">{currentTierDisplay}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Required Plan:</span>
              <span className="font-semibold text-blue-700">{requiredTierDisplay}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/admin/settings?tab=subscription'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Upgrade Now
            </button>
            
            <button
              onClick={() => window.location.href = '/pricing'}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2 rounded-lg border border-gray-300 transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

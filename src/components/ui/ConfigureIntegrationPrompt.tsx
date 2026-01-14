import React from 'react';
import { INTEGRATION_DEPENDENCIES } from '../../config/featureConfig';
import type { IntegrationKey } from '../../config/featureConfig';

interface ConfigureIntegrationPromptProps {
  integration: IntegrationKey;
  className?: string;
}

export const ConfigureIntegrationPrompt: React.FC<ConfigureIntegrationPromptProps> = ({ 
  integration, 
  className = '' 
}) => {
  const integrationConfig = INTEGRATION_DEPENDENCIES[integration];
  
  if (!integrationConfig) {
    return null;
  }

  return (
    <div className={`bg-amber-50 border-2 border-amber-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <svg 
            className="w-12 h-12 text-amber-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Integration Required: {integrationConfig.service}
          </h3>
          
          <p className="text-gray-600 mb-4">
            This feature requires <span className="font-semibold">{integrationConfig.service}</span> to be configured.
          </p>
          
          <div className="bg-white rounded-md p-4 mb-4 border border-amber-100">
            <div className="space-y-2">
              <div className="flex items-start">
                <svg 
                  className="w-5 h-5 text-amber-600 mt-0.5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Purpose</p>
                  <p className="text-sm text-gray-600">{integrationConfig.purpose}</p>
                </div>
              </div>
              
              {integrationConfig.cost_type && integrationConfig.cost_type !== 'included' && (
                <div className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-amber-600 mt-0.5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pricing</p>
                    <p className="text-sm text-gray-600">
                      {integrationConfig.cost_type === 'addon' && integrationConfig.addon_price 
                        ? `$${integrationConfig.addon_price}/month add-on`
                        : integrationConfig.cost_type === 'per_transaction'
                        ? 'Per-transaction pricing'
                        : 'Contact for pricing'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/dashboard/settings?tab=integrations'}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Configure Integration
            </button>
            
            <button
              onClick={() => window.open('/docs/integrations', '_blank')}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2 rounded-lg border border-gray-300 transition-colors"
            >
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

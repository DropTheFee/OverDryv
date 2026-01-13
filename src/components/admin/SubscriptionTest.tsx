import React from 'react';
import { useTenant, useFeature } from '../contexts/TenantContext';
import { FeatureGate, UpgradePrompt, ConfigureIntegrationPrompt } from '../components/ui';

/**
 * Test component for subscription infrastructure
 * To test: Add <SubscriptionTest /> to AdminDashboard temporarily
 */
export const SubscriptionTest: React.FC = () => {
  const { 
    organizationName, 
    subscriptionPlan, 
    subscriptionStatus,
    hasFeature,
    hasIntegration,
    userLimit,
    currentUserCount,
    isFounder
  } = useTenant();

  const hasPhotos = useFeature('photo_uploads');
  const hasTimeKeeping = useFeature('time_keeping');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Subscription Infrastructure Test</h2>
        
        {/* Organization Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Organization</p>
            <p className="font-semibold">{organizationName || 'Not Set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Plan</p>
            <p className="font-semibold capitalize">{subscriptionPlan || 'None'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold capitalize">{subscriptionStatus || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Users</p>
            <p className="font-semibold">{currentUserCount} / {userLimit || '∞'}</p>
          </div>
          {isFounder && (
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Special Status</p>
              <p className="font-semibold text-purple-600">⭐ Founder Member</p>
            </div>
          )}
        </div>

        {/* Feature Checks */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Feature Tests</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${hasFeature('vehicle_history') ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Vehicle History (All Tiers)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${hasPhotos ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Photo Uploads (Professional+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${hasTimeKeeping ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Time Keeping (Professional+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${hasFeature('multi_location_support') ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Multi-Location (Growth+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${hasFeature('white_label') ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>White Label (Enterprise+)</span>
            </div>
          </div>
        </div>

        {/* Integration Checks */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-2">Integration Tests</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${hasIntegration('sendgrid') ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span>SendGrid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${hasIntegration('aws_s3') ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span>AWS S3</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${hasIntegration('quickbooks_async') ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span>QuickBooks Async</span>
            </div>
          </div>
        </div>
      </div>

      {/* FeatureGate Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">UI Component Tests</h3>
        
        {/* Test 1: Photo Uploads */}
        <FeatureGate feature="photo_uploads">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            ✅ Photo upload feature is available!
          </div>
        </FeatureGate>

        {/* Test 2: Multi-Location (most likely locked) */}
        <FeatureGate feature="multi_location_support">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            ✅ Multi-location feature is available!
          </div>
        </FeatureGate>

        {/* Test 3: Manual Upgrade Prompt */}
        <div>
          <h4 className="font-semibold mb-2">Manual Upgrade Prompt Test</h4>
          <UpgradePrompt feature="custom_branding" />
        </div>

        {/* Test 4: Integration Prompt */}
        <div>
          <h4 className="font-semibold mb-2">Integration Prompt Test</h4>
          <ConfigureIntegrationPrompt integration="aws_s3" />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useFeature } from '../../contexts/TenantContext';
import { UpgradePrompt } from './UpgradePrompt';
import type { FeatureKey } from '../../config/featureConfig';

interface FeatureGateProps {
  feature: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

/**
 * Conditionally render children based on feature availability
 * 
 * @example
 * <FeatureGate feature="photo_uploads">
 *   <PhotoUploadSection />
 * </FeatureGate>
 * 
 * @example
 * <FeatureGate 
 *   feature="advanced_reporting" 
 *   fallback={<p>Upgrade to access advanced reports</p>}
 * >
 *   <AdvancedReports />
 * </FeatureGate>
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({ 
  feature, 
  children, 
  fallback,
  showUpgradePrompt = true 
}) => {
  const hasFeature = useFeature(feature);

  if (hasFeature) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    return <UpgradePrompt feature={feature} />;
  }

  return null;
};

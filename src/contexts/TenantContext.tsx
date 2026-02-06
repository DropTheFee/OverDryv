import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { getSubdomain } from '../utils/domainHelper';
import type { FeatureKey, IntegrationKey, SubscriptionPlan, SubscriptionStatus } from '../config/featureConfig';
import type { Database } from '../types/database';

// =====================================================
// TYPES
// =====================================================

type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationFeature = Database['public']['Tables']['organization_features']['Row'];
type OrganizationIntegration = Database['public']['Tables']['organization_integrations']['Row'];

interface TenantConfig {
  organization: Organization | null;
  features: Record<FeatureKey, OrganizationFeature | undefined>;
  integrations: Record<IntegrationKey, OrganizationIntegration | undefined>;
}

interface TenantContextType {
  tenant: TenantConfig | null;
  loading: boolean;
  
  // Organization info (available even before auth for login page branding)
  organization: Organization | null;
  organizationId: string | null;
  organizationName: string | null;
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionStatus: SubscriptionStatus | null;
  isFounder: boolean;
  
  // Feature checking
  hasFeature: (feature: FeatureKey) => boolean;
  getFeatureConfig: (feature: FeatureKey) => Record<string, any>;
  
  // Integration checking
  hasIntegration: (integration: IntegrationKey) => boolean;
  getIntegrationStatus: (integration: IntegrationKey) => 'active' | 'error' | 'disabled' | 'testing' | null;
  
  // Add-on checking
  hasQuickBooksAsync: boolean;
  hasPartsTech: boolean;
  hasDigitsAI: 'basic' | 'professional' | 'enterprise' | null;
  hasHonkampPayroll: boolean;
  
  // Limits
  userLimit: number | null;
  currentUserCount: number;
  
  // Actions
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// =====================================================
// PROVIDER
// =====================================================

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading: authLoading } = useAuth();
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Load tenant configuration
  const loadTenantConfig = async () => {
    try {
      // First, try to get organization from subdomain (for login page branding)
      const subdomain = getSubdomain();
      let organization: Organization | null = null;
      
      if (subdomain) {
        // Load organization by subdomain (public access for login page)
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('subdomain', subdomain)
          .single();

        if (!orgError && orgData) {
          organization = orgData;
        }
      }
      
      // If user is authenticated, prefer their profile's organization
      if (profile?.organization_id) {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.organization_id)
          .single();

        if (!orgError && orgData) {
          organization = orgData;
        }
      }

      if (!organization) {
        setTenant({
          organization: null,
          features: {} as Record<FeatureKey, OrganizationFeature | undefined>,
          integrations: {} as Record<IntegrationKey, OrganizationIntegration | undefined>
        });
        setLoading(false);
        return;
      }

      // Load features (only if authenticated)
      let featuresData: OrganizationFeature[] = [];
      if (profile?.organization_id) {
        const { data, error: featuresError } = await supabase
          .from('organization_features')
          .select('*')
          .eq('organization_id', organization.id);

        if (!featuresError && data) {
          featuresData = data;
        }
      }

      // Load integrations (only if authenticated)
      let integrationsData: OrganizationIntegration[] = [];
      if (profile?.organization_id) {
        const { data, error: integrationsError } = await supabase
          .from('organization_integrations')
          .select('*')
          .eq('organization_id', organization.id);

        if (!integrationsError && data) {
          integrationsData = data;
        }
      }

      // Build feature map
      const features: Record<string, any> = {};
      featuresData?.forEach((feature: any) => {
        features[feature.feature_key] = feature;
      });

      // Build integration map
      const integrations: Record<string, any> = {};
      integrationsData?.forEach((integration: any) => {
        integrations[integration.integration_key] = integration;
      });

      setTenant({
        organization,
        features: features as Record<FeatureKey, OrganizationFeature | undefined>,
        integrations: integrations as Record<IntegrationKey, OrganizationIntegration | undefined>
      });
    } catch (error) {
      console.error('Error loading tenant config:', error);
      setTenant({
        organization: null,
        features: {} as Record<FeatureKey, OrganizationFeature | undefined>,
        integrations: {} as Record<IntegrationKey, OrganizationIntegration | undefined>
      });
    } finally {
      setLoading(false);
    }
  };

  // Load on mount and when profile changes
  useEffect(() => {
    if (!authLoading) {
      loadTenantConfig();
    }
  }, [profile?.organization_id, authLoading]);

  // Subscribe to real-time updates (only if authenticated)
  useEffect(() => {
    if (!profile?.organization_id) return;

    const organizationId = profile.organization_id;

    // Subscribe to organization changes
    const orgChannel = supabase
      .channel('organization_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organizations',
          filter: `id=eq.${organizationId}`
        },
        () => {
          loadTenantConfig();
        }
      )
      .subscribe();

    // Subscribe to feature changes
    const featuresChannel = supabase
      .channel('organization_features_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organization_features',
          filter: `organization_id=eq.${organizationId}`
        },
        () => {
          loadTenantConfig();
        }
      )
      .subscribe();

    // Subscribe to integration changes
    const integrationsChannel = supabase
      .channel('organization_integrations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organization_integrations',
          filter: `organization_id=eq.${organizationId}`
        },
        () => {
          loadTenantConfig();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orgChannel);
      supabase.removeChannel(featuresChannel);
      supabase.removeChannel(integrationsChannel);
    };
  }, [profile?.organization_id]);

  // Helper: Check if feature is enabled
  const hasFeature = (feature: FeatureKey): boolean => {
    if (!tenant) return false;
    const featureData = tenant.features[feature];
    return featureData?.enabled === true;
  };

  // Helper: Get feature configuration
  const getFeatureConfig = (feature: FeatureKey): Record<string, any> => {
    if (!tenant) return {};
    const featureData = tenant.features[feature];
    return featureData?.config || {};
  };

  // Helper: Check if integration is active
  const hasIntegration = (integration: IntegrationKey): boolean => {
    if (!tenant) return false;
    const integrationData = tenant.integrations[integration];
    return integrationData?.enabled === true && integrationData?.status === 'active';
  };

  // Helper: Get integration status
  const getIntegrationStatus = (integration: IntegrationKey): 'active' | 'error' | 'disabled' | 'testing' | null => {
    if (!tenant) return null;
    const integrationData = tenant.integrations[integration];
    return integrationData?.status || null;
  };

  // Context value
  const value: TenantContextType = {
    tenant,
    loading,
    
    // Organization info
    organization: tenant?.organization || null,
    organizationId: tenant?.organization?.id || null,
    organizationName: tenant?.organization?.name || null,
    subscriptionPlan: tenant?.organization?.subscription_plan || null,
    subscriptionStatus: tenant?.organization?.subscription_status || null,
    isFounder: tenant?.organization?.is_founder || false,
    
    // Feature checking
    hasFeature,
    getFeatureConfig,
    
    // Integration checking
    hasIntegration,
    getIntegrationStatus,
    
    // Add-on checking
    hasQuickBooksAsync: tenant?.organization?.addon_quickbooks_async || false,
    hasPartsTech: tenant?.organization?.addon_partstech || false,
    hasDigitsAI: tenant?.organization?.addon_digits_ai || null,
    hasHonkampPayroll: tenant?.organization?.addon_honkamp_payroll || false,
    
    // Limits
    userLimit: tenant?.organization?.user_limit || null,
    currentUserCount: tenant?.organization?.current_user_count || 0,
    
    // Actions
    refreshTenant: loadTenantConfig
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

// =====================================================
// HOOK
// =====================================================

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

// =====================================================
// CONVENIENCE HOOKS
// =====================================================

/**
 * Hook to check if a specific feature is enabled
 * @example const canUploadPhotos = useFeature('photo_uploads');
 */
export const useFeature = (feature: FeatureKey): boolean => {
  const { hasFeature } = useTenant();
  return hasFeature(feature);
};

/**
 * Hook to check if a specific integration is active
 * @example const hasSendGrid = useIntegration('sendgrid');
 */
export const useIntegration = (integration: IntegrationKey): boolean => {
  const { hasIntegration } = useTenant();
  return hasIntegration(integration);
};

/**
 * Hook to check if user limit is reached
 * @returns true if at or over limit, false if under limit or unlimited
 */
export const useUserLimitReached = (): boolean => {
  const { userLimit, currentUserCount } = useTenant();
  if (userLimit === null) return false; // Unlimited
  return currentUserCount >= userLimit;
};
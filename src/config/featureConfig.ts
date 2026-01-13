// =====================================================
// FEATURE CONFIGURATION
// Defines subscription tiers and feature enablement
// =====================================================

export type SubscriptionPlan = 'starter' | 'professional' | 'growth' | 'enterprise' | 'founder';
export type SubscriptionStatus = 'demo' | 'onboarding' | 'active' | 'past_due' | 'suspended' | 'cancelled';

export type FeatureKey = 
  // Starter features (ALL TIERS)
  | 'customer_management'
  | 'vehicle_history'
  | 'basic_invoicing'
  | 'appointment_scheduling'
  | 'email_support'
  | 'mobile_app_access'
  | 'basic_reporting'
  | 'customer_portal'
  | 'email_notifications'
  | 'dual_pricing'
  | 'quickbooks_oneway'
  // Professional+ features
  | 'time_keeping'
  | 'inventory_management'
  | 'advanced_reporting'
  | 'photo_uploads'
  | 'digital_vehicle_inspections'
  | 'priority_phone_support'
  | 'customer_appointment_reminders'
  | 'digital_waivers'
  // Growth+ features
  | 'custom_branding'
  | 'multi_location_support'
  | 'advanced_inventory_controls'
  | 'advanced_analytics'
  | 'custom_reports'
  | 'employee_time_tracking'
  | 'phone_support'
  // Enterprise+ features
  | 'white_label'
  | 'custom_domain'
  | 'dedicated_account_manager'
  | 'priority_support_24_7'
  | 'custom_integrations'
  | 'custom_development'
  | 'franchise_management'
  | 'sla_guarantee';

export type IntegrationKey = 
  | 'sendgrid'           // Email delivery (all tiers)
  | 'aws_s3'             // Photo storage (Professional+)
  | 'dejavoo_ipospays'   // Payment processing (all tiers)
  | 'quickbooks_basic'   // 1-way sync (all tiers, included)
  | 'quickbooks_async'   // 2-way sync ($49/month add-on)
  | 'partstech_api'      // Parts ordering (add-on, TBD)
  | 'digits_api'         // AI accounting (add-on, $99/$179/included)
  | 'honkamp_payroll';   // Payroll integration (add-on, TBD)

export interface FeatureConfig {
  enabled: boolean;
  dependencies?: IntegrationKey[];
  config?: Record<string, any>;
}

export interface TierConfig {
  tier: SubscriptionPlan;
  monthlyPrice: number | null; // null for Founder (one-time)
  userLimit: number | null;    // null for unlimited
  features: Record<FeatureKey, FeatureConfig>;
}

// =====================================================
// TIER DEFINITIONS
// =====================================================

export const FEATURE_CONFIG: Record<SubscriptionPlan, TierConfig> = {
  // --------------------------------------------------
  // STARTER: $97/month, 2 users
  // --------------------------------------------------
  starter: {
    tier: 'starter',
    monthlyPrice: 97,
    userLimit: 2,
    features: {
      // Core features
      customer_management: { enabled: true },
      vehicle_history: { enabled: true },
      basic_invoicing: { enabled: true },
      appointment_scheduling: { enabled: true },
      email_support: { enabled: true, dependencies: ['sendgrid'] },
      mobile_app_access: { enabled: true },
      basic_reporting: { enabled: true },
      customer_portal: { enabled: true },
      email_notifications: { enabled: true, dependencies: ['sendgrid'] },
      dual_pricing: { enabled: true },
      quickbooks_oneway: { enabled: true, dependencies: ['quickbooks_basic'] },
      
      // Professional+ features (disabled)
      time_keeping: { enabled: false },
      inventory_management: { enabled: false },
      advanced_reporting: { enabled: false },
      photo_uploads: { enabled: false },
      digital_vehicle_inspections: { enabled: false },
      priority_phone_support: { enabled: false },
      customer_appointment_reminders: { enabled: false },
      digital_waivers: { enabled: false },
      
      // Growth+ features (disabled)
      custom_branding: { enabled: false },
      multi_location_support: { enabled: false },
      advanced_inventory_controls: { enabled: false },
      advanced_analytics: { enabled: false },
      custom_reports: { enabled: false },
      employee_time_tracking: { enabled: false },
      phone_support: { enabled: false },
      
      // Enterprise+ features (disabled)
      white_label: { enabled: false },
      custom_domain: { enabled: false },
      dedicated_account_manager: { enabled: false },
      priority_support_24_7: { enabled: false },
      custom_integrations: { enabled: false },
      custom_development: { enabled: false },
      franchise_management: { enabled: false },
      sla_guarantee: { enabled: false }
    }
  },

  // --------------------------------------------------
  // PROFESSIONAL: $197/month, 3 users
  // --------------------------------------------------
  professional: {
    tier: 'professional',
    monthlyPrice: 197,
    userLimit: 3,
    features: {
      // Inherits all Starter features
      customer_management: { enabled: true },
      vehicle_history: { enabled: true },
      basic_invoicing: { enabled: true },
      appointment_scheduling: { enabled: true },
      email_support: { enabled: true, dependencies: ['sendgrid'] },
      mobile_app_access: { enabled: true },
      basic_reporting: { enabled: true },
      customer_portal: { enabled: true },
      email_notifications: { enabled: true, dependencies: ['sendgrid'] },
      dual_pricing: { enabled: true },
      quickbooks_oneway: { enabled: true, dependencies: ['quickbooks_basic'] },
      
      // Professional features
      time_keeping: { enabled: true },
      inventory_management: { enabled: true },
      advanced_reporting: { enabled: true },
      photo_uploads: { enabled: true, dependencies: ['aws_s3'] },
      digital_vehicle_inspections: { enabled: true, dependencies: ['aws_s3'] },
      priority_phone_support: { enabled: true },
      customer_appointment_reminders: { enabled: true, dependencies: ['sendgrid'] },
      digital_waivers: { enabled: true },
      
      // Growth+ features (disabled)
      custom_branding: { enabled: false },
      multi_location_support: { enabled: false },
      advanced_inventory_controls: { enabled: false },
      advanced_analytics: { enabled: false },
      custom_reports: { enabled: false },
      employee_time_tracking: { enabled: false },
      phone_support: { enabled: false },
      
      // Enterprise+ features (disabled)
      white_label: { enabled: false },
      custom_domain: { enabled: false },
      dedicated_account_manager: { enabled: false },
      priority_support_24_7: { enabled: false },
      custom_integrations: { enabled: false },
      custom_development: { enabled: false },
      franchise_management: { enabled: false },
      sla_guarantee: { enabled: false }
    }
  },

  // --------------------------------------------------
  // GROWTH: $347/month, 10 users
  // --------------------------------------------------
  growth: {
    tier: 'growth',
    monthlyPrice: 347,
    userLimit: 10,
    features: {
      // Inherits all Professional features
      customer_management: { enabled: true },
      vehicle_history: { enabled: true },
      basic_invoicing: { enabled: true },
      appointment_scheduling: { enabled: true },
      email_support: { enabled: true, dependencies: ['sendgrid'] },
      mobile_app_access: { enabled: true },
      basic_reporting: { enabled: true },
      customer_portal: { enabled: true },
      email_notifications: { enabled: true, dependencies: ['sendgrid'] },
      dual_pricing: { enabled: true },
      quickbooks_oneway: { enabled: true, dependencies: ['quickbooks_basic'] },
      time_keeping: { enabled: true },
      inventory_management: { enabled: true },
      advanced_reporting: { enabled: true },
      photo_uploads: { enabled: true, dependencies: ['aws_s3'] },
      digital_vehicle_inspections: { enabled: true, dependencies: ['aws_s3'] },
      priority_phone_support: { enabled: true },
      customer_appointment_reminders: { enabled: true, dependencies: ['sendgrid'] },
      digital_waivers: { enabled: true },
      
      // Growth features
      custom_branding: { enabled: true },
      multi_location_support: { enabled: true, config: { max_locations: 2 } },
      advanced_inventory_controls: { enabled: true },
      advanced_analytics: { enabled: true },
      custom_reports: { enabled: true },
      employee_time_tracking: { enabled: true },
      phone_support: { enabled: true },
      
      // Enterprise+ features (disabled)
      white_label: { enabled: false },
      custom_domain: { enabled: false },
      dedicated_account_manager: { enabled: false },
      priority_support_24_7: { enabled: false },
      custom_integrations: { enabled: false },
      custom_development: { enabled: false },
      franchise_management: { enabled: false },
      sla_guarantee: { enabled: false }
    }
  },

  // --------------------------------------------------
  // ENTERPRISE: Custom pricing, unlimited users
  // --------------------------------------------------
  enterprise: {
    tier: 'enterprise',
    monthlyPrice: null, // Custom pricing
    userLimit: null,    // Unlimited
    features: {
      // Inherits all Growth features
      customer_management: { enabled: true },
      vehicle_history: { enabled: true },
      basic_invoicing: { enabled: true },
      appointment_scheduling: { enabled: true },
      email_support: { enabled: true, dependencies: ['sendgrid'] },
      mobile_app_access: { enabled: true },
      basic_reporting: { enabled: true },
      customer_portal: { enabled: true },
      email_notifications: { enabled: true, dependencies: ['sendgrid'] },
      dual_pricing: { enabled: true },
      quickbooks_oneway: { enabled: true, dependencies: ['quickbooks_basic'] },
      time_keeping: { enabled: true },
      inventory_management: { enabled: true },
      advanced_reporting: { enabled: true },
      photo_uploads: { enabled: true, dependencies: ['aws_s3'] },
      digital_vehicle_inspections: { enabled: true, dependencies: ['aws_s3'] },
      priority_phone_support: { enabled: true },
      customer_appointment_reminders: { enabled: true, dependencies: ['sendgrid'] },
      digital_waivers: { enabled: true },
      custom_branding: { enabled: true },
      multi_location_support: { enabled: true, config: { max_locations: null } }, // Unlimited
      advanced_inventory_controls: { enabled: true },
      advanced_analytics: { enabled: true },
      custom_reports: { enabled: true },
      employee_time_tracking: { enabled: true },
      phone_support: { enabled: true },
      
      // Enterprise features
      white_label: { enabled: true },
      custom_domain: { enabled: true },
      dedicated_account_manager: { enabled: true },
      priority_support_24_7: { enabled: true },
      custom_integrations: { enabled: true },
      custom_development: { enabled: true },
      franchise_management: { enabled: true },
      sla_guarantee: { enabled: true }
    }
  },

  // --------------------------------------------------
  // FOUNDER: $7,500 one-time, lifetime access
  // --------------------------------------------------
  founder: {
    tier: 'founder',
    monthlyPrice: null, // One-time payment
    userLimit: null,    // Unlimited
    features: {
      // All Enterprise features enabled
      customer_management: { enabled: true },
      vehicle_history: { enabled: true },
      basic_invoicing: { enabled: true },
      appointment_scheduling: { enabled: true },
      email_support: { enabled: true, dependencies: ['sendgrid'] },
      mobile_app_access: { enabled: true },
      basic_reporting: { enabled: true },
      customer_portal: { enabled: true },
      email_notifications: { enabled: true, dependencies: ['sendgrid'] },
      dual_pricing: { enabled: true },
      quickbooks_oneway: { enabled: true, dependencies: ['quickbooks_basic'] },
      time_keeping: { enabled: true },
      inventory_management: { enabled: true },
      advanced_reporting: { enabled: true },
      photo_uploads: { enabled: true, dependencies: ['aws_s3'] },
      digital_vehicle_inspections: { enabled: true, dependencies: ['aws_s3'] },
      priority_phone_support: { enabled: true },
      customer_appointment_reminders: { enabled: true, dependencies: ['sendgrid'] },
      digital_waivers: { enabled: true },
      custom_branding: { enabled: true },
      multi_location_support: { enabled: true, config: { max_locations: null } },
      advanced_inventory_controls: { enabled: true },
      advanced_analytics: { enabled: true },
      custom_reports: { enabled: true },
      employee_time_tracking: { enabled: true },
      phone_support: { enabled: true },
      white_label: { enabled: true },
      custom_domain: { enabled: true },
      dedicated_account_manager: { enabled: true },
      priority_support_24_7: { enabled: true },
      custom_integrations: { enabled: true },
      custom_development: { enabled: true },
      franchise_management: { enabled: true },
      sla_guarantee: { enabled: true }
    }
  }
};

// =====================================================
// INTEGRATION DEPENDENCIES
// =====================================================

export interface IntegrationConfig {
  key: IntegrationKey;
  service: string;
  purpose: string;
  cost_type?: 'included' | 'addon' | 'per_transaction';
  addon_price?: number;
  enabled_tiers: SubscriptionPlan[];
}

export const INTEGRATION_DEPENDENCIES: Record<IntegrationKey, IntegrationConfig> = {
  sendgrid: {
    key: 'sendgrid',
    service: 'SendGrid',
    purpose: 'Email delivery for notifications and support',
    cost_type: 'included',
    enabled_tiers: ['starter', 'professional', 'growth', 'enterprise', 'founder']
  },
  aws_s3: {
    key: 'aws_s3',
    service: 'AWS S3',
    purpose: 'Photo storage for vehicle inspections',
    cost_type: 'included',
    enabled_tiers: ['professional', 'growth', 'enterprise', 'founder']
  },
  dejavoo_ipospays: {
    key: 'dejavoo_ipospays',
    service: 'Dejavoo iPOSpays',
    purpose: 'Payment processing',
    cost_type: 'included',
    enabled_tiers: ['starter', 'professional', 'growth', 'enterprise', 'founder']
  },
  quickbooks_basic: {
    key: 'quickbooks_basic',
    service: 'QuickBooks',
    purpose: 'One-way sync (OverDryv → QuickBooks)',
    cost_type: 'included',
    enabled_tiers: ['starter', 'professional', 'growth', 'enterprise', 'founder']
  },
  quickbooks_async: {
    key: 'quickbooks_async',
    service: 'QuickBooks Async Sync',
    purpose: 'Two-way sync (bidirectional)',
    cost_type: 'addon',
    addon_price: 49,
    enabled_tiers: ['professional', 'growth', 'enterprise', 'founder']
  },
  partstech_api: {
    key: 'partstech_api',
    service: 'PartsTech',
    purpose: 'Parts ordering integration',
    cost_type: 'per_transaction', // TBD: awaiting cost basis
    enabled_tiers: ['growth', 'enterprise', 'founder']
  },
  digits_api: {
    key: 'digits_api',
    service: 'Digits AI Accounting',
    purpose: 'AI-powered bookkeeping and analytics',
    cost_type: 'addon',
    // Pricing: Basic $99, Professional $179, Enterprise includes full service bookkeeping
    enabled_tiers: ['professional', 'growth', 'enterprise', 'founder']
  },
  honkamp_payroll: {
    key: 'honkamp_payroll',
    service: 'Honkamp Payroll',
    purpose: 'Payroll integration and processing',
    cost_type: 'addon', // TBD: base integration cost + Honkamp bills separately
    enabled_tiers: ['growth', 'enterprise', 'founder']
  }
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get tier configuration for a subscription plan
 */
export function getTierConfig(plan: SubscriptionPlan): TierConfig {
  return FEATURE_CONFIG[plan];
}

/**
 * Check if a feature is enabled for a specific tier
 */
export function isFeatureEnabledInTier(feature: FeatureKey, tier: SubscriptionPlan): boolean {
  return FEATURE_CONFIG[tier].features[feature].enabled;
}

/**
 * Get required integrations for a feature
 */
export function getFeatureDependencies(feature: FeatureKey, tier: SubscriptionPlan): IntegrationKey[] {
  return FEATURE_CONFIG[tier].features[feature].dependencies || [];
}

/**
 * Get all enabled features for a tier
 */
export function getEnabledFeatures(tier: SubscriptionPlan): FeatureKey[] {
  const config = FEATURE_CONFIG[tier];
  return Object.entries(config.features)
    .filter(([_, featureConfig]) => featureConfig.enabled)
    .map(([featureKey]) => featureKey as FeatureKey);
}

/**
 * Get human-readable feature name
 */
export function getFeatureDisplayName(feature: FeatureKey): string {
  const names: Record<FeatureKey, string> = {
    customer_management: 'Customer Management',
    vehicle_history: 'Vehicle History Tracking',
    basic_invoicing: 'Basic Invoicing',
    appointment_scheduling: 'Appointment Scheduling',
    email_support: 'Email Support',
    mobile_app_access: 'Mobile App Access',
    basic_reporting: 'Basic Reporting',
    customer_portal: 'Customer Portal',
    email_notifications: 'Email Notifications',
    dual_pricing: 'Dual Pricing (Cash/Card)',
    quickbooks_oneway: 'QuickBooks One-Way Sync',
    time_keeping: 'Time Keeping',
    inventory_management: 'Inventory Management',
    advanced_reporting: 'Advanced Reporting',
    photo_uploads: 'Photo Uploads',
    digital_vehicle_inspections: 'Digital Vehicle Inspections',
    priority_phone_support: 'Priority Phone Support',
    customer_appointment_reminders: 'Customer Appointment Reminders',
    digital_waivers: 'Digital Waivers & Signatures',
    custom_branding: 'Custom Branding',
    multi_location_support: 'Multi-Location Support',
    advanced_inventory_controls: 'Advanced Inventory Controls',
    advanced_analytics: 'Advanced Analytics',
    custom_reports: 'Custom Reports',
    employee_time_tracking: 'Employee Time Tracking',
    phone_support: 'Phone Support',
    white_label: 'White Label',
    custom_domain: 'Custom Domain',
    dedicated_account_manager: 'Dedicated Account Manager',
    priority_support_24_7: '24/7 Priority Support',
    custom_integrations: 'Custom Integrations',
    custom_development: 'Custom Development',
    franchise_management: 'Franchise Management Tools',
    sla_guarantee: 'SLA Guarantee (99.9% uptime)'
  };
  return names[feature] || feature;
}

/**
 * Get minimum required tier for a feature
 */
export function getMinimumTierForFeature(feature: FeatureKey): SubscriptionPlan {
  const tiers: SubscriptionPlan[] = ['starter', 'professional', 'growth', 'enterprise', 'founder'];
  for (const tier of tiers) {
    if (isFeatureEnabledInTier(feature, tier)) {
      return tier;
    }
  }
  return 'enterprise'; // Fallback
}

/**
 * Get tier display name with pricing
 */
export function getTierDisplayName(tier: SubscriptionPlan): string {
  const config = FEATURE_CONFIG[tier];
  if (tier === 'founder') {
    return 'Founder ($7,500 lifetime)';
  }
  if (tier === 'enterprise') {
    return 'Enterprise (Custom pricing)';
  }
  return `${tier.charAt(0).toUpperCase() + tier.slice(1)} ($${config.monthlyPrice}/month)`;
}

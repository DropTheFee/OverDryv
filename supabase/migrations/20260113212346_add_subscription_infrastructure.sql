-- =====================================================
-- SUBSCRIPTION INFRASTRUCTURE MIGRATION
-- Phase 0.1: Add subscription tiers, feature flags, integrations
-- =====================================================

-- =====================================================
-- STEP 1: Update organizations table with subscription fields
-- =====================================================

-- Add subscription columns to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS subscription_plan text NOT NULL DEFAULT 'starter' 
  CHECK (subscription_plan IN ('starter', 'professional', 'growth', 'enterprise', 'founder')),
ADD COLUMN IF NOT EXISTS monthly_price decimal(10,2),
ADD COLUMN IF NOT EXISTS user_limit integer,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'onboarding' 
  CHECK (subscription_status IN ('demo', 'onboarding', 'active', 'past_due', 'suspended', 'cancelled')),
ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
ADD COLUMN IF NOT EXISTS subscription_starts_at timestamptz,
ADD COLUMN IF NOT EXISTS first_billing_date timestamptz,
ADD COLUMN IF NOT EXISTS next_billing_date timestamptz,
ADD COLUMN IF NOT EXISTS is_founder boolean DEFAULT false;

-- Add usage tracking columns (for analytics, not limits)
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS current_user_count integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_customer_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_work_orders_total integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_storage_bytes bigint DEFAULT 0;

-- Add add-on flags
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS addon_quickbooks_async boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS addon_partstech boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS addon_digits_ai text CHECK (addon_digits_ai IN ('basic', 'professional', 'enterprise')),
ADD COLUMN IF NOT EXISTS addon_honkamp_payroll boolean DEFAULT false;

-- Add payment gateway fields
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS payment_gateway text DEFAULT 'dejavoo',
ADD COLUMN IF NOT EXISTS dejavoo_merchant_id text;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(subscription_status);
CREATE INDEX IF NOT EXISTS idx_organizations_plan ON organizations(subscription_plan);

-- =====================================================
-- STEP 2: Create organization_features table
-- =====================================================

CREATE TABLE IF NOT EXISTS organization_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  feature_key text NOT NULL,
  enabled boolean DEFAULT false,
  
  -- Feature-specific configuration
  config jsonb DEFAULT '{}'::jsonb,
  
  -- Metadata
  enabled_at timestamptz,
  disabled_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_org_feature UNIQUE(organization_id, feature_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_features_org ON organization_features(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_features_key ON organization_features(feature_key);
CREATE INDEX IF NOT EXISTS idx_org_features_enabled ON organization_features(organization_id, enabled);

-- RLS Policies
ALTER TABLE organization_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_see_own_org_features" ON organization_features;
CREATE POLICY "users_see_own_org_features"
  ON organization_features FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "admins_manage_org_features" ON organization_features;
CREATE POLICY "admins_manage_org_features"
  ON organization_features FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- =====================================================
-- STEP 3: Create organization_integrations table
-- =====================================================

CREATE TABLE IF NOT EXISTS organization_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  integration_key text NOT NULL,
  enabled boolean DEFAULT false,
  
  -- Encrypted credentials
  credentials jsonb,
  
  -- Integration-specific settings
  config jsonb DEFAULT '{}'::jsonb,
  
  -- Status tracking
  status text DEFAULT 'disabled' 
    CHECK (status IN ('active', 'error', 'disabled', 'testing')),
  last_synced_at timestamptz,
  last_error text,
  error_count integer DEFAULT 0,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  
  CONSTRAINT unique_org_integration UNIQUE(organization_id, integration_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_integrations_org ON organization_integrations(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_integrations_key ON organization_integrations(integration_key);
CREATE INDEX IF NOT EXISTS idx_org_integrations_status ON organization_integrations(status);

-- RLS Policies
ALTER TABLE organization_integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_see_own_org_integrations" ON organization_integrations;
CREATE POLICY "admins_see_own_org_integrations"
  ON organization_integrations FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

DROP POLICY IF EXISTS "admins_manage_org_integrations" ON organization_integrations;
CREATE POLICY "admins_manage_org_integrations"
  ON organization_integrations FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- =====================================================
-- STEP 4: Create feature_audit_log table
-- =====================================================

CREATE TABLE IF NOT EXISTS feature_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- What changed
  feature_key text,
  integration_key text,
  action text NOT NULL 
    CHECK (action IN ('enabled', 'disabled', 'configured', 'upgraded', 'downgraded', 'tested')),
  
  -- Who changed it
  changed_by uuid REFERENCES auth.users(id),
  changed_by_name text,
  
  -- Change details
  previous_value jsonb,
  new_value jsonb,
  
  -- Context
  ip_address inet,
  user_agent text,
  
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feature_audit_org ON feature_audit_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_feature_audit_date ON feature_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feature_audit_user ON feature_audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_feature_audit_action ON feature_audit_log(action);

-- RLS Policies
ALTER TABLE feature_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_see_own_org_audit_log" ON feature_audit_log;
CREATE POLICY "admins_see_own_org_audit_log"
  ON feature_audit_log FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- =====================================================
-- STEP 5: Create subscription_history table
-- =====================================================

CREATE TABLE IF NOT EXISTS subscription_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  previous_plan text,
  new_plan text NOT NULL,
  action text NOT NULL CHECK (action IN (
    'created', 'upgraded', 'downgraded', 'cancelled', 
    'reactivated', 'demo_completed', 'onboarding_started', 
    'onboarding_completed', 'expired', 'founder_activated'
  )),
  
  previous_amount numeric,
  new_amount numeric,
  
  effective_date timestamptz DEFAULT now(),
  notes text,
  changed_by uuid REFERENCES auth.users(id),
  
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscription_history_org ON subscription_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_date ON subscription_history(created_at DESC);

-- RLS Policies
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_see_own_org_subscription_history" ON subscription_history;
CREATE POLICY "admins_see_own_org_subscription_history"
  ON subscription_history FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- =====================================================
-- STEP 6: Create usage_tracking table
-- =====================================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  metric text NOT NULL,
  value integer NOT NULL,
  period date NOT NULL,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(organization_id, metric, period)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_tracking_org_period ON usage_tracking(organization_id, period);

-- RLS Policies
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_see_own_org_usage" ON usage_tracking;
CREATE POLICY "admins_see_own_org_usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- =====================================================
-- STEP 7: Create triggers and functions
-- =====================================================

-- Function to auto-enable features based on tier
CREATE OR REPLACE FUNCTION sync_features_on_tier_change()
RETURNS TRIGGER AS $$
BEGIN
  -- When subscription plan changes, enable/disable features accordingly
  IF NEW.subscription_plan <> OLD.subscription_plan THEN
    
    -- Starter tier features (ALL TIERS include these)
    IF NEW.subscription_plan IN ('starter', 'professional', 'growth', 'enterprise', 'founder') THEN
      INSERT INTO organization_features (organization_id, feature_key, enabled, enabled_at)
      VALUES 
        (NEW.id, 'customer_management', true, now()),
        (NEW.id, 'vehicle_history', true, now()),
        (NEW.id, 'basic_invoicing', true, now()),
        (NEW.id, 'appointment_scheduling', true, now()),
        (NEW.id, 'email_support', true, now()),
        (NEW.id, 'mobile_app_access', true, now()),
        (NEW.id, 'basic_reporting', true, now()),
        (NEW.id, 'customer_portal', true, now()),
        (NEW.id, 'email_notifications', true, now()),
        (NEW.id, 'dual_pricing', true, now()),
        (NEW.id, 'quickbooks_oneway', true, now())
      ON CONFLICT (organization_id, feature_key) 
      DO UPDATE SET enabled = true, enabled_at = now(), updated_at = now();
    END IF;
    
    -- Professional+ features
    IF NEW.subscription_plan IN ('professional', 'growth', 'enterprise', 'founder') THEN
      INSERT INTO organization_features (organization_id, feature_key, enabled, enabled_at)
      VALUES 
        (NEW.id, 'time_keeping', true, now()),
        (NEW.id, 'inventory_management', true, now()),
        (NEW.id, 'advanced_reporting', true, now()),
        (NEW.id, 'photo_uploads', true, now()),
        (NEW.id, 'digital_vehicle_inspections', true, now()),
        (NEW.id, 'priority_phone_support', true, now()),
        (NEW.id, 'customer_appointment_reminders', true, now()),
        (NEW.id, 'digital_waivers', true, now())
      ON CONFLICT (organization_id, feature_key) 
      DO UPDATE SET enabled = true, enabled_at = now(), updated_at = now();
    ELSE
      -- Disable Professional features if downgrading
      UPDATE organization_features 
      SET enabled = false, disabled_at = now(), updated_at = now()
      WHERE organization_id = NEW.id
      AND feature_key IN ('time_keeping', 'inventory_management', 'advanced_reporting', 
                          'photo_uploads', 'digital_vehicle_inspections', 
                          'priority_phone_support', 'customer_appointment_reminders', 'digital_waivers');
    END IF;
    
    -- Growth+ features
    IF NEW.subscription_plan IN ('growth', 'enterprise', 'founder') THEN
      INSERT INTO organization_features (organization_id, feature_key, enabled, enabled_at)
      VALUES 
        (NEW.id, 'custom_branding', true, now()),
        (NEW.id, 'multi_location_support', true, now()),
        (NEW.id, 'advanced_inventory_controls', true, now()),
        (NEW.id, 'advanced_analytics', true, now()),
        (NEW.id, 'custom_reports', true, now()),
        (NEW.id, 'employee_time_tracking', true, now()),
        (NEW.id, 'phone_support', true, now())
      ON CONFLICT (organization_id, feature_key) 
      DO UPDATE SET enabled = true, enabled_at = now(), updated_at = now();
    ELSE
      -- Disable Growth features if downgrading
      UPDATE organization_features 
      SET enabled = false, disabled_at = now(), updated_at = now()
      WHERE organization_id = NEW.id
      AND feature_key IN ('custom_branding', 'multi_location_support', 'advanced_inventory_controls', 
                          'advanced_analytics', 'custom_reports', 'employee_time_tracking', 'phone_support');
    END IF;
    
    -- Enterprise+ features
    IF NEW.subscription_plan IN ('enterprise', 'founder') THEN
      INSERT INTO organization_features (organization_id, feature_key, enabled, enabled_at)
      VALUES 
        (NEW.id, 'white_label', true, now()),
        (NEW.id, 'custom_domain', true, now()),
        (NEW.id, 'dedicated_account_manager', true, now()),
        (NEW.id, 'priority_support_24_7', true, now()),
        (NEW.id, 'custom_integrations', true, now()),
        (NEW.id, 'custom_development', true, now()),
        (NEW.id, 'franchise_management', true, now()),
        (NEW.id, 'sla_guarantee', true, now())
      ON CONFLICT (organization_id, feature_key) 
      DO UPDATE SET enabled = true, enabled_at = now(), updated_at = now();
    ELSE
      -- Disable Enterprise features if downgrading
      UPDATE organization_features 
      SET enabled = false, disabled_at = now(), updated_at = now()
      WHERE organization_id = NEW.id
      AND feature_key IN ('white_label', 'custom_domain', 'dedicated_account_manager', 
                          'priority_support_24_7', 'custom_integrations', 'custom_development', 
                          'franchise_management', 'sla_guarantee');
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS sync_features_on_tier_change_trigger ON organizations;

-- Create trigger to sync features on plan change
CREATE TRIGGER sync_features_on_tier_change_trigger
  AFTER UPDATE OF subscription_plan ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION sync_features_on_tier_change();

-- Function to validate integration dependencies before enabling feature
CREATE OR REPLACE FUNCTION check_feature_dependencies()
RETURNS TRIGGER AS $$
DECLARE
  required_integrations text[];
  integration text;
  integration_enabled boolean;
BEGIN
  -- Only check when enabling a feature
  IF NEW.enabled = true AND (OLD.enabled IS NULL OR OLD.enabled = false) THEN
    
    -- Define feature dependencies
    required_integrations := CASE NEW.feature_key
      WHEN 'photo_uploads' THEN ARRAY['aws_s3']
      WHEN 'digital_vehicle_inspections' THEN ARRAY['aws_s3']
      WHEN 'email_notifications' THEN ARRAY['sendgrid']
      WHEN 'email_support' THEN ARRAY['sendgrid']
      ELSE ARRAY[]::text[]
    END;
    
    -- Check if all required integrations are enabled
    FOREACH integration IN ARRAY required_integrations
    LOOP
      SELECT enabled INTO integration_enabled
      FROM organization_integrations
      WHERE organization_id = NEW.organization_id
        AND integration_key = integration
        AND status = 'active';
      
      IF NOT FOUND OR integration_enabled IS NOT true THEN
        RAISE EXCEPTION 'Cannot enable feature "%". Required integration "%" is not configured.', 
          NEW.feature_key, integration;
      END IF;
    END LOOP;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS check_feature_dependencies_trigger ON organization_features;

-- Create trigger to check dependencies before enabling features
CREATE TRIGGER check_feature_dependencies_trigger
  BEFORE INSERT OR UPDATE OF enabled ON organization_features
  FOR EACH ROW
  EXECUTE FUNCTION check_feature_dependencies();

-- Function to auto-log feature changes
CREATE OR REPLACE FUNCTION log_feature_change()
RETURNS TRIGGER AS $$
DECLARE
  user_name text;
BEGIN
  -- Get user name for audit trail
  SELECT CONCAT(first_name, ' ', last_name) INTO user_name
  FROM profiles
  WHERE id = auth.uid();
  
  INSERT INTO feature_audit_log (
    organization_id,
    feature_key,
    action,
    changed_by,
    changed_by_name,
    previous_value,
    new_value
  ) VALUES (
    COALESCE(NEW.organization_id, OLD.organization_id),
    COALESCE(NEW.feature_key, OLD.feature_key),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'enabled'
      WHEN TG_OP = 'DELETE' THEN 'disabled'
      WHEN NEW.enabled = true AND OLD.enabled = false THEN 'enabled'
      WHEN NEW.enabled = false AND OLD.enabled = true THEN 'disabled'
      ELSE 'configured'
    END,
    auth.uid(),
    user_name,
    CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS log_feature_change_trigger ON organization_features;
DROP TRIGGER IF EXISTS log_integration_change_trigger ON organization_integrations;

-- Create triggers to log all feature changes
CREATE TRIGGER log_feature_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON organization_features
  FOR EACH ROW
  EXECUTE FUNCTION log_feature_change();

CREATE TRIGGER log_integration_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON organization_integrations
  FOR EACH ROW
  EXECUTE FUNCTION log_feature_change();

-- =====================================================
-- STEP 8: Create helper views
-- =====================================================

-- View: Organization features with tier info
CREATE OR REPLACE VIEW v_organization_features AS
SELECT 
  o.id as organization_id,
  o.name as organization_name,
  o.subscription_plan,
  o.monthly_price,
  o.user_limit,
  of.feature_key,
  of.enabled,
  of.config,
  of.enabled_at,
  of.updated_at
FROM organizations o
LEFT JOIN organization_features of ON o.id = of.organization_id
ORDER BY o.name, of.feature_key;

-- View: Organization integrations with status
CREATE OR REPLACE VIEW v_organization_integrations AS
SELECT 
  o.id as organization_id,
  o.name as organization_name,
  o.subscription_plan,
  oi.integration_key,
  oi.enabled,
  oi.status,
  oi.last_synced_at,
  oi.last_error,
  oi.error_count,
  oi.updated_at
FROM organizations o
LEFT JOIN organization_integrations oi ON o.id = oi.organization_id
ORDER BY o.name, oi.integration_key;

-- View: Feature audit summary
CREATE OR REPLACE VIEW v_feature_audit_summary AS
SELECT 
  organization_id,
  feature_key,
  action,
  COUNT(*) as change_count,
  MAX(created_at) as last_changed_at,
  array_agg(DISTINCT changed_by_name) as changed_by_users
FROM feature_audit_log
GROUP BY organization_id, feature_key, action
ORDER BY last_changed_at DESC;

-- =====================================================
-- STEP 9: Initialize existing organizations with Starter features
-- =====================================================

-- Set default subscription plan for existing organizations
UPDATE organizations 
SET subscription_plan = 'starter',
    monthly_price = 97.00,
    user_limit = 2,
    subscription_status = 'active'
WHERE subscription_plan IS NULL;

-- Temporarily disable dependency check trigger during initialization
ALTER TABLE organization_features DISABLE TRIGGER check_feature_dependencies_trigger;

-- Initialize features for all existing organizations
INSERT INTO organization_features (organization_id, feature_key, enabled, enabled_at)
SELECT 
  id as organization_id,
  feature_key,
  true as enabled,
  now() as enabled_at
FROM organizations,
UNNEST(ARRAY[
  'customer_management',
  'vehicle_history',
  'basic_invoicing',
  'appointment_scheduling',
  'email_support',
  'mobile_app_access',
  'basic_reporting',
  'customer_portal',
  'email_notifications',
  'dual_pricing',
  'quickbooks_oneway'
]) AS feature_key
ON CONFLICT (organization_id, feature_key) DO NOTHING;

-- Re-enable dependency check trigger
ALTER TABLE organization_features ENABLE TRIGGER check_feature_dependencies_trigger;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Subscription infrastructure migration completed successfully!';
  RAISE NOTICE '✅ Organizations table updated with subscription fields';
  RAISE NOTICE '✅ organization_features table created';
  RAISE NOTICE '✅ organization_integrations table created';
  RAISE NOTICE '✅ feature_audit_log table created';
  RAISE NOTICE '✅ subscription_history table created';
  RAISE NOTICE '✅ usage_tracking table created';
  RAISE NOTICE '✅ Triggers and functions created';
  RAISE NOTICE '✅ Helper views created';
  RAISE NOTICE '✅ Existing organizations initialized with Starter features';
END $$;

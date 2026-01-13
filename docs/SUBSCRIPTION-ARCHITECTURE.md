# OverDryv Subscription Tiers & Onboarding Architecture
**Design Before Build: Feature Gating & Revenue Model**

**Status:** Planning Phase (MUST complete before multi-tenant migration)  
**Dependencies:** This defines organization structure for MVP Migration Plan  
**Date:** January 13, 2026

---

## 🎯 Why This Matters Now

**Building subscription tiers AFTER multi-tenant = Technical debt nightmare**

If we migrate to multi-tenant first, then add subscriptions later:
- ❌ Retrofit feature flags into 50+ components
- ❌ Rebuild organization schema
- ❌ Update all queries to check entitlements
- ❌ Risk breaking existing organizations
- ❌ Messy conditional logic everywhere

**Building subscription tiers DURING multi-tenant = Clean architecture**

If we design subscriptions now, then build multi-tenant with it:
- ✅ Feature gates built into every component from day 1
- ✅ Organization schema includes subscription fields
- ✅ Queries automatically respect tier limits
- ✅ Clean, maintainable codebase
- ✅ Easy to add new tiers or features

**Decision:** We build subscriptions architecture FIRST, then migrate to multi-tenant WITH subscriptions baked in.

---

## 💰 Subscription Tier Definitions

### **Tier 1: Starter ($97/month)**
**Target:** Solo mechanics, small shops (1-2 bays)

**Core Features:**
- ✅ Unlimited work orders
- ✅ Unlimited customers
- ✅ Vehicle history tracking
- ✅ Basic estimates & invoices
- ✅ Dual pricing (cash/card)
- ✅ Customer portal (view status)
- ✅ 1 user account (owner only)
- ✅ Email support
- ✅ Email notifications
- ✅ Basic reporting (last 30 days)
- ✅ QuickBooks 1-way sync (included)

**Limits:**
- ❌ No photo uploads
- ❌ No time-keeping
- ❌ No inventory management
- ❌ No advanced reporting
- ❌ No multi-location

**Storage:** 500MB (documents/photos)

---

### **Tier 2: Professional ($197/month)**
**Target:** Growing shops (3-5 bays)

**Everything in Starter, PLUS:**
- ✅ Up to 3 user accounts (technicians)
- ✅ Time-keeping (tech clock in/out per work order)
- ✅ Track labor hours per job
- ✅ Labor cost reporting
- ✅ Photo uploads (before/after)
- ✅ Digital vehicle inspections
- ✅ Basic inventory (parts tracking)
- ✅ Priority email support
- ✅ Advanced reporting (12 months)
- ✅ Customer appointment reminders
- ✅ Digital waivers & signatures

**Limits:**
- ❌ No custom branding
- ❌ Limited to 3 users
- ❌ No multi-location support
- ❌ No advanced analytics

**Storage:** 5GB

---

### **Tier 3: Growth ($347/month)**
**Target:** Established shops (6-15 bays)

**Everything in Professional, PLUS:**
- ✅ Unlimited customers
- ✅ Up to 10 user accounts
- ✅ Custom branding (logo, colors)
- ✅ Advanced inventory management
- ✅ Multi-location support (2 locations)
- ✅ QuickBooks Async Sync (2-way) 🔌 Add-on upgrade
- ✅ Parts ordering integration (PartsTech) 🔌 Add-on
- ✅ Digits AI Accounting 🔌 Add-on
- ✅ Phone support (business hours)
- ✅ Advanced analytics & forecasting
- ✅ Custom reports
- ✅ Employee time tracking

**Limits:**
- ❌ Limited to 2 locations
- ❌ Limited to 10 users
- ❌ No white-label option
- ❌ No dedicated support
- ❌ No custom integrations

**Storage:** 25GB

---

### **Tier 4: Enterprise (Custom Pricing)**
**Target:** Chains, franchises (15+ bays, 3+ locations)

**Everything in Growth, PLUS:**
- ✅ Unlimited locations
- ✅ Unlimited users
- ✅ White-label option
- ✅ Custom domain (your-shop.com)
- ✅ Dedicated account manager
- ✅ 24/7 priority support
- ✅ Custom integrations
- ✅ Advanced API access (full)
- ✅ Custom development hours
- ✅ Franchise management tools
- ✅ Multi-currency support
- ✅ SLA guarantees (99.9% uptime)
- ✅ Data export & migration

**Storage:** 100GB+ (negotiable)

**Add-ons Included:**
- All integrations included
- Custom integration development

---

### **Special: Founder Units ($7,500 one-time)**
**Target:** Early adopters, lifetime supporters

**Everything in Enterprise, PLUS:**
- ✅ Lifetime access (no monthly fees)
- ✅ All future features included
- ✅ Special "Founder" badge on account
- ✅ Priority feature requests
- ✅ Dedicated support channel
- ✅ All integrations included (no add-on fees)
- ✅ Founding member recognition

**Database Field:** `subscription_plan = 'founder'`  
**UI Treatment:** Display gold "⭐ Founder" badge throughout interface  
**Billing:** One-time payment, never expires, never bills again

---

## 🔌 Paid Add-On Services

**These are available at ALL tiers**

### **Add-On 1: QuickBooks Integration**

**Basic 1-Way Sync ($0 - INCLUDED):**
- Export invoices to QuickBooks
- Manual sync trigger
- Basic customer mapping

**Asynchronous 2-Way Sync ($49/month):**
- Real-time auto-sync invoices to QuickBooks
- Customer & vendor bi-directional sync
- Chart of accounts mapping
- Payment status sync (QB → OverDryv)
- Tax reporting integration
- Automated reconciliation

**Available On:** Starter+ (Basic included), Professional+ (Async upgrade)
**Note:** Requires active QuickBooks Online subscription

---

### **Add-On 2: PartsTech Integration (Pricing TBD)**
**Provider:** PartsTech
- Search parts from dashboard
- Real-time pricing & availability across multiple suppliers
- One-click ordering
- Order tracking & delivery status
- Auto-update inventory on delivery
- Cost tracking & margin analysis

**Available On:** Professional, Growth, Enterprise (included for Enterprise)
**Note:** Pricing structure under negotiation with PartsTech. Will update based on cost basis agreement.

---

### **Add-On 3: Digits AI Accounting Integration (3-Tier Pricing)**
**Provider:** Digits AI

**Tier 1: Basic ($99/month)**
- Transaction categorization
- Automated bookkeeping
- Basic financial reports

**Tier 2: Professional ($179/month)**
- Cash flow forecasting
- AI-powered insights
- Tax preparation support

**Tier 3: Enterprise (includes Full Service Bookkeeping)**
- Full CFO-level analytics
- Multi-entity management
- Custom financial modeling
- Full service bookkeeping: $350-$500/month (depends on bookkeeper costs)

**Available On:** Professional, Growth, Enterprise
**Note:** Requires Digits AI account. Pricing tiers align with Digits AI subscription levels.

---

### **Add-On 4: Honkamp Payroll Integration (Base Cost TBD)**
**Provider:** Honkamp

**Integration Base Fee:** TBD (OverDryv integration cost)
- Employee time-keeping sync
- Automated payroll submission
- Tax filing coordination
- Worker's comp tracking

**Honkamp Payroll Services:** Billed directly by Honkamp
- Full-service payroll processing
- Tax filing & compliance
- Direct deposit management
- W-2 and 1099 preparation

**Available On:** Professional, Growth, Enterprise
**Note:** Time-keeping available WITHOUT Honkamp integration (see Professional tier)

---

## 🗄️ Database Schema for Multi-Tenant Feature Flags

### **Complete Schema with Normalized Feature Tables**

This replaces the simple JSONB approach with normalized tables for better query performance, audit trails, and dependency validation.

```sql
-- Organizations table (UPDATED with subscription fields)
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain text UNIQUE NOT NULL,
  name text NOT NULL,
  legal_name text,
  
  -- SUBSCRIPTION FIELDS
  subscription_plan text NOT NULL DEFAULT 'starter' 
    CHECK (subscription_plan IN ('starter', 'professional', 'growth', 'enterprise', 'founder')),
  monthly_price decimal(10,2), -- NULL for Founder (one-time payment)
  user_limit integer, -- 2, 3, NULL (unlimited)
  subscription_status text DEFAULT 'onboarding' 
    CHECK (subscription_status IN ('demo', 'onboarding', 'active', 'past_due', 'suspended', 'cancelled')),
  onboarding_completed_at timestamptz,
  subscription_starts_at timestamptz,
  first_billing_date timestamptz, -- 14 days after onboarding
  next_billing_date timestamptz,
  is_founder boolean DEFAULT false, -- Lifetime $7500 members
  
  -- USAGE TRACKING (for analytics, not limits)
  current_user_count integer DEFAULT 1,
  current_customer_count integer DEFAULT 0,
  current_work_orders_total integer DEFAULT 0,
  current_storage_bytes bigint DEFAULT 0,
  
  -- ADD-ON FLAGS
  addon_quickbooks_async boolean DEFAULT false, -- Basic QB included, this is async upgrade
  addon_partstech boolean DEFAULT false,
  addon_digits_ai text, -- 'basic', 'advanced', 'premium', or NULL
  addon_honkamp_payroll boolean DEFAULT false,
  
  -- PAYMENT GATEWAY
  billing_email text NOT NULL,
  payment_method_id uuid REFERENCES payment_methods(id),
  payment_gateway text DEFAULT 'dejavoo', -- 'dejavoo', 'iso_partner', or custom
  dejavoo_merchant_id text, -- For Dejavoo iPOSpays integration
  
  -- CONTACT & SETTINGS
  phone text,
  address jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_organizations_subdomain ON organizations(subdomain);
CREATE INDEX idx_organizations_status ON organizations(subscription_status);
CREATE INDEX idx_organizations_plan ON organizations(subscription_plan);

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "admins_update_own_organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );
```

---

### **Feature Flags Per Organization**

```sql
-- Feature flags per organization
CREATE TABLE organization_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  feature_key text NOT NULL, -- e.g., 'sms_notifications', 'api_access', 'time_keeping'
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
CREATE INDEX idx_org_features_org ON organization_features(organization_id);
CREATE INDEX idx_org_features_key ON organization_features(feature_key);
CREATE INDEX idx_org_features_enabled ON organization_features(organization_id, enabled);

-- RLS Policies
ALTER TABLE organization_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_org_features"
  ON organization_features FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

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

-- Function to auto-enable features based on tier
CREATE OR REPLACE FUNCTION sync_features_on_tier_change()
RETURNS TRIGGER AS $$
BEGIN
  -- When subscription plan changes, enable/disable features accordingly
  IF NEW.subscription_plan <> OLD.subscription_plan THEN
    
    -- Starter tier features
    IF NEW.subscription_plan IN ('starter', 'professional', 'growth', 'enterprise', 'founder') THEN
      INSERT INTO organization_features (organization_id, feature_key, enabled)
      VALUES 
        (NEW.id, 'customer_management', true),
        (NEW.id, 'vehicle_history', true),
        (NEW.id, 'basic_invoicing', true),
        (NEW.id, 'appointment_scheduling', true),
        (NEW.id, 'email_support', true),
        (NEW.id, 'mobile_app_access', true),
        (NEW.id, 'basic_reporting', true)
      ON CONFLICT (organization_id, feature_key) 
      DO UPDATE SET enabled = true, updated_at = now();
    END IF;
    
    -- Professional+ features
    IF NEW.subscription_plan IN ('professional', 'growth', 'enterprise', 'founder') THEN
      INSERT INTO organization_features (organization_id, feature_key, enabled)
      VALUES 
        (NEW.id, 'time_keeping', true),
        (NEW.id, 'inventory_management', true),
        (NEW.id, 'advanced_reporting', true),
        (NEW.id, 'sms_notifications', true),
        (NEW.id, 'digital_vehicle_inspections', true),
        (NEW.id, 'priority_phone_support', true),
        (NEW.id, 'custom_branding', true),
        (NEW.id, 'technician_performance', true)
      ON CONFLICT (organization_id, feature_key) 
      DO UPDATE SET enabled = true, updated_at = now();
    ELSE
      -- Disable Professional features if downgrading
      UPDATE organization_features 
      SET enabled = false, disabled_at = now()
      WHERE organization_id = NEW.id
      AND feature_key IN ('time_keeping', 'inventory_management', 'advanced_reporting', 
                          'sms_notifications', 'digital_vehicle_inspections', 
                          'priority_phone_support', 'custom_branding', 'technician_performance');
    END IF;
    
    -- Growth+ features
    IF NEW.subscription_plan IN ('growth', 'enterprise', 'founder') THEN
      INSERT INTO organization_features (organization_id, feature_key, enabled)
      VALUES 
        (NEW.id, 'multi_location_support', true),
        (NEW.id, 'advanced_inventory_controls', true),
        (NEW.id, 'custom_workflows', true),
        (NEW.id, 'api_access', true),
        (NEW.id, 'dedicated_account_manager', true),
        (NEW.id, 'advanced_security', true),
        (NEW.id, 'custom_integrations', true)
      ON CONFLICT (organization_id, feature_key) 
      DO UPDATE SET enabled = true, updated_at = now();
    ELSE
      -- Disable Growth features if downgrading
      UPDATE organization_features 
      SET enabled = false, disabled_at = now()
      WHERE organization_id = NEW.id
      AND feature_key IN ('multi_location_support', 'advanced_inventory_controls', 
                          'custom_workflows', 'api_access', 'dedicated_account_manager', 
                          'advanced_security', 'custom_integrations');
    END IF;
    
    -- Enterprise+ features
    IF NEW.subscription_plan IN ('enterprise', 'founder') THEN
      INSERT INTO organization_features (organization_id, feature_key, enabled)
      VALUES 
        (NEW.id, 'white_label', true),
        (NEW.id, 'custom_development', true),
        (NEW.id, 'on_premise_deployment', true),
        (NEW.id, 'sla_guarantee', true),
        (NEW.id, 'premium_support_24_7', true),
        (NEW.id, 'dedicated_infrastructure', true),
        (NEW.id, 'training_consulting', true)
      ON CONFLICT (organization_id, feature_key) 
      DO UPDATE SET enabled = true, updated_at = now();
    ELSE
      -- Disable Enterprise features if downgrading
      UPDATE organization_features 
      SET enabled = false, disabled_at = now()
      WHERE organization_id = NEW.id
      AND feature_key IN ('white_label', 'custom_development', 'on_premise_deployment', 
                          'sla_guarantee', 'premium_support_24_7', 'dedicated_infrastructure', 
                          'training_consulting');
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync features on plan change
CREATE TRIGGER sync_features_on_tier_change_trigger
  AFTER UPDATE OF subscription_plan ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION sync_features_on_tier_change();
```

---

### **Integration Configurations Per Organization**

```sql
-- Integration configurations per organization
CREATE TABLE organization_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  integration_key text NOT NULL, -- e.g., 'twilio', 'digits_api', 'aws_s3'
  enabled boolean DEFAULT false,
  
  -- Encrypted credentials (use pgcrypto for encryption)
  credentials jsonb, -- Store encrypted: api_keys, tokens, secrets
  
  -- Integration-specific settings
  config jsonb DEFAULT '{}'::jsonb, -- phone_number, bucket_name, etc.
  
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
CREATE INDEX idx_org_integrations_org ON organization_integrations(organization_id);
CREATE INDEX idx_org_integrations_key ON organization_integrations(integration_key);
CREATE INDEX idx_org_integrations_status ON organization_integrations(status);

-- RLS Policies
ALTER TABLE organization_integrations ENABLE ROW LEVEL SECURITY;

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
      WHEN 'sms_notifications' THEN ARRAY['twilio']
      WHEN 'digital_vehicle_inspections' THEN ARRAY['aws_s3']
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

-- Trigger to check dependencies before enabling features
CREATE TRIGGER check_feature_dependencies_trigger
  BEFORE INSERT OR UPDATE OF enabled ON organization_features
  FOR EACH ROW
  EXECUTE FUNCTION check_feature_dependencies();
```

---

### **Audit Log for Feature Changes**

```sql
-- Audit log for feature changes
CREATE TABLE feature_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- What changed
  feature_key text, -- e.g., 'sms_notifications'
  integration_key text, -- e.g., 'twilio'
  action text NOT NULL 
    CHECK (action IN ('enabled', 'disabled', 'configured', 'upgraded', 'downgraded', 'tested')),
  
  -- Who changed it
  changed_by uuid REFERENCES auth.users(id),
  changed_by_name text, -- Denormalized for audit trail
  
  -- Change details
  previous_value jsonb,
  new_value jsonb,
  
  -- Context
  ip_address inet,
  user_agent text,
  
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_feature_audit_org ON feature_audit_log(organization_id);
CREATE INDEX idx_feature_audit_date ON feature_audit_log(created_at DESC);
CREATE INDEX idx_feature_audit_user ON feature_audit_log(changed_by);
CREATE INDEX idx_feature_audit_action ON feature_audit_log(action);

-- RLS Policies
ALTER TABLE feature_audit_log ENABLE ROW LEVEL SECURITY;

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

-- Triggers to log all feature changes
CREATE TRIGGER log_feature_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON organization_features
  FOR EACH ROW
  EXECUTE FUNCTION log_feature_change();

CREATE TRIGGER log_integration_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON organization_integrations
  FOR EACH ROW
  EXECUTE FUNCTION log_feature_change();
```

---

### **Helper Views for Quick Lookups**

```sql
-- View: Organization features with tier info
CREATE VIEW v_organization_features AS
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
CREATE VIEW v_organization_integrations AS
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
CREATE VIEW v_feature_audit_summary AS
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
```

---

## 🏗️ Database Schema for Subscriptions
  
  -- BILLING & PAYMENT GATEWAY
  billing_email text NOT NULL,
  payment_method_id uuid REFERENCES payment_methods(id),
  payment_gateway text DEFAULT 'dejavoo', -- 'dejavoo', 'iso_partner', or custom
  dejavoo_merchant_id text, -- For Dejavoo iPOSpays integration
  
  -- CONTACT & SETTINGS
  phone text,
  address jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);
```

---

### **subscription_history table (NEW)**
```sql
CREATE TABLE subscription_history (
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
```

---

### **usage_tracking table (NEW)**
```sql
CREATE TABLE usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  metric text NOT NULL, -- 'work_orders', 'customers', 'storage', 'api_calls'
  value integer NOT NULL,
  period date NOT NULL, -- YYYY-MM-DD for monthly tracking
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(organization_id, metric, period)
);

-- Track usage per month
CREATE INDEX idx_usage_tracking_org_period ON usage_tracking(organization_id, period);
```

---

## 🚀 Demo & Onboarding Flow Design

### **Step 1: Landing Page**
**URL:** `https://overdryv.app/`

**Content:**
- Hero: "Auto Repair Shop Management Made Simple"
- Features overview
- Pricing table (4 tiers + Founder Units)
- CTA: "Schedule a Demo" → Calendly booking or contact form

**No Self-Service Signup:** We do hands-on demos first, then guided onboarding to reduce churn.

---

### **Step 2: Demo Request**
**URL:** `https://overdryv.app/demo`

**Form Fields:**
```
Shop Information:
- Business Name *
- Phone Number *
- Email Address *
- Current # of Bays
- Current # of Employees
- Preferred Demo Date/Time

[ ] I'm interested in Founder Units ($7,500 lifetime)

[Request Demo]
```

**Process:**
1. Lead captured in CRM
2. Sales team schedules 30-45 min demo
3. During demo: Walk through features, answer questions
4. After demo: If interested → Send onboarding invitation

---

### **Step 3: Post-Demo Onboarding Invitation**
**Sent by sales team after successful demo**

**Email Content:**
```
Subject: Ready to get started with OverDryv?

Hi [First Name],

Great connecting on our demo! Ready to get your shop set up?

Click below to start your onboarding:
[Start Onboarding]

You'll be billed starting 14 days from completion of onboarding.

Questions? Reply to this email or call [phone].
```

**Link:** `https://overdryv.app/onboarding?token=[unique_token]`

---

### **Step 4: Onboarding Account Setup**
**URL:** `https://overdryv.app/onboarding?token=...`

**Form:**
```
Shop Information:
- Business Name * (pre-filled from demo request)
- Legal Business Name
- Choose Your Subdomain * (e.g., "acmeauto" → acmeauto.overdryv.app)
- Phone *
- Address

Owner Account:
- First Name *
- Last Name *
- Email Address * (pre-filled)
- Create Password *
- Confirm Password *

Choose Your Plan:
[ ] Starter - $97/month
[•] Professional - $197/month ← Recommended
[ ] Growth - $347/month
[ ] Enterprise - Custom pricing
[ ] Founder Units - $7,500 one-time (if invited)

Payment Method:
"First billing: [Date - 14 days from today]"
- Credit Card Number *
- Expiration Date *
- CVV *
- Billing ZIP Code *

Payment Gateway:
[•] Dejavoo iPOSpays (default)
[ ] Alternative gateway (if applicable)

[ ] I agree to Terms of Service and Privacy Policy *

[Complete Setup & Continue]
```

**On Submit:**
1. Validate subdomain availability
2. Create organization record (status='onboarding')
3. Create owner profile (role='admin')
4. Store payment method via Dejavoo
5. Calculate first_billing_date = today + 14 days
6. Log subscription_history: 'onboarding_started'
7. Send welcome email
8. Redirect to: `https://{subdomain}.overdryv.app/onboarding/setup`

---

### **Step 5: Guided Onboarding Wizard**
**URL:** `https://{subdomain}.overdryv.app/onboarding/setup`

**Hands-On Process:** Sales/support team walks customer through this via screenshare

**5-Step Wizard:**

**3.1 Welcome Screen**
```
"Welcome to OverDryv, [First Name]! 🎉"
"Let's get your shop set up in 5 easy steps"

[Get Started]
```

**3.2 Shop Details**
```
"Tell us about your shop"

- Logo Upload (optional)
- Business Hours:
  Monday: [9:00 AM] - [6:00 PM] [Open/Closed]
  Tuesday: ...
- Shop Address
- Tax Rate (%)
- Default Shop Supplies Fee (%)

[Next Step]
```

**3.3 Add First Technician (Optional)**
```
"Invite your team"

"You can skip this and add team members later"

- Email Address
- First Name
- Last Name
- Role: [Technician / Admin]

[+ Add Another Team Member]

[Skip] [Next Step]
```

**3.4 Import Customers (Optional)**
```
"Import your existing customers"

Option 1: Upload CSV
[Upload CSV File]
Download template: customers-template.csv

Option 2: Add Manually Later
"You can add customers as you go"

[Skip] [Next Step]
```

**3.5 Ready to Go!**
```
"You're all set! 🚀"

Onboarding complete!
First billing date: January 27, 2026 (14 days from today)
Monthly billing: $197/month (Professional)

Quick tips:
✓ Create your first work order from the dashboard
✓ Customize your invoices in Settings
✓ Explore the customer portal

[Go to Dashboard]
```

Redirect to: `https://{subdomain}.overdryv.app/dashboard`

---

---

## ⚛️ React Frontend Feature Gating

### **TenantContext Provider (Recommended Pattern)**

This context loads organization features and integrations from the database and provides clean feature checking throughout the app.

```tsx
// src/contexts/TenantContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface TenantConfig {
  organization: {
    id: string;
    name: string;
    subdomain: string;
    subscription_plan: string;
    user_limit: number | null;
    is_founder: boolean;
  };
  features: Record<string, { enabled: boolean; config: any }>;
  integrations: Record<string, { enabled: boolean; status: string; config: any }>;
}

interface TenantContextType {
  tenant: TenantConfig | null;
  features: Record<string, { enabled: boolean; config: any }>;
  loading: boolean;
  hasFeature: (featureKey: string) => boolean;
  hasIntegration: (integrationKey: string) => boolean;
  getFeatureConfig: (featureKey: string) => any;
  getIntegrationConfig: (integrationKey: string) => any;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [features, setFeatures] = useState<Record<string, { enabled: boolean; config: any }>>({});
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const loadTenantConfig = async () => {
    if (!profile?.organization_id) {
      setLoading(false);
      return;
    }

    try {
      // Load organization details
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, subdomain, subscription_plan, user_limit, is_founder')
        .eq('id', profile.organization_id)
        .single();

      if (orgError) throw orgError;

      // Load organization features
      const { data: orgFeatures, error: featuresError } = await supabase
        .from('organization_features')
        .select('feature_key, enabled, config')
        .eq('organization_id', profile.organization_id);

      if (featuresError) throw featuresError;

      // Load organization integrations
      const { data: orgIntegrations, error: integrationsError } = await supabase
        .from('organization_integrations')
        .select('integration_key, enabled, status, config')
        .eq('organization_id', profile.organization_id);

      if (integrationsError) throw integrationsError;

      // Transform features array to object
      const featuresMap = orgFeatures.reduce((acc, f) => {
        acc[f.feature_key] = { enabled: f.enabled, config: f.config };
        return acc;
      }, {} as Record<string, { enabled: boolean; config: any }>);

      // Transform integrations array to object
      const integrationsMap = orgIntegrations.reduce((acc, i) => {
        acc[i.integration_key] = { 
          enabled: i.enabled, 
          status: i.status,
          config: i.config 
        };
        return acc;
      }, {} as Record<string, { enabled: boolean; status: string; config: any }>);

      setTenant({
        organization: org,
        features: featuresMap,
        integrations: integrationsMap,
      });

      setFeatures(featuresMap);
    } catch (error) {
      console.error('Error loading tenant config:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenantConfig();
  }, [profile?.organization_id]);

  const hasFeature = (featureKey: string): boolean => {
    return features[featureKey]?.enabled === true;
  };

  const hasIntegration = (integrationKey: string): boolean => {
    return tenant?.integrations?.[integrationKey]?.enabled === true &&
           tenant?.integrations?.[integrationKey]?.status === 'active';
  };

  const getFeatureConfig = (featureKey: string): any => {
    return features[featureKey]?.config || {};
  };

  const getIntegrationConfig = (integrationKey: string): any => {
    return tenant?.integrations?.[integrationKey]?.config || {};
  };

  const refreshTenant = async () => {
    await loadTenantConfig();
  };

  return (
    <TenantContext.Provider 
      value={{ 
        tenant, 
        features, 
        loading,
        hasFeature, 
        hasIntegration,
        getFeatureConfig,
        getIntegrationConfig,
        refreshTenant
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
```

---

### **App-Level Integration**

```tsx
// src/App.tsx
import { TenantProvider } from './contexts/TenantContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <Router>
          {/* Your app routes */}
        </Router>
      </TenantProvider>
    </AuthProvider>
  );
}
```

---

### **Component Usage Examples**

#### **Example 1: SMS Notifications Feature**

```tsx
// src/components/SendSMSButton.tsx
import { useTenant } from '../contexts/TenantContext';
import { UpgradePrompt } from './UpgradePrompt';
import { ConfigureIntegrationPrompt } from './ConfigureIntegrationPrompt';

function SendSMSButton({ phoneNumber, message }: { phoneNumber: string; message: string }) {
  const { hasFeature, hasIntegration } = useTenant();
  
  // Check if feature is enabled for this tier
  if (!hasFeature('sms_notifications')) {
    return (
      <UpgradePrompt 
        feature="SMS Notifications" 
        requiredTier="Professional"
        currentPrice="$97/mo"
        upgradePrice="$197/mo"
      />
    );
  }
  
  // Check if Twilio integration is configured
  if (!hasIntegration('twilio')) {
    return (
      <ConfigureIntegrationPrompt 
        integration="Twilio"
        description="Configure Twilio to send SMS notifications to customers"
        docsLink="/docs/integrations/twilio"
      />
    );
  }
  
  const handleSendSMS = async () => {
    // Integration is active, send SMS
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber, message }),
      });
      
      if (response.ok) {
        toast.success('SMS sent successfully!');
      }
    } catch (error) {
      toast.error('Failed to send SMS');
    }
  };
  
  return (
    <button onClick={handleSendSMS} className="btn-primary">
      Send SMS
    </button>
  );
}
```

---

#### **Example 2: Time-Keeping Feature**

```tsx
// src/components/TimeTrackingSection.tsx
import { useTenant } from '../contexts/TenantContext';

function TimeTrackingSection({ workOrderId }: { workOrderId: string }) {
  const { hasFeature, tenant } = useTenant();
  
  if (!hasFeature('time_keeping')) {
    return (
      <div className="locked-feature">
        <div className="flex items-center gap-2 text-gray-500">
          <ClockIcon className="w-5 h-5" />
          <span>Time Tracking</span>
          <span className="badge badge-yellow">Professional</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Track technician hours per work order with Professional plan or higher.
        </p>
        <button className="btn-upgrade mt-2">
          Upgrade to Professional
        </button>
      </div>
    );
  }
  
  return (
    <div className="time-tracking-active">
      <h3>Time Tracking</h3>
      <TimeEntryForm workOrderId={workOrderId} />
      <TimeEntryLog workOrderId={workOrderId} />
    </div>
  );
}
```

---

#### **Example 3: Photo Upload with S3 Integration**

```tsx
// src/components/PhotoUploadSection.tsx
import { useTenant } from '../contexts/TenantContext';

function PhotoUploadSection({ workOrderId }: { workOrderId: string }) {
  const { hasFeature, hasIntegration, getIntegrationConfig } = useTenant();
  
  if (!hasFeature('digital_vehicle_inspections')) {
    return (
      <div className="opacity-50 cursor-not-allowed">
        <span>📷 Photo Uploads</span>
        <span className="badge">Professional</span>
      </div>
    );
  }
  
  if (!hasIntegration('aws_s3')) {
    return (
      <div className="integration-required">
        <p>AWS S3 storage not configured</p>
        <button onClick={() => navigate('/settings/integrations')}>
          Configure Storage
        </button>
      </div>
    );
  }
  
  const s3Config = getIntegrationConfig('aws_s3');
  
  const handleUpload = async (file: File) => {
    // S3 is configured and active, proceed with upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workOrderId', workOrderId);
    formData.append('bucketName', s3Config.bucket_name);
    
    await fetch('/api/photos/upload', {
      method: 'POST',
      body: formData,
    });
  };
  
  return <S3PhotoUploader onUpload={handleUpload} />;
}
```

---

#### **Example 4: Navigation with Feature Badges**

```tsx
// src/components/DashboardNavigation.tsx
import { useTenant } from '../contexts/TenantContext';

function DashboardNavigation() {
  const { hasFeature, tenant } = useTenant();
  
  const navItems = [
    { 
      path: '/dashboard/work-orders', 
      label: 'Work Orders', 
      icon: WrenchIcon,
      feature: null 
    },
    { 
      path: '/dashboard/customers', 
      label: 'Customers', 
      icon: UsersIcon,
      feature: null 
    },
    { 
      path: '/dashboard/inventory', 
      label: 'Inventory', 
      icon: BoxIcon,
      feature: 'inventory_management',
      tier: 'Professional'
    },
    { 
      path: '/dashboard/reports', 
      label: 'Advanced Reports', 
      icon: ChartIcon,
      feature: 'advanced_reporting',
      tier: 'Professional'
    },
    { 
      path: '/dashboard/api', 
      label: 'API Access', 
      icon: CodeIcon,
      feature: 'api_access',
      tier: 'Growth'
    },
  ];
  
  return (
    <nav className="sidebar-nav">
      {navItems.map(item => {
        const isLocked = item.feature && !hasFeature(item.feature);
        
        return (
          <Link
            key={item.path}
            to={isLocked ? '#' : item.path}
            className={cn('nav-item', { 'opacity-50 cursor-not-allowed': isLocked })}
            onClick={(e) => {
              if (isLocked) {
                e.preventDefault();
                // Show upgrade modal
              }
            }}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {isLocked && (
              <span className="ml-auto badge badge-yellow">
                {item.tier}
              </span>
            )}
          </Link>
        );
      })}
      
      {/* Show current plan */}
      <div className="nav-footer">
        <div className="plan-badge">
          {tenant?.organization.is_founder && '⭐ '}
          {tenant?.organization.subscription_plan.toUpperCase()}
        </div>
      </div>
    </nav>
  );
}
```

---

#### **Example 5: Conditional Rendering Based on Tier**

```tsx
// src/components/WorkOrderDetail.tsx
import { useTenant } from '../contexts/TenantContext';

function WorkOrderDetail({ workOrderId }: { workOrderId: string }) {
  const { hasFeature, tenant } = useTenant();
  
  return (
    <div className="work-order-detail">
      <WorkOrderHeader workOrderId={workOrderId} />
      
      {/* Photos - Professional+ */}
      {hasFeature('digital_vehicle_inspections') && (
        <PhotoUploadSection workOrderId={workOrderId} />
      )}
      
      {/* Time Tracking - Professional+ */}
      {hasFeature('time_keeping') && (
        <TimeTrackingSection workOrderId={workOrderId} />
      )}
      
      {/* Technician Performance - Professional+ */}
      {hasFeature('technician_performance') && (
        <TechnicianMetrics workOrderId={workOrderId} />
      )}
      
      {/* Show upgrade prompts for locked features */}
      {!hasFeature('digital_vehicle_inspections') && (
        <FeatureUpsell 
          feature="digital_vehicle_inspections"
          title="Digital Vehicle Inspections"
          description="Upload photos and videos to document vehicle condition"
          requiredTier="Professional"
        />
      )}
    </div>
  );
}
```

---

### **Upgrade Prompt Component**

```tsx
// src/components/UpgradePrompt.tsx
import { useTenant } from '../contexts/TenantContext';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  feature: string;
  requiredTier: string;
  currentPrice?: string;
  upgradePrice?: string;
}

export function UpgradePrompt({ 
  feature, 
  requiredTier, 
  currentPrice = '$97/mo', 
  upgradePrice = '$197/mo' 
}: UpgradePromptProps) {
  const { tenant } = useTenant();
  const navigate = useNavigate();
  
  return (
    <div className="upgrade-prompt">
      <div className="icon">🔒</div>
      <h3>{feature}</h3>
      <p>This feature requires {requiredTier} plan or higher</p>
      
      <div className="pricing-comparison">
        <div className="current-plan">
          <span className="label">Current</span>
          <span className="tier">{tenant?.organization.subscription_plan}</span>
          <span className="price">{currentPrice}</span>
        </div>
        
        <div className="arrow">→</div>
        
        <div className="new-plan">
          <span className="label">Upgrade to</span>
          <span className="tier">{requiredTier}</span>
          <span className="price">{upgradePrice}</span>
        </div>
      </div>
      
      <div className="actions">
        <button 
          onClick={() => navigate('/settings/billing/upgrade')}
          className="btn-primary"
        >
          Upgrade Now
        </button>
        <button 
          onClick={() => navigate('/pricing')}
          className="btn-secondary"
        >
          Compare Plans
        </button>
      </div>
    </div>
  );
}
```

---

### **Integration Configuration Prompt**

```tsx
// src/components/ConfigureIntegrationPrompt.tsx
import { useNavigate } from 'react-router-dom';

interface ConfigureIntegrationPromptProps {
  integration: string;
  description: string;
  docsLink?: string;
}

export function ConfigureIntegrationPrompt({ 
  integration, 
  description,
  docsLink 
}: ConfigureIntegrationPromptProps) {
  const navigate = useNavigate();
  
  return (
    <div className="integration-prompt">
      <div className="icon">⚙️</div>
      <h3>{integration} Not Configured</h3>
      <p>{description}</p>
      
      <div className="actions">
        <button 
          onClick={() => navigate('/settings/integrations')}
          className="btn-primary"
        >
          Configure {integration}
        </button>
        {docsLink && (
          <a 
            href={docsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            View Documentation
          </a>
        )}
      </div>
    </div>
  );
}
```

---

### **Real-Time Feature Updates**

Subscribe to database changes to update features in real-time when admin changes settings:

```tsx
// Add to TenantProvider
useEffect(() => {
  if (!profile?.organization_id) return;
  
  // Subscribe to organization_features changes
  const featuresSubscription = supabase
    .channel('organization_features_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'organization_features',
        filter: `organization_id=eq.${profile.organization_id}`,
      },
      (payload) => {
        console.log('Feature changed:', payload);
        refreshTenant(); // Reload features
      }
    )
    .subscribe();
  
  // Subscribe to organization_integrations changes
  const integrationsSubscription = supabase
    .channel('organization_integrations_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'organization_integrations',
        filter: `organization_id=eq.${profile.organization_id}`,
      },
      (payload) => {
        console.log('Integration changed:', payload);
        refreshTenant(); // Reload integrations
      }
    )
    .subscribe();
  
  return () => {
    featuresSubscription.unsubscribe();
    integrationsSubscription.unsubscribe();
  };
}, [profile?.organization_id]);
```

---

## 🎯 Feature Enablement Matrix

### **Complete Feature Configuration**

```typescript
// src/config/featureConfig.ts

// Feature Configuration with Dependencies
export const FEATURE_CONFIG = {
  // Tier: Starter ($97/month, 2 users)
  STARTER: {
    tier: 'starter',
    monthlyPrice: 97,
    userLimit: 2,
    features: {
      customer_management: { enabled: true, dependencies: [] },
      vehicle_history: { enabled: true, dependencies: [] },
      basic_invoicing: { enabled: true, dependencies: [] },
      appointment_scheduling: { enabled: true, dependencies: [] },
      email_support: { enabled: true, dependencies: ['sendgrid'] },
      mobile_app_access: { enabled: true, dependencies: [] },
      basic_reporting: { enabled: true, dependencies: [] }
    }
  },

  // Tier: Professional ($197/month, 3 users)
  PROFESSIONAL: {
    tier: 'professional',
    monthlyPrice: 197,
    userLimit: 3,
    features: {
      // Inherits all Starter features
      customer_management: { enabled: true, dependencies: [] },
      vehicle_history: { enabled: true, dependencies: [] },
      basic_invoicing: { enabled: true, dependencies: [] },
      appointment_scheduling: { enabled: true, dependencies: [] },
      email_support: { enabled: true, dependencies: ['sendgrid'] },
      mobile_app_access: { enabled: true, dependencies: [] },
      basic_reporting: { enabled: true, dependencies: [] },
      // Professional-specific features
      inventory_management: { enabled: true, dependencies: [] },
      advanced_reporting: { enabled: true, dependencies: [] },
      sms_notifications: { enabled: true, dependencies: ['twilio'] },
      digital_vehicle_inspections: { enabled: true, dependencies: ['aws_s3'] },
      priority_phone_support: { enabled: true, dependencies: [] },
      custom_branding: { enabled: true, dependencies: [] },
      technician_performance: { enabled: true, dependencies: [] },
      time_keeping: { enabled: true, dependencies: [] }
    }
  },

  // Tier: Growth ($347/month, unlimited users)
  GROWTH: {
    tier: 'growth',
    monthlyPrice: 347,
    userLimit: null, // unlimited
    features: {
      // Inherits all Professional features
      customer_management: { enabled: true, dependencies: [] },
      vehicle_history: { enabled: true, dependencies: [] },
      basic_invoicing: { enabled: true, dependencies: [] },
      appointment_scheduling: { enabled: true, dependencies: [] },
      email_support: { enabled: true, dependencies: ['sendgrid'] },
      mobile_app_access: { enabled: true, dependencies: [] },
      basic_reporting: { enabled: true, dependencies: [] },
      inventory_management: { enabled: true, dependencies: [] },
      advanced_reporting: { enabled: true, dependencies: [] },
      sms_notifications: { enabled: true, dependencies: ['twilio'] },
      digital_vehicle_inspections: { enabled: true, dependencies: ['aws_s3'] },
      priority_phone_support: { enabled: true, dependencies: [] },
      custom_branding: { enabled: true, dependencies: [] },
      technician_performance: { enabled: true, dependencies: [] },
      time_keeping: { enabled: true, dependencies: [] },
      // Growth-specific features
      multi_location_support: { enabled: true, dependencies: [] },
      advanced_inventory_controls: { enabled: true, dependencies: [] },
      custom_workflows: { enabled: true, dependencies: [] },
      api_access: { enabled: true, dependencies: ['api_keys_service'] },
      dedicated_account_manager: { enabled: true, dependencies: [] },
      advanced_security: { enabled: true, dependencies: ['2fa_service'] },
      custom_integrations: { enabled: true, dependencies: ['zapier', 'webhooks'] }
    }
  },

  // Tier: Enterprise (Custom pricing, unlimited users)
  ENTERPRISE: {
    tier: 'enterprise',
    monthlyPrice: null, // custom
    userLimit: null, // unlimited
    features: {
      // Inherits all Growth features + Enterprise-specific
      customer_management: { enabled: true, dependencies: [] },
      vehicle_history: { enabled: true, dependencies: [] },
      basic_invoicing: { enabled: true, dependencies: [] },
      appointment_scheduling: { enabled: true, dependencies: [] },
      email_support: { enabled: true, dependencies: ['sendgrid'] },
      mobile_app_access: { enabled: true, dependencies: [] },
      basic_reporting: { enabled: true, dependencies: [] },
      inventory_management: { enabled: true, dependencies: [] },
      advanced_reporting: { enabled: true, dependencies: [] },
      sms_notifications: { enabled: true, dependencies: ['twilio'] },
      digital_vehicle_inspections: { enabled: true, dependencies: ['aws_s3'] },
      priority_phone_support: { enabled: true, dependencies: [] },
      custom_branding: { enabled: true, dependencies: [] },
      technician_performance: { enabled: true, dependencies: [] },
      time_keeping: { enabled: true, dependencies: [] },
      multi_location_support: { enabled: true, dependencies: [] },
      advanced_inventory_controls: { enabled: true, dependencies: [] },
      custom_workflows: { enabled: true, dependencies: [] },
      api_access: { enabled: true, dependencies: ['api_keys_service'] },
      dedicated_account_manager: { enabled: true, dependencies: [] },
      advanced_security: { enabled: true, dependencies: ['2fa_service'] },
      custom_integrations: { enabled: true, dependencies: ['zapier', 'webhooks'] },
      // Enterprise-specific features
      white_label: { enabled: true, dependencies: ['custom_domain', 'custom_branding_advanced'] },
      custom_development: { enabled: true, dependencies: [] },
      on_premise_deployment: { enabled: true, dependencies: ['docker', 'kubernetes'] },
      sla_guarantee: { enabled: true, dependencies: ['monitoring_service', 'pagerduty'] },
      premium_support_24_7: { enabled: true, dependencies: ['zendesk_enterprise'] },
      dedicated_infrastructure: { enabled: true, dependencies: ['aws_dedicated'] },
      training_consulting: { enabled: true, dependencies: [] }
    }
  },

  // Tier: Founder ($7,500 one-time, unlimited users)
  FOUNDER: {
    tier: 'founder',
    monthlyPrice: 0, // one-time payment of $7,500
    userLimit: null, // unlimited
    features: {
      // Gets ALL Enterprise features + lifetime access
      ...ENTERPRISE.features
    }
  }
};

// Integration/Service Dependencies Map
export const INTEGRATION_DEPENDENCIES = {
  // Communication
  twilio: {
    service: 'Twilio',
    purpose: 'SMS notifications',
    config_required: ['account_sid', 'auth_token', 'phone_number'],
    cost_type: 'usage_based',
    enabled_tiers: ['professional', 'growth', 'enterprise', 'founder']
  },
  sendgrid: {
    service: 'SendGrid',
    purpose: 'Email delivery',
    config_required: ['api_key', 'sender_email'],
    cost_type: 'usage_based',
    enabled_tiers: ['starter', 'professional', 'growth', 'enterprise', 'founder']
  },

  // Storage & Media
  aws_s3: {
    service: 'AWS S3',
    purpose: 'File storage for inspections/photos',
    config_required: ['bucket_name', 'access_key', 'secret_key', 'region'],
    cost_type: 'usage_based',
    enabled_tiers: ['professional', 'growth', 'enterprise', 'founder']
  },

  // Accounting Integration
  digits_api: {
    service: 'Digits',
    purpose: 'Accounting integration',
    config_required: ['api_key', 'organization_id'],
    cost_type: 'per_connection',
    tiers: ['basic', 'professional', 'enterprise'], // Digits' 3-tier offering
    enabled_tiers: ['professional', 'growth', 'enterprise', 'founder']
  },

  // Payment Processing
  dejavoo_ipospays: {
    service: 'Dejavoo/iPOSpays',
    purpose: 'Payment processing',
    config_required: ['master_tpn', 'merchant_id', 'terminal_id'],
    cost_type: 'per_transaction',
    enabled_tiers: ['starter', 'professional', 'growth', 'enterprise', 'founder']
  },
  factor4_gift: {
    service: 'Factor4',
    purpose: 'Gift card processing',
    config_required: ['merchant_id', 'api_key'],
    cost_type: 'per_transaction',
    enabled_tiers: ['professional', 'growth', 'enterprise', 'founder']
  },

  // Parts & Inventory
  partstech_api: {
    service: 'PartsTech',
    purpose: 'Parts ordering integration',
    config_required: ['api_key', 'shop_id'],
    cost_type: 'per_transaction', // TBD
    enabled_tiers: ['professional', 'growth', 'enterprise', 'founder']
  },

  // Payroll
  honkamp_payroll: {
    service: 'Honkamp Payroll',
    purpose: 'Payroll integration',
    config_required: ['company_id', 'api_key'],
    cost_type: 'per_connection', // Base cost TBD + Honkamp bills separately
    enabled_tiers: ['professional', 'growth', 'enterprise', 'founder']
  },

  // Developer Tools
  api_keys_service: {
    service: 'API Key Management',
    purpose: 'Generate and manage API keys',
    config_required: [],
    cost_type: 'included',
    enabled_tiers: ['growth', 'enterprise', 'founder']
  },
  webhooks: {
    service: 'Webhook System',
    purpose: 'Real-time event notifications',
    config_required: [],
    cost_type: 'included',
    enabled_tiers: ['growth', 'enterprise', 'founder']
  },
  zapier: {
    service: 'Zapier',
    purpose: 'Third-party integrations',
    config_required: ['zapier_api_key'],
    cost_type: 'usage_based',
    enabled_tiers: ['growth', 'enterprise', 'founder']
  },

  // Security & Support
  '2fa_service': {
    service: 'Two-Factor Authentication',
    purpose: 'Enhanced security',
    config_required: [],
    cost_type: 'included',
    enabled_tiers: ['growth', 'enterprise', 'founder']
  },
  zendesk_enterprise: {
    service: 'Zendesk',
    purpose: 'Premium support ticketing',
    config_required: ['subdomain', 'api_token'],
    cost_type: 'per_agent',
    enabled_tiers: ['enterprise', 'founder']
  },
  monitoring_service: {
    service: 'DataDog/New Relic',
    purpose: 'Infrastructure monitoring',
    config_required: ['api_key'],
    cost_type: 'flat_fee',
    enabled_tiers: ['enterprise', 'founder']
  },
  pagerduty: {
    service: 'PagerDuty',
    purpose: 'Incident alerting',
    config_required: ['integration_key'],
    cost_type: 'per_user',
    enabled_tiers: ['enterprise', 'founder']
  },

  // Enterprise Infrastructure
  custom_domain: {
    service: 'Custom Domain',
    purpose: 'White-label domain',
    config_required: ['domain', 'ssl_cert'],
    cost_type: 'one_time_setup',
    enabled_tiers: ['enterprise', 'founder']
  },
  custom_branding_advanced: {
    service: 'Advanced Custom Branding',
    purpose: 'Full white-label UI customization',
    config_required: [],
    cost_type: 'included',
    enabled_tiers: ['enterprise', 'founder']
  },
  aws_dedicated: {
    service: 'AWS Dedicated Resources',
    purpose: 'Isolated infrastructure',
    config_required: ['vpc_id', 'instance_type'],
    cost_type: 'monthly_fixed',
    enabled_tiers: ['enterprise', 'founder']
  },
  docker: {
    service: 'Docker',
    purpose: 'Containerization',
    config_required: [],
    cost_type: 'included',
    enabled_tiers: ['enterprise', 'founder']
  },
  kubernetes: {
    service: 'Kubernetes',
    purpose: 'Container orchestration',
    config_required: ['cluster_config'],
    cost_type: 'infrastructure_cost',
    enabled_tiers: ['enterprise', 'founder']
  }
};

// Helper function to check if feature is enabled for tier
export const isFeatureEnabled = (tier: string, feature: string): boolean => {
  const tierConfig = FEATURE_CONFIG[tier.toUpperCase()];
  return tierConfig?.features[feature]?.enabled ?? false;
};

// Helper function to get feature dependencies
export const getFeatureDependencies = (tier: string, feature: string): string[] => {
  const tierConfig = FEATURE_CONFIG[tier.toUpperCase()];
  return tierConfig?.features[feature]?.dependencies ?? [];
};

// Helper function to check if all dependencies are configured
export const areDependenciesConfigured = (
  organization: any,
  dependencies: string[]
): boolean => {
  return dependencies.every(dep => {
    const integration = INTEGRATION_DEPENDENCIES[dep];
    if (!integration) return true; // No config required
    
    // Check if all required config keys are present in organization settings
    return integration.config_required.every(key => {
      return organization.integration_configs?.[dep]?.[key] != null;
    });
  });
};
```

---

## 🛡️ Feature Gate Implementation

### **React Hook: useFeatureAccess (Enhanced)**
```tsx
// src/hooks/useFeatureAccess.ts
import { useOrganization } from '../contexts/OrganizationContext';
import { 
  FEATURE_CONFIG, 
  INTEGRATION_DEPENDENCIES,
  isFeatureEnabled,
  getFeatureDependencies,
  areDependenciesConfigured
} from '../config/featureConfig';

type Feature = keyof typeof FEATURE_CONFIG.STARTER.features;
type AddOn = 'quickbooks_async' | 'partstech' | 'digits_ai' | 'honkamp_payroll';

export const useFeatureAccess = () => {
  const { organization } = useOrganization();
  
  const hasFeature = (feature: Feature): boolean => {
    // Check if feature is enabled for this tier
    if (!isFeatureEnabled(organization.subscription_plan, feature)) {
      return false;
    }
    
    // Check if all dependencies are configured
    const dependencies = getFeatureDependencies(organization.subscription_plan, feature);
    return areDependenciesConfigured(organization, dependencies);
  };
  
  const hasAddOn = (addon: AddOn): boolean => {
    return organization[`addon_${addon}`] === true;
  };
  
  const canAddUser = (): boolean => {
    const tierConfig = FEATURE_CONFIG[organization.subscription_plan.toUpperCase()];
    if (!tierConfig) return false;
    
    const limit = tierConfig.userLimit;
    if (limit === null) return true; // unlimited
    
    return organization.current_user_count < limit;
  };
  
  const getUserLimit = (): number | null => {
    const tierConfig = FEATURE_CONFIG[organization.subscription_plan.toUpperCase()];
    return tierConfig?.userLimit ?? null;
  };
  
  const canAddCustomer = (): boolean => {
    // No customer limits across any tier
    return true;
  };
  
  const canCreateWorkOrder = (): boolean => {
    // No work order limits across any tier
    return true;
  };
  
  const getMissingDependencies = (feature: Feature): string[] => {
    const dependencies = getFeatureDependencies(organization.subscription_plan, feature);
    
    return dependencies.filter(dep => {
      const integration = INTEGRATION_DEPENDENCIES[dep];
      if (!integration) return false;
      
      return !integration.config_required.every(key => {
        return organization.integration_configs?.[dep]?.[key] != null;
      });
    });
  };
  
  const showUpgradePrompt = (feature: Feature) => {
    // Find minimum tier that has this feature
    const availableTiers = Object.entries(FEATURE_CONFIG)
      .filter(([_, config]) => config.features[feature]?.enabled)
      .map(([tier, config]) => ({ tier, price: config.monthlyPrice }));
    
    const lowestTier = availableTiers[0];
    
    // Show modal: "Upgrade to {tier} to unlock this feature"
    // With pricing comparison and "Upgrade Now" button
  };
  
  const showDependencyPrompt = (feature: Feature) => {
    const missing = getMissingDependencies(feature);
    
    // Show modal: "This feature requires configuration"
    // List missing integrations with setup instructions
  };
  
  return {
    hasFeature,
    hasAddOn,
    canAddUser,
    getUserLimit,
    canAddCustomer,
    canCreateWorkOrder,
    getMissingDependencies,
    showUpgradePrompt,
    showDependencyPrompt,
    organization,
  };
};
```

---

## 📊 Feature Comparison Table

| Feature | Starter<br/>$97 | Professional<br/>$197 | Growth<br/>$347 | Enterprise<br/>Custom | Founder<br/>$7,500 |
|---------|:---------------:|:---------------------:|:---------------:|:---------------------:|:------------------:|
| **Users** | 2 | 3 | Unlimited | Unlimited | Unlimited |
| **Core Features** | | | | | |
| Customer Management | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vehicle History | ✅ | ✅ | ✅ | ✅ | ✅ |
| Basic Invoicing | ✅ | ✅ | ✅ | ✅ | ✅ |
| Appointment Scheduling | ✅ | ✅ | ✅ | ✅ | ✅ |
| Email Support | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mobile App Access | ✅ | ✅ | ✅ | ✅ | ✅ |
| Basic Reporting | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Professional Features** | | | | | |
| Time-Keeping | ❌ | ✅ | ✅ | ✅ | ✅ |
| Inventory Management | ❌ | ✅ | ✅ | ✅ | ✅ |
| Advanced Reporting | ❌ | ✅ | ✅ | ✅ | ✅ |
| SMS Notifications | ❌ | ✅ | ✅ | ✅ | ✅ |
| Digital Vehicle Inspections | ❌ | ✅ | ✅ | ✅ | ✅ |
| Priority Phone Support | ❌ | ✅ | ✅ | ✅ | ✅ |
| Custom Branding | ❌ | ✅ | ✅ | ✅ | ✅ |
| Technician Performance | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Growth Features** | | | | | |
| Multi-Location Support | ❌ | ❌ | ✅ | ✅ | ✅ |
| Advanced Inventory Controls | ❌ | ❌ | ✅ | ✅ | ✅ |
| Custom Workflows | ❌ | ❌ | ✅ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ | ✅ |
| Dedicated Account Manager | ❌ | ❌ | ✅ | ✅ | ✅ |
| Advanced Security (2FA) | ❌ | ❌ | ✅ | ✅ | ✅ |
| Custom Integrations | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Enterprise Features** | | | | | |
| White-Label | ❌ | ❌ | ❌ | ✅ | ✅ |
| Custom Development | ❌ | ❌ | ❌ | ✅ | ✅ |
| On-Premise Deployment | ❌ | ❌ | ❌ | ✅ | ✅ |
| SLA Guarantee | ❌ | ❌ | ❌ | ✅ | ✅ |
| 24/7 Premium Support | ❌ | ❌ | ❌ | ✅ | ✅ |
| Dedicated Infrastructure | ❌ | ❌ | ❌ | ✅ | ✅ |
| Training & Consulting | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 🔌 Integration Configuration Examples

### **Example: SMS Notifications (Twilio)**
```typescript
// In organization settings
{
  integration_configs: {
    twilio: {
      account_sid: 'ACxxxxxxxxxxxxx',
      auth_token: 'your_auth_token',
      phone_number: '+15551234567'
    }
  }
}
```

**Usage in Component:**
```tsx
const NotificationSettings = () => {
  const { hasFeature, getMissingDependencies } = useFeatureAccess();
  
  if (!hasFeature('sms_notifications')) {
    return <UpgradePrompt feature="sms_notifications" requiredTier="professional" />;
  }
  
  const missing = getMissingDependencies('sms_notifications');
  if (missing.includes('twilio')) {
    return <ConfigureIntegrationPrompt integration="twilio" />;
  }
  
  return <SMSNotificationSettings />; // Feature fully enabled
};
```

---

### **Example: Digital Vehicle Inspections (AWS S3)**
```typescript
// In organization settings
{
  integration_configs: {
    aws_s3: {
      bucket_name: 'overdryv-shop-photos',
      access_key: 'AKIAxxxxxxxxxxxxx',
      secret_key: 'your_secret_key',
      region: 'us-east-1'
    }
  }
}
```

**Photo Upload Component:**
```tsx
const PhotoUpload = ({ workOrderId }) => {
  const { hasFeature } = useFeatureAccess();
  
  if (!hasFeature('digital_vehicle_inspections')) {
    return (
      <div className="opacity-50">
        <span>📷 Photo Uploads</span>
        <span className="badge">Professional</span>
      </div>
    );
  }
  
  return <S3PhotoUploader workOrderId={workOrderId} />;
};
```

---

## 📋 Database Schema for Integration Configs

### **integration_configs table**
```sql
CREATE TABLE integration_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  integration_name text NOT NULL, -- 'twilio', 'aws_s3', 'digits_api', etc.
  config jsonb NOT NULL, -- Encrypted configuration values
  
  is_active boolean DEFAULT true,
  last_tested_at timestamptz,
  test_status text, -- 'success', 'failed', 'pending'
  test_error text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  
  UNIQUE(organization_id, integration_name)
);

-- Index for lookups
CREATE INDEX idx_integration_configs_org ON integration_configs(organization_id);

-- RLS: Only admins can manage integrations
CREATE POLICY "integration_admin_only"
  ON integration_configs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.organization_id = integration_configs.organization_id
      AND profiles.role IN ('admin', 'master_admin')
    )
  );
```

---

## 🎯 Implementation Checklist

### **Phase 0.1: Feature Configuration Setup**
- [ ] Create `src/config/featureConfig.ts` with FEATURE_CONFIG and INTEGRATION_DEPENDENCIES
- [ ] Update `useFeatureAccess` hook with dependency checking
- [ ] Create `integration_configs` table
- [ ] Build integration configuration UI for admins
- [ ] Add "Test Connection" functionality for each integration

### **Phase 0.2: User Limit Enforcement**
- [ ] Add user count tracking in organizations table
- [ ] Update `canAddUser()` to check tier limits
- [ ] Show "Upgrade" prompt when limit reached
- [ ] Block user creation at API level if limit exceeded

### **Phase 0.3: Feature UI Updates**
- [ ] Add feature badges to navigation (🔒 Professional, 🔒 Growth, etc.)
- [ ] Create feature comparison page
- [ ] Build upgrade flow modal
- [ ] Add "Configure Integration" prompts for missing dependencies

### **Phase 0.4: Integration Management**
- [ ] Build Twilio SMS integration
- [ ] Build AWS S3 photo storage
- [ ] Build SendGrid email integration
- [ ] Build Dejavoo payment processing
- [ ] Build PartsTech parts ordering (when pricing finalized)
- [ ] Build Digits AI accounting sync
- [ ] Build Honkamp payroll sync (when pricing finalized)

---

## 🛡️ Feature Gate Implementation
```tsx
// Example: Photo uploads feature
import { useFeatureAccess } from '../../hooks/useFeatureAccess';

const WorkOrderDetail = () => {
  const { hasFeature, showUpgradePrompt } = useFeatureAccess();
  
  const handlePhotoUpload = () => {
    if (!hasFeature('photo_uploads')) {
      showUpgradePrompt('photo_uploads');
      return;
    }
    
    // Proceed with upload
    uploadPhoto();
  };
  
  return (
    <div>
      {hasFeature('photo_uploads') ? (
        <button onClick={handlePhotoUpload}>Upload Photo</button>
      ) : (
        <button 
          onClick={() => showUpgradePrompt('photo_uploads')}
          className="opacity-50 cursor-not-allowed"
        >
          Upload Photo 🔒
          <span className="text-xs">Pro</span>
        </button>
      )}
    </div>
  );
};
```

---

### **Navigation with Feature Badges**
```tsx
// src/components/dashboard/DashboardNavigation.tsx
const DashboardNavigation = () => {
  const { hasFeature } = useFeatureAccess();
  
  const navItems = [
    { path: '/dashboard/work-orders', label: 'Work Orders', tier: null },
    { path: '/dashboard/estimates', label: 'Estimates', tier: null },
    { path: '/dashboard/customers', label: 'Customers', tier: null },
    { path: '/dashboard/vehicles', label: 'Vehicles', tier: null },
    { 
      path: '/dashboard/inventory', 
      label: 'Inventory', 
      tier: 'professional',
      feature: 'inventory_management' 
    },
    { 
      path: '/dashboard/reports', 
      label: 'Reports', 
      tier: 'growth',
      feature: 'advanced_reports' 
    },
  ];
  
  return (
    <nav>
      {navItems.map(item => {
        const isLocked = item.feature && !hasFeature(item.feature);
        
        return (
          <Link
            to={isLocked ? '#' : item.path}
            className={isLocked ? 'opacity-50' : ''}
          >
            {item.label}
            {isLocked && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {item.tier?.toUpperCase()}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
```

---

---

## 🕐 Time-Keeping Feature Requirements

**Available:** Professional tier and above  
**Core Requirement:** Must be available WITH or WITHOUT Honkamp Payroll integration

### **Functionality:**

**Tech Clock In/Out:**
```
1. Tech opens work order
2. Clicks "Start Work" → Records clock_in timestamp
3. Works on vehicle
4. Clicks "End Work" → Records clock_out timestamp
5. System calculates labor_hours automatically
```

**Database Schema:**
```sql
CREATE TABLE work_order_time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  technician_id uuid NOT NULL REFERENCES profiles(id),
  
  clock_in timestamptz NOT NULL,
  clock_out timestamptz,
  
  -- Auto-calculated labor hours
  labor_hours numeric GENERATED ALWAYS AS (
    CASE 
      WHEN clock_out IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600 
      ELSE NULL 
    END
  ) STORED,
  
  notes text, -- Optional notes about the work performed
  
  organization_id uuid NOT NULL REFERENCES organizations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for work order lookups
CREATE INDEX idx_time_entries_work_order ON work_order_time_entries(work_order_id);
CREATE INDEX idx_time_entries_technician ON work_order_time_entries(technician_id);

-- RLS: Only Professional+ tiers
CREATE POLICY "time_keeping_access"
  ON work_order_time_entries FOR ALL
  TO authenticated
  USING (
    (SELECT subscription_plan FROM organizations WHERE id = organization_id)
    IN ('professional', 'growth', 'enterprise', 'founder')
  );
```

**UI Components:**

**In Work Order Detail:**
```tsx
// Button for tech to clock in/out
{hasFeature('time_keeping') && (
  <div className="time-tracking-section">
    {!activeTimeEntry ? (
      <button onClick={handleClockIn}>
        🕐 Start Work
      </button>
    ) : (
      <button onClick={handleClockOut}>
        ⏸️ End Work (Elapsed: {elapsedTime})
      </button>
    )}
    
    {/* Show time entry history */}
    <TimeEntryLog workOrderId={workOrder.id} />
  </div>
)}
```

**Labor Cost Calculation:**
```tsx
// In invoice/estimate
const totalLaborHours = timeEntries.reduce((sum, entry) => sum + entry.labor_hours, 0);
const laborCost = totalLaborHours * shopHourlyRate; // From organization settings

// Display on invoice
Labor: {totalLaborHours} hours @ ${shopHourlyRate}/hr = ${laborCost}
```

**Reporting:**
```
Admin can see:
- Total labor hours per technician (day/week/month)
- Average time per work order type
- Labor efficiency metrics
- Technician productivity comparison
```

**Integration with Honkamp Payroll:**
- When Honkamp add-on enabled: Auto-sync time entries to Honkamp for payroll
- When disabled: Time-keeping still works for job costing and labor tracking
- Benefit: Accurate payroll without manual time card entry

---

## 💳 Billing & Payment Integration

### **Payment Gateways**

**Primary: Dejavoo iPOSpays**
- Integrated payment processing
- OverDryv payment portal
- PCI-compliant tokenization
- Support for terminal payments

**Alternative: ISO Partner Gateway (TBD)**
- Additional gateway option under evaluation
- To be determined based on partnership terms

**Subscription Billing:**
```
Product 1: OverDryv Starter
- Price: $49/month (recurring)

Product 2: OverDryv Professional
- Price: $149/month (recurring)

Product 3: OverDryv Growth
- Price: $299/month (recurring)

Product 4: OverDryv Enterprise
- Price: Custom (contact sales)

Add-On Products:
- QuickBooks Integration: $49/month
- Parts Ordering: $29/month
- Marketing Automation: $99/month
```

**Trial Configuration:**
- 14-day free trial
- Payment method required at signup
- Auto-charge at trial end
- Send reminder emails: 7 days before, 3 days before, 1 day before

---

### **Billing Events**
```tsx
// Handle payment gateway webhooks (Dejavoo or alternative)
export const handleBillingWebhook = async (event) => {
  switch (event.type) {
    case 'customer.subscription.created':
      // Onboarding completed, 14-day countdown starts
      await updateOrganization({ 
        subscription_status: 'active',
        first_billing_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      });
      break;
      
    case 'customer.subscription.updated':
      // Plan changed (upgrade/downgrade)
      await updateOrganization({ 
        subscription_plan: event.data.plan.id 
      });
      await logSubscriptionHistory('upgraded' or 'downgraded');
      break;
      
    case 'invoice.payment_succeeded':
      // Payment successful
      await recordPayment(event.data);
      break;
      
    case 'invoice.payment_failed':
      // Payment failed
      await updateOrganization({ subscription_status: 'past_due' });
      await sendPaymentFailedEmail();
      break;
      
    case 'customer.subscription.deleted':
      // Subscription cancelled
      await updateOrganization({ subscription_status: 'cancelled' });
      await disableOrganizationAccess();
      break;
  }
};
```

---

## 📊 Upgrade/Downgrade Flow

### **Upgrade Process**
```
User clicks "Upgrade to Professional"
    ↓
Show comparison modal:
  Current: Starter ($97/mo)
  New: Professional ($197/mo)
  
  You'll gain:
  ✅ Time-keeping for technicians
  ✅ Unlimited customers
  ✅ Photo uploads
  ✅ Inventory management
  ✅ SMS notifications
  
  You'll be charged:
  - Pro-rated amount: $75 (remaining 15 days)
  - Next billing: $197 on Feb 1, 2026
  
  [Cancel] [Upgrade Now]
    ↓
Process payment via Stripe
    ↓
Update organization.subscription_plan = 'professional'
    ↓
Update features in organization.features jsonb
    ↓
Log in subscription_history table
    ↓
Show success message
    ↓
Refresh page → New features now available
```

---

### **Downgrade Process**
```
User clicks "Downgrade to Starter"
    ↓
Show warning modal:
  Current: Professional ($197/mo)
  New: Starter ($97/mo)
  
  You'll lose:
  ❌ Time-keeping for technicians
  ❌ Photo uploads
  ❌ Inventory management
  ❌ SMS notifications
  
  Your data will be preserved but not accessible.
  You can upgrade anytime to restore access.
  
  Change takes effect: Feb 1, 2026 (next billing cycle)
  
  [Cancel] [Continue Downgrade]
    ↓
Schedule downgrade in Stripe (end of billing period)
    ↓
Update organization.subscription_plan_scheduled = 'starter'
    ↓
Log in subscription_history table
    ↓
Show confirmation: "Your plan will change to Starter on Feb 1"
    ↓
Send email reminder 3 days before change
```

---

## 🔄 Usage Tracking System

### **Track Usage Automatically**
```sql
-- Trigger: Track storage usage
CREATE OR REPLACE FUNCTION track_storage_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE organizations
  SET current_storage_bytes = current_storage_bytes + NEW.file_size
  WHERE id = NEW.organization_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Count total work orders (for analytics, not limits)
CREATE OR REPLACE FUNCTION track_work_order_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE organizations
  SET current_work_orders_total = current_work_orders_total + 1
  WHERE id = NEW.organization_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 🚨 Enforcement Points

**Philosophy:** We limit by FEATURES, not by volume (work orders, customers, etc.)

### **1. At UI Level (Graceful)**
```tsx
// Show upgrade prompt, lock features
if (!hasFeature('time_keeping')) {
  return <UpgradePrompt feature="time_keeping" requiredTier="professional" />;
}
```

### **2. At API Level (Hard Block)**
```tsx
// In API route - prevent feature usage
if (!organization.features.photo_uploads) {
  throw new Error('Photo uploads require Professional plan or higher.');
}
```

### **3. At Database Level (Schema)**
```sql
-- Time entries only for Professional+
CREATE TABLE work_order_time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES work_orders(id),
  technician_id uuid REFERENCES profiles(id),
  clock_in timestamptz NOT NULL,
  clock_out timestamptz,
  labor_hours numeric GENERATED ALWAYS AS 
    (EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600) STORED,
  organization_id uuid REFERENCES organizations(id),
  
  created_at timestamptz DEFAULT now()
);

-- RLS: Only accessible to Professional+ tiers
CREATE POLICY "time_keeping_professional_plus"
  ON work_order_time_entries FOR ALL
  TO authenticated
  USING (
    (SELECT subscription_plan FROM organizations WHERE id = organization_id)
    IN ('professional', 'growth', 'enterprise', 'founder')
  );
```

---

## 📈 Analytics & Reporting

### **Admin Dashboard Metrics**
```
Subscription Health:
- Total MRR (Monthly Recurring Revenue)
- Total active organizations by tier
- Trial conversion rate
- Churn rate by tier
- Average revenue per user (ARPU)

Usage Metrics:
- Organizations approaching limits
- Feature adoption rates
- Add-on attachment rates
- Storage usage by tier
```

---

## ✅ Integration with MVP Migration Plan

### **Updated Phase Structure:**

**Phase 0: Subscription Architecture (NEW - 1 Day)**
1. Update organizations table schema
2. Create subscription_history table
3. Create usage_tracking table
4. Implement useFeatureAccess hook
5. Build onboarding flow
6. Integrate Stripe
7. Create upgrade/downgrade UI

**Phase 1: Database Setup + Work Orders (Day 2)**
- Same as original plan
- Add organization_id filters
- Add feature checks for photo uploads

**Phase 2-6: Continue as planned**
- All components now check feature access
- All queries include organization_id
- Usage tracking runs automatically

---

## 🎯 Success Criteria

Before proceeding with multi-tenant migration:
- [ ] Subscription tiers defined in database
- [ ] Feature flags system working
- [ ] Onboarding flow functional
- [ ] Stripe integration complete
- [ ] Usage tracking operational
- [ ] Upgrade/downgrade flows tested
- [ ] All limits enforced at UI and API

---

## 💭 Open Questions for Discussion

1. **PartsTech Pricing:** What's the cost basis? Per transaction, monthly flat fee, or percentage?
2. **Honkamp Integration Base Cost:** What's our integration fee? How does their billing flow?
4. **Founder Units Delivery:** How do we validate $7500 payment? One-time Dejavoo transaction?
5. **ISO Partner Gateway:** Which partner? What's their fee structure vs Dejavoo?
6. **Grace Period:** How long after failed payment before suspension? (Recommend 7 days)
7. **Data Retention:** Keep data after cancellation? For how long? (Recommend 90 days)
8. **Time-Keeping Detail:** Should techs clock in/out via mobile app? Web only? Both?
9. **Multi-Location:** Growth tier gets 2 locations - how do we define "location"? Separate physical address?
10. **Enterprise Custom Pricing:** Minimum seats? Minimum commitment? Custom contracts?

---

**Next Step:** Review this architecture, then I'll update the MVP Migration Plan to include Phase 0 (Subscriptions) before Phase 1 (Database migration).

**Document Version:** 1.0  
**Last Updated:** January 13, 2026

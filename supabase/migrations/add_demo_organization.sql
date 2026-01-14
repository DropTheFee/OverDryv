-- =====================================================
-- Add Demo Organization with Subdomain
-- =====================================================

-- Upsert demo organization using subdomain as conflict target
INSERT INTO organizations (
  id,
  subdomain,
  name,
  legal_name,
  billing_email,
  subscription_plan,
  subscription_status,
  monthly_price,
  user_limit,
  is_founder,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'demo',
  'Demo Auto Shop',
  'Demo Auto Shop LLC',
  'demo@overdryv.io',
  'professional',
  'active',
  197.00,
  5,
  false,
  now(),
  now()
) ON CONFLICT (subdomain) DO UPDATE SET
  name = EXCLUDED.name,
  legal_name = EXCLUDED.legal_name,
  billing_email = EXCLUDED.billing_email,
  subscription_plan = EXCLUDED.subscription_plan,
  subscription_status = EXCLUDED.subscription_status,
  monthly_price = EXCLUDED.monthly_price,
  user_limit = EXCLUDED.user_limit,
  is_founder = EXCLUDED.is_founder,
  updated_at = now();

-- Update existing demo user to link to this organization
UPDATE profiles 
SET organization_id = (SELECT id FROM organizations WHERE subdomain = 'demo')
WHERE email = 'demo@overdryv.io';

-- Initialize features for demo organization (Professional tier)
-- Note: Excludes features requiring integrations (email_support, email_notifications, photo_uploads, digital_vehicle_inspections)
INSERT INTO organization_features (organization_id, feature_key, enabled, enabled_at)
SELECT 
  (SELECT id FROM organizations WHERE subdomain = 'demo'),
  feature_key,
  true,
  now()
FROM (VALUES
  ('customer_management'),
  ('vehicle_history'),
  ('basic_invoicing'),
  ('appointment_scheduling'),
  ('mobile_app_access'),
  ('basic_reporting'),
  ('customer_portal'),
  ('dual_pricing'),
  ('quickbooks_oneway'),
  ('time_keeping'),
  ('inventory_management'),
  ('advanced_reporting'),
  ('priority_phone_support'),
  ('customer_appointment_reminders'),
  ('digital_waivers')
) AS features(feature_key)
ON CONFLICT (organization_id, feature_key) DO NOTHING;

-- Log the setup
DO $$
BEGIN
  RAISE NOTICE '✅ Demo organization created with subdomain: demo';
  RAISE NOTICE '✅ Demo user linked to organization';
  RAISE NOTICE '✅ Professional tier features enabled';
  RAISE NOTICE '';
  RAISE NOTICE 'Test locally: http://localhost:5173/login?org=demo';
  RAISE NOTICE 'Test production: https://demo.overdryv.app/login';
END $$;

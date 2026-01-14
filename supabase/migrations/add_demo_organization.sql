-- =====================================================
-- Add Demo Organization with Subdomain
-- =====================================================

-- Insert demo organization
INSERT INTO organizations (
  id,
  subdomain,
  name,
  legal_name,
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
  'professional',
  'active',
  197.00,
  5,
  false,
  now(),
  now()
) ON CONFLICT (subdomain) DO UPDATE SET
  name = EXCLUDED.name,
  subscription_plan = EXCLUDED.subscription_plan,
  subscription_status = EXCLUDED.subscription_status,
  updated_at = now();

-- Update existing demo user to link to this organization
UPDATE profiles 
SET organization_id = '00000000-0000-0000-0000-000000000001'::uuid
WHERE email = 'demo@overdryv.io';

-- Initialize features for demo organization (Professional tier)
INSERT INTO organization_features (organization_id, feature_key, enabled, enabled_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'customer_management', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'vehicle_history', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'basic_invoicing', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'appointment_scheduling', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'email_support', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'mobile_app_access', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'basic_reporting', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'customer_portal', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'email_notifications', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'dual_pricing', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'quickbooks_oneway', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'time_keeping', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'inventory_management', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'advanced_reporting', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'photo_uploads', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'digital_vehicle_inspections', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'priority_phone_support', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'customer_appointment_reminders', true, now()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'digital_waivers', true, now())
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

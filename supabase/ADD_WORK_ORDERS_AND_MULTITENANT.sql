-- =====================================================
-- COMPLETE DATABASE FIX WITH WORK ORDERS
-- Run this in Supabase SQL Editor
-- =====================================================

-- ============================================
-- 1. ADD WORK ORDERS DEMO DATA
-- ============================================

-- Clear existing work order service items
DELETE FROM service_items WHERE work_order_id IS NOT NULL;
-- Clear existing work orders
DELETE FROM work_orders;

-- Insert Work Order 1: Oil Change - In Progress
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes)
SELECT 
  p.id, v.id, 'in_progress', 'Oil Change & Filter',
  'Synthetic oil change, oil filter replacement, fluid level check, tire pressure check',
  NOW() + INTERVAL '2 hours', 89.99, 'normal',
  'Customer requested synthetic oil. Using Mobil 1 5W-30.'
FROM profiles p JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

-- Service items for Work Order 1
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Oil Change Service', 1, 29.99
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Mobil 1 Synthetic Oil 5W-30 (5 Quarts)', 5, 8.99
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Oil Filter', 1, 14.99
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'fee', 'Shop Supplies', 1, 5.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

-- Insert Work Order 2: Brake Service - Quality Check
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes)
SELECT 
  p.id, v.id, 'quality_check', 'Brake Service',
  'Front brake pad replacement, rotor resurfacing, brake fluid flush, system inspection',
  NOW() + INTERVAL '1 hour', 385.50, 'high',
  'Front pads at 15% remaining. Rotors within spec for resurfacing.'
FROM profiles p JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

-- Service items for Work Order 2
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Brake Pad Replacement (Front)', 1, 120.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Rotor Resurfacing', 1, 60.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Brake Fluid Flush', 1, 50.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Brake Pads (Front Set)', 1, 89.99
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Brake Fluid (DOT 3)', 2, 12.99
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'fee', 'Shop Supplies', 1, 15.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

-- Insert Work Order 3: Engine Diagnostics - Completed
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, actual_completion, total_amount, priority, notes)
SELECT 
  p.id, v.id, 'completed', 'Engine Diagnostics',
  'Check engine light diagnosis, scan for DTCs, visual inspection, recommend repairs',
  NOW() - INTERVAL '3 days', 150.00, 'urgent',
  'Code P0420 - Catalytic converter efficiency below threshold. Recommend replacement.'
FROM profiles p JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'mike.chen@email.com' AND v.vin = '2HGFC2F59MH567890';

-- Service items for Work Order 3
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Engine Diagnostics & Scan', 1, 150.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'mike.chen@email.com' AND v.vin = '2HGFC2F59MH567890';

-- Insert Work Order 4: Tire Rotation - Completed
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, actual_completion, total_amount, priority, notes)
SELECT 
  p.id, v.id, 'completed', 'Tire Rotation',
  '4-wheel tire rotation, balance check, pressure adjustment, tread depth measurement',
  NOW() - INTERVAL '5 days', 65.00, 'normal',
  'All tires in good condition. Tread depth 7/32" all around.'
FROM profiles p JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'lisa.johnson@email.com' AND v.vin = '1C4RJFAG3EC789012';

-- Service items for Work Order 4
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Tire Rotation & Balance', 1, 65.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'lisa.johnson@email.com' AND v.vin = '1C4RJFAG3EC789012';

-- Insert Work Order 5: A/C Service - Pending
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes)
SELECT 
  p.id, v.id, 'pending', 'A/C Service',
  'A/C system diagnosis, refrigerant level check, leak test, performance test',
  NOW() + INTERVAL '1 day', 125.00, 'normal',
  'Customer reports weak cooling. System needs diagnosis before service.'
FROM profiles p JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'amanda.taylor@email.com' AND v.vin = 'WBAPH7G59BNK12345';

-- Service items for Work Order 5
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'A/C System Diagnosis', 1, 95.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'amanda.taylor@email.com' AND v.vin = 'WBAPH7G59BNK12345';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'R134a Refrigerant (1 lb)', 2, 15.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'amanda.taylor@email.com' AND v.vin = 'WBAPH7G59BNK12345';

-- Insert Work Order 6: Transmission Service - In Progress
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes)
SELECT 
  p.id, v.id, 'in_progress', 'Transmission Service',
  'Transmission fluid exchange, filter replacement, pan gasket replacement, system test',
  NOW() + INTERVAL '4 hours', 275.00, 'high',
  'High mileage vehicle. Fluid dark brown. Recommend full flush.'
FROM profiles p JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

-- Service items for Work Order 6
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Transmission Fluid Exchange', 1, 125.00
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Transmission Fluid (ATF)', 12, 8.99
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Transmission Filter', 1, 29.99
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Pan Gasket', 1, 12.99
FROM work_orders wo JOIN profiles p ON wo.customer_id = p.id JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

-- ============================================
-- 2. MULTI-TENANT PREP - ADD ORGANIZATION SUPPORT
-- ============================================
-- NOTE: The organizations table already exists in your schema
-- We'll add a default organization for now

-- Create default organization (if not exists)
INSERT INTO organizations (subdomain, name, legal_name, billing_email, status, subscription_plan)
VALUES ('demo', 'OverDryv Demo Shop', 'OverDryv Demo LLC', 'demo@overdryv.app', 'active', 'professional')
ON CONFLICT (subdomain) DO NOTHING;

-- Link all existing profiles to default organization
UPDATE profiles 
SET organization_id = (SELECT id FROM organizations WHERE subdomain = 'demo')
WHERE organization_id IS NULL;

-- Link all existing vehicles to default organization
UPDATE vehicles 
SET organization_id = (SELECT id FROM organizations WHERE subdomain = 'demo')
WHERE organization_id IS NULL;

-- Link all existing work_orders to default organization
UPDATE work_orders 
SET organization_id = (SELECT id FROM organizations WHERE subdomain = 'demo')
WHERE organization_id IS NULL;

-- Link all existing estimates to default organization
-- Note: estimates table may not have organization_id column yet
-- ALTER TABLE estimates ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id);
-- UPDATE estimates SET organization_id = (SELECT id FROM organizations WHERE subdomain = 'demo') WHERE organization_id IS NULL;

-- ============================================
-- 3. FINAL VERIFICATION
-- ============================================
SELECT 
  'Customers' as table_name, COUNT(*) as count FROM profiles WHERE role = 'customer'
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'Estimates', COUNT(*) FROM estimates
UNION ALL
SELECT 'Work Orders', COUNT(*) FROM work_orders
UNION ALL
SELECT 'Service Items (Estimates)', COUNT(*) FROM service_items WHERE estimate_id IS NOT NULL
UNION ALL
SELECT 'Service Items (Work Orders)', COUNT(*) FROM service_items WHERE work_order_id IS NOT NULL
UNION ALL
SELECT 'Organizations', COUNT(*) FROM organizations;

-- SUCCESS!
SELECT '✅ COMPLETE! You should now see: 18 customers, 20 vehicles, 5 estimates, 6 work orders with service items' as result;

-- OVERDRYV DEMO DATA - FOR EXISTING TABLES ONLY
-- Run this in Supabase SQL Editor to populate demo data
-- This creates 18 customers, 20 vehicles, 6 work orders with service items

-- ============================================
-- 1. INSERT DEMO CUSTOMERS
-- ============================================
-- Note: IDs will be auto-generated as UUIDs
-- These are customer-only accounts (no login access)
INSERT INTO profiles (email, first_name, last_name, phone, role) VALUES
('john.smith@email.com', 'John', 'Smith', '5551234567', 'customer'),
('sarah.davis@email.com', 'Sarah', 'Davis', '5552345678', 'customer'),
('mike.chen@email.com', 'Mike', 'Chen', '5553456789', 'customer'),
('lisa.johnson@email.com', 'Lisa', 'Johnson', '5554567890', 'customer'),
('david.williams@email.com', 'David', 'Williams', '5555678901', 'customer'),
('emily.brown@email.com', 'Emily', 'Brown', '5556789012', 'customer'),
('james.martinez@email.com', 'James', 'Martinez', '5557890123', 'customer'),
('amanda.taylor@email.com', 'Amanda', 'Taylor', '5558901234', 'customer'),
('robert.anderson@email.com', 'Robert', 'Anderson', '5559012345', 'customer'),
('maria.garcia@email.com', 'Maria', 'Garcia', '5550123456', 'customer'),
('thomas.wilson@email.com', 'Thomas', 'Wilson', '5551239999', 'customer'),
('jennifer.moore@email.com', 'Jennifer', 'Moore', '5552348888', 'customer'),
('christopher.lee@email.com', 'Christopher', 'Lee', '5553457777', 'customer'),
('jessica.white@email.com', 'Jessica', 'White', '5554566666', 'customer'),
('daniel.harris@email.com', 'Daniel', 'Harris', '5555675555', 'customer'),
('karen.clark@email.com', 'Karen', 'Clark', '5556784444', 'customer'),
('matthew.lewis@email.com', 'Matthew', 'Lewis', '5557893333', 'customer'),
('betty.robinson@email.com', 'Betty', 'Robinson', '5558902222', 'customer')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. INSERT DEMO VEHICLES
-- ============================================
-- Insert vehicles linked to customers by email lookup
INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '1HGBH41JXMN109186', 'Toyota', 'Camry', 2022, 'Silver', 15420, 'ABC-1234'
FROM profiles p WHERE p.email = 'john.smith@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '1FADP3K29EL234567', 'Ford', 'F-150', 2021, 'Blue', 28900, 'XYZ-5678'
FROM profiles p WHERE p.email = 'john.smith@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, 'JM1BL1SA8A1234567', 'Mazda', 'CX-5', 2020, 'Red', 34500, 'DEF-9012'
FROM profiles p WHERE p.email = 'sarah.davis@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '2HGFC2F59MH567890', 'Honda', 'Civic', 2023, 'White', 8200, 'GHI-3456'
FROM profiles p WHERE p.email = 'mike.chen@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '1C4RJFAG3EC789012', 'Jeep', 'Grand Cherokee', 2019, 'Black', 45600, 'JKL-7890'
FROM profiles p WHERE p.email = 'lisa.johnson@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '5NPD84LF8LH345678', 'Hyundai', 'Elantra', 2021, 'Gray', 22100, 'MNO-2345'
FROM profiles p WHERE p.email = 'david.williams@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '3VW267AJ4HM901234', 'Volkswagen', 'Jetta', 2018, 'Silver', 52300, 'PQR-6789'
FROM profiles p WHERE p.email = 'emily.brown@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '1G1BE5SM3H7456789', 'Chevrolet', 'Malibu', 2022, 'Red', 12800, 'STU-0123'
FROM profiles p WHERE p.email = 'james.martinez@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, 'WBAPH7G59BNK12345', 'BMW', '3 Series', 2020, 'Black', 31200, 'VWX-4567'
FROM profiles p WHERE p.email = 'amanda.taylor@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, 'WA1L2AFP8FA567890', 'Audi', 'Q5', 2019, 'White', 38900, 'YZA-8901'
FROM profiles p WHERE p.email = 'robert.anderson@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '4T1BF1FK8FU234567', 'Toyota', 'Corolla', 2021, 'Blue', 19500, 'BCD-2345'
FROM profiles p WHERE p.email = 'maria.garcia@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '19UUB3F79MA890123', 'Acura', 'TLX', 2022, 'Gray', 14200, 'EFG-6789'
FROM profiles p WHERE p.email = 'thomas.wilson@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '1FA6P8TH3K5456789', 'Ford', 'Mustang', 2020, 'Red', 27400, 'HIJ-0123'
FROM profiles p WHERE p.email = 'jennifer.moore@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, 'JTHBF1D28G5012345', 'Lexus', 'ES 350', 2019, 'Pearl', 33800, 'KLM-4567'
FROM profiles p WHERE p.email = 'christopher.lee@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '1N4AL3AP8JC678901', 'Nissan', 'Altima', 2021, 'Silver', 21600, 'NOP-8901'
FROM profiles p WHERE p.email = 'jessica.white@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '2C4RC1BG8LR234567', 'Chrysler', 'Pacifica', 2020, 'White', 29300, 'QRS-2345'
FROM profiles p WHERE p.email = 'daniel.harris@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, 'KL4CJCSB4MB890123', 'Chevrolet', 'Equinox', 2022, 'Blue', 16700, 'TUV-6789'
FROM profiles p WHERE p.email = 'karen.clark@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '5TDKZ3DC7LS456789', 'Toyota', 'Highlander', 2021, 'Gray', 24100, 'WXY-0123'
FROM profiles p WHERE p.email = 'matthew.lewis@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '3CZRU6H33MM012345', 'Honda', 'Odyssey', 2019, 'Red', 41200, 'ZAB-4567'
FROM profiles p WHERE p.email = 'betty.robinson@email.com';

INSERT INTO vehicles (customer_id, vin, make, model, year, color, mileage, license_plate)
SELECT p.id, '1G1ZD5ST8MF678901', 'Chevrolet', 'Camaro', 2023, 'Black', 5800, 'CDE-8901'
FROM profiles p WHERE p.email = 'thomas.wilson@email.com';

-- ============================================
-- 3. INSERT DEMO WORK ORDERS
-- ============================================
-- Work Order 1: Oil Change - In Progress
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes)
SELECT 
  p.id,
  v.id,
  'in_progress',
  'Oil Change & Filter',
  'Synthetic oil change, oil filter replacement, fluid level check, tire pressure check',
  NOW() + INTERVAL '2 hours',
  89.99,
  'normal',
  'Customer requested synthetic oil. Using Mobil 1 5W-30.'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

-- Work Order 2: Brake Service - Quality Check
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes)
SELECT 
  p.id,
  v.id,
  'quality_check',
  'Brake Service',
  'Front brake pad replacement, rotor resurfacing, brake fluid flush, system inspection',
  NOW() + INTERVAL '1 hour',
  385.50,
  'high',
  'Front pads at 15% remaining. Rotors within spec for resurfacing.'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

-- Work Order 3: Engine Diagnostics - Completed
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, actual_completion, total_amount, priority, notes)
SELECT 
  p.id,
  v.id,
  'completed',
  'Engine Diagnostics',
  'Check engine light diagnosis, scan for DTCs, visual inspection, recommend repairs',
  NOW() - INTERVAL '3 days',
  150.00,
  'urgent',
  'Code P0420 - Catalytic converter efficiency below threshold. Recommend replacement.'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'mike.chen@email.com' AND v.vin = '2HGFC2F59MH567890';

-- Work Order 4: Tire Rotation - Completed
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, actual_completion, total_amount, priority, notes)
SELECT 
  p.id,
  v.id,
  'completed',
  'Tire Rotation',
  '4-wheel tire rotation, balance check, pressure adjustment, tread depth measurement',
  NOW() - INTERVAL '5 days',
  65.00,
  'normal',
  'All tires in good condition. Tread depth 7/32" all around.'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'lisa.johnson@email.com' AND v.vin = '1C4RJFAG3EC789012';

-- Work Order 5: Air Conditioning Service - Pending
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes)
SELECT 
  p.id,
  v.id,
  'pending',
  'A/C Service',
  'A/C system diagnosis, refrigerant level check, leak test, performance test',
  NOW() + INTERVAL '1 day',
  125.00,
  'normal',
  'Customer reports weak cooling. System needs diagnosis before service.'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'amanda.taylor@email.com' AND v.vin = 'WBAPH7G59BNK12345';

-- Work Order 6: Transmission Service - In Progress
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes)
SELECT 
  p.id,
  v.id,
  'in_progress',
  'Transmission Service',
  'Transmission fluid exchange, filter replacement, pan gasket replacement, system test',
  NOW() + INTERVAL '4 hours',
  275.00,
  'high',
  'High mileage vehicle. Fluid dark brown. Recommend full flush.'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

-- ============================================
-- 4. INSERT SERVICE ITEMS FOR WORK ORDERS
-- ============================================
-- Service items for Work Order 1 (Oil Change)
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Oil Change Service', 1, 29.99
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Mobil 1 Synthetic Oil 5W-30 (5 Quarts)', 5, 8.99
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Oil Filter', 1, 14.99
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'fee', 'Shop Supplies', 1, 5.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'john.smith@email.com' AND v.vin = '1HGBH41JXMN109186';

-- Service items for Work Order 2 (Brake Service)
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Brake Pad Replacement (Front)', 1, 120.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Rotor Resurfacing', 1, 60.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Brake Fluid Flush', 1, 50.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Brake Pads (Front Set)', 1, 89.99
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Brake Fluid (DOT 3)', 2, 12.99
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'fee', 'Shop Supplies', 1, 15.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'sarah.davis@email.com' AND v.vin = 'JM1BL1SA8A1234567';

-- Service items for Work Order 3 (Engine Diagnostics)
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Engine Diagnostics & Scan', 1, 150.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'mike.chen@email.com' AND v.vin = '2HGFC2F59MH567890';

-- Service items for Work Order 4 (Tire Rotation)
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Tire Rotation & Balance', 1, 65.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'lisa.johnson@email.com' AND v.vin = '1C4RJFAG3EC789012';

-- Service items for Work Order 5 (A/C Service)
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'A/C System Diagnosis', 1, 95.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'amanda.taylor@email.com' AND v.vin = 'WBAPH7G59BNK12345';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'R134a Refrigerant (1 lb)', 2, 15.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'amanda.taylor@email.com' AND v.vin = 'WBAPH7G59BNK12345';

-- Service items for Work Order 6 (Transmission Service)
INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'labor', 'Transmission Fluid Exchange', 1, 125.00
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Transmission Fluid (ATF)', 12, 8.99
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Transmission Filter', 1, 29.99
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

INSERT INTO service_items (work_order_id, item_type, description, quantity, unit_price)
SELECT wo.id, 'part', 'Pan Gasket', 1, 12.99
FROM work_orders wo
JOIN profiles p ON wo.customer_id = p.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE p.email = 'robert.anderson@email.com' AND v.vin = 'WA1L2AFP8FA567890';

-- ============================================
-- 5. INSERT DEMO ESTIMATES
-- ============================================
-- Estimate 1: Brake Inspection - Draft
INSERT INTO estimates (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes, valid_until)
SELECT 
  p.id,
  v.id,
  'draft',
  'Brake Inspection & Service',
  'Complete brake system inspection, measure pad/rotor thickness, test brake fluid, provide detailed quote for any needed repairs',
  NOW() + INTERVAL '1 day',
  125.00,
  'normal',
  'Customer reports squeaking noise when braking. Initial inspection needed.',
  NOW() + INTERVAL '30 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'david.williams@email.com' AND v.vin = '5NPD84LF8LH345678';

-- Estimate 2: Timing Belt Service - Sent
INSERT INTO estimates (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes, valid_until)
SELECT 
  p.id,
  v.id,
  'sent',
  'Timing Belt Replacement',
  'Replace timing belt, water pump, tensioner, pulleys. Includes coolant flush and system test',
  NOW() + INTERVAL '2 days',
  895.00,
  'high',
  'Vehicle at 98k miles. Timing belt service interval is 100k. Proactive maintenance recommended.',
  NOW() + INTERVAL '30 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'emily.brown@email.com' AND v.vin = '3VW267AJ4HM901234';

-- Estimate 3: Suspension Repair - Sent
INSERT INTO estimates (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes, valid_until)
SELECT 
  p.id,
  v.id,
  'sent',
  'Front Suspension Repair',
  'Replace front struts, strut mounts, sway bar links. Includes alignment after installation',
  NOW() + INTERVAL '3 days',
  1250.00,
  'high',
  'Customer reports clunking noise over bumps. Front struts leaking. Alignment will be needed.',
  NOW() + INTERVAL '30 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'maria.garcia@email.com' AND v.vin = '4T1BF1FK8FU234567';

-- Estimate 4: Exhaust System - Approved (ready to convert to work order)
INSERT INTO estimates (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes, valid_until)
SELECT 
  p.id,
  v.id,
  'approved',
  'Exhaust System Repair',
  'Replace catalytic converter, muffler, exhaust hangers. Weld repairs as needed',
  NOW() + INTERVAL '2 days',
  785.00,
  'urgent',
  'Failed emissions test. P0420 code. Customer approved estimate - ready to schedule.',
  NOW() + INTERVAL '30 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'jennifer.moore@email.com' AND v.vin = '1FA6P8TH3K5456789';

-- Estimate 5: Cooling System - Declined
INSERT INTO estimates (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount, priority, notes, valid_until)
SELECT 
  p.id,
  v.id,
  'declined',
  'Cooling System Service',
  'Replace radiator, thermostat, radiator hoses, coolant temperature sensor. Flush cooling system',
  NOW() + INTERVAL '3 days',
  625.00,
  'high',
  'Customer declined - budget constraints. Advised of overheating risks.',
  NOW() + INTERVAL '30 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'daniel.harris@email.com' AND v.vin = '2C4RC1BG8LR234567';

-- ============================================
-- 6. INSERT SERVICE ITEMS FOR ESTIMATES
-- ============================================
-- Service items for Estimate 1 (Brake Inspection)
INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'labor', 'Brake System Inspection', 1, 95.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'david.williams@email.com' AND v.vin = '5NPD84LF8LH345678';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'fee', 'Shop Supplies', 1, 10.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'david.williams@email.com' AND v.vin = '5NPD84LF8LH345678';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Brake Fluid (DOT 3)', 1, 20.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'david.williams@email.com' AND v.vin = '5NPD84LF8LH345678';

-- Service items for Estimate 2 (Timing Belt)
INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'labor', 'Timing Belt Replacement', 1, 450.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'emily.brown@email.com' AND v.vin = '3VW267AJ4HM901234';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Timing Belt Kit', 1, 225.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'emily.brown@email.com' AND v.vin = '3VW267AJ4HM901234';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Water Pump', 1, 125.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'emily.brown@email.com' AND v.vin = '3VW267AJ4HM901234';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Coolant', 2, 22.50
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'emily.brown@email.com' AND v.vin = '3VW267AJ4HM901234';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'fee', 'Shop Supplies', 1, 25.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'emily.brown@email.com' AND v.vin = '3VW267AJ4HM901234';

-- Service items for Estimate 3 (Suspension)
INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'labor', 'Front Strut Replacement', 1, 350.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'maria.garcia@email.com' AND v.vin = '4T1BF1FK8FU234567';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'labor', 'Wheel Alignment', 1, 120.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'maria.garcia@email.com' AND v.vin = '4T1BF1FK8FU234567';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Front Struts (Pair)', 1, 450.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'maria.garcia@email.com' AND v.vin = '4T1BF1FK8FU234567';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Strut Mounts (Pair)', 1, 180.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'maria.garcia@email.com' AND v.vin = '4T1BF1FK8FU234567';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Sway Bar Links (Pair)', 1, 75.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'maria.garcia@email.com' AND v.vin = '4T1BF1FK8FU234567';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'fee', 'Shop Supplies', 1, 35.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'maria.garcia@email.com' AND v.vin = '4T1BF1FK8FU234567';

-- Service items for Estimate 4 (Exhaust - APPROVED)
INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'labor', 'Exhaust System Repair', 1, 275.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'jennifer.moore@email.com' AND v.vin = '1FA6P8TH3K5456789';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Catalytic Converter', 1, 425.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'jennifer.moore@email.com' AND v.vin = '1FA6P8TH3K5456789';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Exhaust Hangers', 3, 15.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'jennifer.moore@email.com' AND v.vin = '1FA6P8TH3K5456789';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'fee', 'Shop Supplies', 1, 25.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'jennifer.moore@email.com' AND v.vin = '1FA6P8TH3K5456789';

-- Service items for Estimate 5 (Cooling System - DECLINED)
INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'labor', 'Cooling System Overhaul', 1, 225.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'daniel.harris@email.com' AND v.vin = '2C4RC1BG8LR234567';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Radiator', 1, 275.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'daniel.harris@email.com' AND v.vin = '2C4RC1BG8LR234567';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Thermostat', 1, 45.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'daniel.harris@email.com' AND v.vin = '2C4RC1BG8LR234567';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'part', 'Radiator Hoses (Upper & Lower)', 1, 55.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'daniel.harris@email.com' AND v.vin = '2C4RC1BG8LR234567';

INSERT INTO service_items (estimate_id, item_type, description, quantity, unit_price)
SELECT e.id, 'fee', 'Shop Supplies', 1, 25.00
FROM estimates e
JOIN profiles p ON e.customer_id = p.id
JOIN vehicles v ON e.vehicle_id = v.id
WHERE p.email = 'daniel.harris@email.com' AND v.vin = '2C4RC1BG8LR234567';

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the import
SELECT 
  'Customers' as table_name, COUNT(*) as count FROM profiles WHERE role = 'customer'
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'Estimates', COUNT(*) FROM estimates
UNION ALL
SELECT 'Work Orders', COUNT(*) FROM work_orders
UNION ALL
SELECT 'Service Items', COUNT(*) FROM service_items
UNION ALL
SELECT 'Estimate Items', COUNT(*) FROM service_items WHERE estimate_id IS NOT NULL
UNION ALL
SELECT 'Work Order Items', COUNT(*) FROM service_items WHERE work_order_id IS NOT NULL;

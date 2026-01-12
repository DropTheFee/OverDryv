-- OVERDRYV DEMO DATA
-- Run this in Supabase SQL Editor to populate demo data
-- This creates 18 customers, 20 vehicles, and sample work orders

-- ============================================
-- 1. INSERT DEMO CUSTOMERS
-- ============================================
-- Note: IDs will be auto-generated, emails must be unique

INSERT INTO profiles (email, first_name, last_name, phone, role) VALUES
('john.smith@email.com', 'John', 'Smith', '555-0101', 'customer'),
('sarah.davis@email.com', 'Sarah', 'Davis', '555-0102', 'customer'),
('mike.chen@email.com', 'Mike', 'Chen', '555-0103', 'customer'),
('lisa.johnson@email.com', 'Lisa', 'Johnson', '555-0104', 'customer'),
('david.williams@email.com', 'David', 'Williams', '555-0105', 'customer'),
('emily.brown@email.com', 'Emily', 'Brown', '555-0106', 'customer'),
('james.martinez@email.com', 'James', 'Martinez', '555-0107', 'customer'),
('amanda.taylor@email.com', 'Amanda', 'Taylor', '555-0108', 'customer'),
('robert.anderson@email.com', 'Robert', 'Anderson', '555-0109', 'customer'),
('maria.garcia@email.com', 'Maria', 'Garcia', '555-0110', 'customer'),
('thomas.wilson@email.com', 'Thomas', 'Wilson', '555-0111', 'customer'),
('jennifer.moore@email.com', 'Jennifer', 'Moore', '555-0112', 'customer'),
('christopher.lee@email.com', 'Christopher', 'Lee', '555-0113', 'customer'),
('jessica.white@email.com', 'Jessica', 'White', '555-0114', 'customer'),
('daniel.harris@email.com', 'Daniel', 'Harris', '555-0115', 'customer'),
('karen.clark@email.com', 'Karen', 'Clark', '555-0116', 'customer'),
('matthew.lewis@email.com', 'Matthew', 'Lewis', '555-0117', 'customer'),
('betty.robinson@email.com', 'Betty', 'Robinson', '555-0118', 'customer')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. INSERT DEMO VEHICLES
-- ============================================

-- Insert vehicles linked to customers by email
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
-- 3. INSERT DEMO ESTIMATES
-- ============================================

-- Estimate #1 - Pending approval
INSERT INTO estimates (customer_id, vehicle_id, estimate_number, description, status, subtotal, tax_rate, tax_amount, total_amount, valid_until, notes)
SELECT 
  p.id,
  v.id,
  'EST-2026-001',
  'Oil change, brake inspection, tire rotation',
  'sent',
  125.00,
  7.5,
  9.38,
  134.38,
  CURRENT_DATE + INTERVAL '30 days',
  'Includes synthetic oil and new oil filter'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'john.smith@email.com' AND v.license_plate = 'ABC-1234'
LIMIT 1;

-- Estimate #2 - Approved
INSERT INTO estimates (customer_id, vehicle_id, estimate_number, description, status, subtotal, tax_rate, tax_amount, total_amount, valid_until)
SELECT 
  p.id,
  v.id,
  'EST-2026-002',
  'Brake pad replacement - Front',
  'approved',
  385.00,
  7.5,
  28.88,
  413.88,
  CURRENT_DATE + INTERVAL '30 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'sarah.davis@email.com' AND v.license_plate = 'DEF-9012'
LIMIT 1;

-- Estimate #3 - Draft
INSERT INTO estimates (customer_id, vehicle_id, estimate_number, description, status, subtotal, total_amount, valid_until)
SELECT 
  p.id,
  v.id,
  'EST-2026-003',
  'Engine diagnostic and repair',
  'draft',
  850.00,
  850.00,
  CURRENT_DATE + INTERVAL '30 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'mike.chen@email.com' AND v.license_plate = 'GHI-3456'
LIMIT 1;

-- Estimate #4 - Declined
INSERT INTO estimates (customer_id, vehicle_id, estimate_number, description, status, subtotal, tax_rate, tax_amount, total_amount, valid_until)
SELECT 
  p.id,
  v.id,
  'EST-2026-004',
  'Transmission service',
  'declined',
  295.00,
  7.5,
  22.13,
  317.13,
  CURRENT_DATE - INTERVAL '5 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'lisa.johnson@email.com' AND v.license_plate = 'JKL-7890'
LIMIT 1;

-- Estimate #5-10 - Various statuses
INSERT INTO estimates (customer_id, vehicle_id, estimate_number, description, status, subtotal, tax_rate, tax_amount, total_amount, valid_until)
SELECT 
  p.id,
  v.id,
  'EST-2026-005',
  'AC system recharge and leak test',
  'sent',
  175.00,
  7.5,
  13.13,
  188.13,
  CURRENT_DATE + INTERVAL '14 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'david.williams@email.com'
LIMIT 1;

INSERT INTO estimates (customer_id, vehicle_id, estimate_number, description, status, subtotal, tax_rate, tax_amount, total_amount, valid_until)
SELECT 
  p.id,
  v.id,
  'EST-2026-006',
  'Battery replacement and electrical system check',
  'sent',
  220.00,
  7.5,
  16.50,
  236.50,
  CURRENT_DATE + INTERVAL '20 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'emily.brown@email.com'
LIMIT 1;

INSERT INTO estimates (customer_id, vehicle_id, estimate_number, description, status, subtotal, tax_rate, tax_amount, total_amount, valid_until)
SELECT 
  p.id,
  v.id,
  'EST-2026-007',
  '60k mile service package',
  'approved',
  425.00,
  7.5,
  31.88,
  456.88,
  CURRENT_DATE + INTERVAL '30 days'
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'james.martinez@email.com'
LIMIT 1;

-- ============================================
-- 4. INSERT SERVICE ITEMS FOR ESTIMATES
-- ============================================

-- Service items for EST-2026-001
INSERT INTO service_items (estimate_id, description, quantity, unit_price, total_price, category)
SELECT 
  e.id,
  'Full Synthetic Oil Change',
  1,
  79.99,
  79.99,
  'labor'
FROM estimates e WHERE e.estimate_number = 'EST-2026-001';

INSERT INTO service_items (estimate_id, description, quantity, unit_price, total_price, category)
SELECT 
  e.id,
  'Brake Inspection',
  1,
  25.00,
  25.00,
  'labor'
FROM estimates e WHERE e.estimate_number = 'EST-2026-001';

INSERT INTO service_items (estimate_id, description, quantity, unit_price, total_price, category)
SELECT 
  e.id,
  'Tire Rotation',
  1,
  20.00,
  20.00,
  'labor'
FROM estimates e WHERE e.estimate_number = 'EST-2026-001';

-- Service items for EST-2026-002
INSERT INTO service_items (estimate_id, description, quantity, unit_price, total_price, category)
SELECT 
  e.id,
  'Front Brake Pad Set (Premium)',
  1,
  145.00,
  145.00,
  'parts'
FROM estimates e WHERE e.estimate_number = 'EST-2026-002';

INSERT INTO service_items (estimate_id, description, quantity, unit_price, total_price, category)
SELECT 
  e.id,
  'Brake Pad Installation - Front',
  1,
  180.00,
  180.00,
  'labor'
FROM estimates e WHERE e.estimate_number = 'EST-2026-002';

INSERT INTO service_items (estimate_id, description, quantity, unit_price, total_price, category)
SELECT 
  e.id,
  'Brake Fluid Top-Off',
  1,
  15.00,
  15.00,
  'fluids'
FROM estimates e WHERE e.estimate_number = 'EST-2026-002';

INSERT INTO service_items (estimate_id, description, quantity, unit_price, total_price, category)
SELECT 
  e.id,
  'Shop Supplies Fee',
  1,
  45.00,
  45.00,
  'fees'
FROM estimates e WHERE e.estimate_number = 'EST-2026-002';

-- ============================================
-- 5. INSERT DEMO WORK ORDERS
-- ============================================

-- Active Work Orders
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount)
SELECT 
  p.id,
  v.id,
  'in_progress',
  'Oil Change',
  'Full synthetic oil change, oil filter replacement, multi-point inspection',
  CURRENT_TIMESTAMP + INTERVAL '2 hours',
  89.99
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'robert.anderson@email.com'
LIMIT 1;

INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount)
SELECT 
  p.id,
  v.id,
  'in_progress',
  'Brake Service',
  'Replace rear brake pads and resurface rotors',
  CURRENT_TIMESTAMP + INTERVAL '4 hours',
  425.00
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'maria.garcia@email.com'
LIMIT 1;

INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount)
SELECT 
  p.id,
  v.id,
  'quality_check',
  'Engine Diagnostics',
  'Check engine light diagnosis, scan codes, recommend repairs',
  CURRENT_TIMESTAMP + INTERVAL '1 hour',
  125.00
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'thomas.wilson@email.com'
LIMIT 1;

INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount)
SELECT 
  p.id,
  v.id,
  'completed',
  'Tire Service',
  'Mount and balance 4 new tires, alignment check',
  CURRENT_TIMESTAMP - INTERVAL '1 hour',
  685.00
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'jennifer.moore@email.com'
LIMIT 1;

INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount)
SELECT 
  p.id,
  v.id,
  'completed',
  'Battery Service',
  'Battery replacement, electrical system test, clean terminals',
  CURRENT_TIMESTAMP - INTERVAL '3 hours',
  235.00
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'christopher.lee@email.com'
LIMIT 1;

-- Pending Work Orders
INSERT INTO work_orders (customer_id, vehicle_id, status, service_type, description, estimated_completion, total_amount)
SELECT 
  p.id,
  v.id,
  'pending',
  'AC Service',
  'AC system recharge, leak test, compressor check',
  CURRENT_TIMESTAMP + INTERVAL '1 day',
  195.00
FROM profiles p
JOIN vehicles v ON v.customer_id = p.id
WHERE p.email = 'jessica.white@email.com'
LIMIT 1;

-- ============================================
-- 6. INSERT SERVICE ITEMS FOR WORK ORDERS
-- ============================================

-- Items for first work order
INSERT INTO service_items (work_order_id, description, quantity, unit_price, total_price, category)
SELECT 
  wo.id,
  'Full Synthetic Oil',
  5,
  8.99,
  44.95,
  'fluids'
FROM work_orders wo
WHERE wo.service_type = 'Oil Change' 
  AND wo.status = 'in_progress'
LIMIT 1;

INSERT INTO service_items (work_order_id, description, quantity, unit_price, total_price, category)
SELECT 
  wo.id,
  'Premium Oil Filter',
  1,
  12.99,
  12.99,
  'parts'
FROM work_orders wo
WHERE wo.service_type = 'Oil Change' 
  AND wo.status = 'in_progress'
LIMIT 1;

INSERT INTO service_items (work_order_id, description, quantity, unit_price, total_price, category)
SELECT 
  wo.id,
  'Labor - Oil Change Service',
  1,
  32.05,
  32.05,
  'labor'
FROM work_orders wo
WHERE wo.service_type = 'Oil Change' 
  AND wo.status = 'in_progress'
LIMIT 1;

-- ============================================
-- 7. INSERT DEMO INVOICES
-- ============================================

-- Invoice for completed tire service
INSERT INTO invoices (work_order_id, invoice_number, subtotal, tax_rate, tax_amount, total_amount, payment_method, paid, paid_at)
SELECT 
  wo.id,
  'INV-2026-001',
  638.32,
  7.5,
  47.87,
  686.19,
  'card',
  true,
  CURRENT_TIMESTAMP - INTERVAL '30 minutes'
FROM work_orders wo
WHERE wo.service_type = 'Tire Service' AND wo.status = 'completed'
LIMIT 1;

-- Invoice for completed battery service (unpaid)
INSERT INTO invoices (work_order_id, invoice_number, subtotal, tax_rate, tax_amount, total_amount, paid, due_date)
SELECT 
  wo.id,
  'INV-2026-002',
  218.69,
  7.5,
  16.40,
  235.09,
  false,
  CURRENT_DATE + INTERVAL '15 days'
FROM work_orders wo
WHERE wo.service_type = 'Battery Service' AND wo.status = 'completed'
LIMIT 1;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 
  (SELECT COUNT(*) FROM profiles WHERE role = 'customer') as customers,
  (SELECT COUNT(*) FROM vehicles) as vehicles,
  (SELECT COUNT(*) FROM estimates) as estimates,
  (SELECT COUNT(*) FROM work_orders) as work_orders,
  (SELECT COUNT(*) FROM service_items) as service_items,
  (SELECT COUNT(*) FROM invoices) as invoices;

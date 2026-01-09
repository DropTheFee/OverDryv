-- Add demo customers to profiles table
INSERT INTO profiles (id, email, first_name, last_name, phone, role, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'john.smith@email.com', 'John', 'Smith', '555-0101', 'customer', now(), now()),
  (gen_random_uuid(), 'sarah.davis@email.com', 'Sarah', 'Davis', '555-0102', 'customer', now(), now()),
  (gen_random_uuid(), 'mike.chen@email.com', 'Mike', 'Chen', '555-0103', 'customer', now(), now()),
  (gen_random_uuid(), 'lisa.johnson@email.com', 'Lisa', 'Johnson', '555-0104', 'customer', now(), now()),
  (gen_random_uuid(), 'david.williams@email.com', 'David', 'Williams', '555-0105', 'customer', now(), now())
ON CONFLICT (email) DO NOTHING;

-- Add demo vehicles (you'll need to update customer_id with actual UUIDs from profiles)
-- This is a template - vehicles table needs to be created first
-- INSERT INTO vehicles (id, customer_id, make, model, year, license_plate, vin, color, created_at, updated_at)
-- SELECT 
--   gen_random_uuid(), 
--   p.id, 
--   'Toyota', 
--   'Camry', 
--   2022, 
--   'ABC-1234', 
--   'JT2BF22K9X0123456',
--   'Silver',
--   now(),
--   now()
-- FROM profiles p WHERE p.email = 'john.smith@email.com';

-- Allow customer profiles to exist without auth users
-- This enables demo data and customer-only accounts created by admin

-- Drop the foreign key constraint that requires auth.users
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add default UUID generation for id column
ALTER TABLE profiles 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Note: This allows customer profiles without login accounts
-- Profiles will have auto-generated UUIDs
-- Auth users can still explicitly set their id when signing up

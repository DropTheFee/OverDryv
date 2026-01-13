-- Fix estimate_number generation to use sequence instead of colliding epoch timestamps

-- Create sequence for unique estimate numbers
CREATE SEQUENCE IF NOT EXISTS estimates_number_seq START 1000;

-- Drop old default that uses epoch (causes collisions)
ALTER TABLE estimates ALTER COLUMN estimate_number DROP DEFAULT;

-- Create trigger function using sequence
CREATE OR REPLACE FUNCTION set_estimate_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estimate_number IS NULL OR NEW.estimate_number = '' THEN
    NEW.estimate_number := 'EST-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('estimates_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS estimates_set_number ON estimates;
CREATE TRIGGER estimates_set_number
  BEFORE INSERT ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION set_estimate_number();

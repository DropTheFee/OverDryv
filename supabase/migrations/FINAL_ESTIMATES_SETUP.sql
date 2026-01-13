-- =====================================================
-- FINAL ESTIMATES TABLE SETUP
-- Run this ONCE to set up estimates properly
-- =====================================================

-- Drop and recreate to ensure clean state
DROP TABLE IF EXISTS service_items CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;

-- Create estimates table
CREATE TABLE estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  status text CHECK (status IN ('draft', 'sent', 'approved', 'declined', 'expired')) DEFAULT 'draft',
  service_type text NOT NULL,
  description text NOT NULL,
  estimated_completion timestamptz,
  total_amount decimal(10,2) DEFAULT 0,
  notes text,
  priority text CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  valid_until timestamptz DEFAULT NOW() + INTERVAL '30 days',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  converted_to_work_order_id uuid REFERENCES work_orders(id) ON DELETE SET NULL
);

-- Create sequence for estimate numbers
CREATE SEQUENCE IF NOT EXISTS estimates_number_seq START 1000;

-- Create trigger function for auto-generating estimate numbers
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

-- Recreate service_items table with proper foreign keys
CREATE TABLE service_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id uuid REFERENCES estimates(id) ON DELETE CASCADE,
  work_order_id uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity decimal(10,2) DEFAULT 1,
  unit_price decimal(10,2) DEFAULT 0,
  total_price decimal(10,2) DEFAULT 0,
  item_type text CHECK (item_type IN ('labor', 'part', 'fee')) DEFAULT 'labor',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT service_item_parent CHECK (
    (estimate_id IS NOT NULL AND work_order_id IS NULL) OR
    (estimate_id IS NULL AND work_order_id IS NOT NULL)
  )
);

-- Enable RLS on estimates
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Customers can read own estimates" ON estimates;
DROP POLICY IF EXISTS "Staff can read all estimates" ON estimates;
DROP POLICY IF EXISTS "Staff can insert estimates" ON estimates;
DROP POLICY IF EXISTS "Staff can update estimates" ON estimates;
DROP POLICY IF EXISTS "Staff can delete estimates" ON estimates;

-- Customers can read own estimates
CREATE POLICY "Customers can read own estimates"
  ON estimates FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- Staff can read all estimates
CREATE POLICY "Staff can read all estimates"
  ON estimates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Staff can insert estimates
CREATE POLICY "Staff can insert estimates"
  ON estimates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Staff can update estimates
CREATE POLICY "Staff can update estimates"
  ON estimates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Staff can delete estimates
CREATE POLICY "Staff can delete estimates"
  ON estimates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Enable RLS on service_items
ALTER TABLE service_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Staff can manage service items" ON service_items;

-- Staff can manage all service items
CREATE POLICY "Staff can manage service items"
  ON service_items
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_estimates_customer ON estimates(customer_id);
CREATE INDEX IF NOT EXISTS idx_estimates_vehicle ON estimates(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_service_items_estimate ON service_items(estimate_id);
CREATE INDEX IF NOT EXISTS idx_service_items_work_order ON service_items(work_order_id);

-- Verify setup
SELECT 
  'Estimates table created' as status,
  COUNT(*) as estimate_count
FROM estimates;

SELECT 
  'Service items table created' as status,
  COUNT(*) as item_count
FROM service_items;

-- SUCCESS MESSAGE
SELECT '✅ Estimates system is ready! Now run LOAD_DEMO_DATA.sql' as message;

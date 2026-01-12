-- CREATE ESTIMATES TABLE
-- Mirrors work_orders structure for easy conversion with single button
-- Estimate -> Work Order is just a copy with status change

CREATE TABLE IF NOT EXISTS estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_number text UNIQUE NOT NULL DEFAULT 'EST-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(EXTRACT(epoch FROM now())::text, 10, '0'),
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

-- Enable RLS
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_estimates_customer_id ON estimates(customer_id);
CREATE INDEX IF NOT EXISTS idx_estimates_vehicle_id ON estimates(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimates_created_at ON estimates(created_at);

-- Add trigger for updated_at
CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Update service_items table to allow estimate_id
ALTER TABLE service_items 
  ADD COLUMN IF NOT EXISTS estimate_id uuid REFERENCES estimates(id) ON DELETE CASCADE;

-- Update service_items CHECK constraint to allow either estimate_id OR work_order_id
ALTER TABLE service_items 
  DROP CONSTRAINT IF EXISTS service_items_check;

ALTER TABLE service_items 
  ADD CONSTRAINT service_items_check 
  CHECK (
    (estimate_id IS NOT NULL AND work_order_id IS NULL) OR 
    (estimate_id IS NULL AND work_order_id IS NOT NULL)
  );

-- Create index for estimate service items
CREATE INDEX IF NOT EXISTS idx_service_items_estimate_id ON service_items(estimate_id);

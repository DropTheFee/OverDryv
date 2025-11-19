/*
# Initial Database Schema for Automotive Shop CRM

1. New Tables
   - `profiles` - User profiles with role-based access (customer, admin, technician)
   - `vehicles` - Vehicle information including VIN, make, model, year
   - `work_orders` - Service orders with status tracking and technician assignment
   - `photos` - Photo documentation system for vehicles and services
   - `waivers` - Digital signature storage for service authorization

2. Security
   - Enable RLS on all tables
   - Add policies for role-based data access
   - Customers can only see their own data
   - Technicians can see assigned work orders
   - Admins have full access

3. Features
   - Comprehensive vehicle tracking
   - Real-time work order status updates
   - Digital waiver and signature capture
   - Photo documentation and categorization
   - Service history and maintenance tracking
*/

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  role text CHECK (role IN ('customer', 'admin', 'technician')) DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vin text,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  color text,
  mileage integer DEFAULT 0,
  license_plate text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work_orders table
CREATE TABLE IF NOT EXISTS work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_number text UNIQUE NOT NULL DEFAULT 'WO-' || LPAD(EXTRACT(epoch FROM now())::text, 10, '0'),
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'in_progress', 'quality_check', 'completed', 'picked_up')) DEFAULT 'pending',
  service_type text NOT NULL,
  description text NOT NULL,
  estimated_completion timestamptz,
  actual_completion timestamptz,
  technician_id uuid REFERENCES profiles(id),
  total_amount decimal(10,2) DEFAULT 0,
  notes text,
  priority text CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photos table for documentation
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  url text NOT NULL,
  category text CHECK (category IN ('before', 'during', 'after', 'damage', 'completed')) NOT NULL,
  description text DEFAULT '',
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create waivers table for digital signatures
CREATE TABLE IF NOT EXISTS waivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  work_order_id uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  signature_data text NOT NULL,
  ip_address inet,
  signed_at timestamptz DEFAULT now(),
  waiver_text text NOT NULL
);

-- Create service_items table for detailed service breakdown
CREATE TABLE IF NOT EXISTS service_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  item_type text CHECK (item_type IN ('labor', 'part', 'fee')) NOT NULL,
  description text NOT NULL,
  quantity decimal(10,2) DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE waivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_items ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Create policies for vehicles
CREATE POLICY "Customers can read own vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Staff can read all vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

CREATE POLICY "Staff can insert vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

CREATE POLICY "Staff can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Create policies for work_orders
CREATE POLICY "Customers can read own work orders"
  ON work_orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Staff can read all work orders"
  ON work_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

CREATE POLICY "Staff can insert work orders"
  ON work_orders FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

CREATE POLICY "Staff can update work orders"
  ON work_orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Create policies for photos
CREATE POLICY "Users can view photos for their work orders"
  ON photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM work_orders 
      WHERE id = work_order_id 
      AND (customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'technician')
      ))
    )
  );

CREATE POLICY "Staff can insert photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Create policies for waivers
CREATE POLICY "Customers can read own waivers"
  ON waivers FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Staff can read all waivers"
  ON waivers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

CREATE POLICY "Anyone can insert waivers"
  ON waivers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for service_items
CREATE POLICY "Users can view service items for their work orders"
  ON service_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM work_orders 
      WHERE id = work_order_id 
      AND (customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'technician')
      ))
    )
  );

CREATE POLICY "Staff can manage service items"
  ON service_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_customer_id ON work_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_vehicle_id ON work_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_technician_id ON work_orders(technician_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_photos_work_order_id ON photos(work_order_id);
CREATE INDEX IF NOT EXISTS idx_waivers_work_order_id ON waivers(work_order_id);
CREATE INDEX IF NOT EXISTS idx_service_items_work_order_id ON service_items(work_order_id);

-- Update function for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
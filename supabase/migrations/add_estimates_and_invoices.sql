-- ============================================
-- COMPREHENSIVE OVERDRYV DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE MISSING TABLES
-- ============================================

-- ESTIMATES TABLE (for quotes/proposals)
CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  estimate_number TEXT UNIQUE NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'sent', 'approved', 'declined', 'expired')) DEFAULT 'draft',
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SERVICE ITEMS TABLE (line items for estimates/work orders)
CREATE TABLE IF NOT EXISTS service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  category TEXT, -- 'labor', 'parts', 'fluids', 'fees'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (estimate_id IS NOT NULL OR work_order_id IS NOT NULL)
);

-- INVOICES TABLE (billing/payment tracking)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'check', 'other')),
  paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SETTINGS TABLE (for dual pricing, shop info, etc.)
CREATE TABLE IF NOT EXISTS shop_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. INSERT DEFAULT SETTINGS
-- ============================================

INSERT INTO shop_settings (setting_key, setting_value, description) VALUES
('dual_pricing_enabled', 'true', 'Enable dual pricing (cash vs card)'),
('card_processing_fee', '3.5', 'Credit card processing fee percentage'),
('tax_rate', '7.5', 'Default sales tax rate'),
('shop_name', 'OverDryv Auto Service', 'Shop name for invoices'),
('shop_phone', '555-123-4567', 'Shop phone number'),
('shop_address', '123 Main St, City, ST 12345', 'Shop address')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- 3. ADD NEW STATUS TO WORK ORDERS
-- ============================================

ALTER TABLE work_orders DROP CONSTRAINT IF EXISTS work_orders_status_check;
ALTER TABLE work_orders ADD CONSTRAINT work_orders_status_check 
  CHECK (status IN ('estimate', 'pending', 'approved', 'in_progress', 'quality_check', 'completed', 'picked_up', 'declined'));

-- ============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_estimates_customer ON estimates(customer_id);
CREATE INDEX IF NOT EXISTS idx_estimates_vehicle ON estimates(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_service_items_estimate ON service_items(estimate_id);
CREATE INDEX IF NOT EXISTS idx_service_items_work_order ON service_items(work_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_work_order ON invoices(work_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_paid ON invoices(paid);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

SELECT 'Database setup complete! Tables created: estimates, service_items, invoices, shop_settings' as message;

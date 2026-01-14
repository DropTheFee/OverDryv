-- =====================================================
-- Add RLS Policies for Organizations and Related Tables
-- =====================================================

-- Enable RLS on organizations table if not already enabled
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read organizations by subdomain" ON organizations;
DROP POLICY IF EXISTS "Users can read their organization" ON organizations;
DROP POLICY IF EXISTS "Master admins can manage all organizations" ON organizations;

-- Allow anonymous/authenticated users to read organizations by subdomain
-- This is needed for the login page to look up the organization
CREATE POLICY "Anyone can read organizations by subdomain"
  ON organizations FOR SELECT
  TO authenticated, anon
  USING (true);

-- Users can update their own organization if they are admin
CREATE POLICY "Admins can update their organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- Master admins can insert new organizations
CREATE POLICY "Master admins can insert organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'master_admin'
    )
  );

-- =====================================================
-- Add RLS Policies for Organization Features
-- =====================================================

ALTER TABLE organization_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their organization features" ON organization_features;
DROP POLICY IF EXISTS "Admins can manage their organization features" ON organization_features;

-- Users can read features for their organization
CREATE POLICY "Users can read their organization features"
  ON organization_features FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Admins can manage features for their organization
CREATE POLICY "Admins can manage their organization features"
  ON organization_features FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- =====================================================
-- Add RLS Policies for Organization Integrations
-- =====================================================

ALTER TABLE organization_integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their organization integrations" ON organization_integrations;
DROP POLICY IF EXISTS "Admins can manage their organization integrations" ON organization_integrations;

-- Users can read integrations for their organization
CREATE POLICY "Users can read their organization integrations"
  ON organization_integrations FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Admins can manage integrations for their organization
CREATE POLICY "Admins can manage their organization integrations"
  ON organization_integrations FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master_admin')
    )
  );

-- =====================================================
-- Add RLS Policies for Invoices
-- =====================================================

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can read all invoices" ON invoices;
DROP POLICY IF EXISTS "Staff can insert invoices" ON invoices;
DROP POLICY IF EXISTS "Staff can update invoices" ON invoices;
DROP POLICY IF EXISTS "Customers can read their invoices" ON invoices;

-- Staff can read all invoices in their organization
CREATE POLICY "Staff can read all invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Customers can read their own invoices
CREATE POLICY "Customers can read their invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM work_orders 
      WHERE work_orders.id = invoices.work_order_id 
      AND work_orders.customer_id = auth.uid()
    )
  );

-- Staff can insert invoices
CREATE POLICY "Staff can insert invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- Staff can update invoices
CREATE POLICY "Staff can update invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- =====================================================
-- Log completion
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies added for organizations, organization_features, organization_integrations, and invoices';
END $$;

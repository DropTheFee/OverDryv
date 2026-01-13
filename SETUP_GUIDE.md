# OverDryv Database Setup Guide

## Complete Database Setup Instructions

This guide will walk you through setting up your OverDryv Supabase database with all necessary tables, policies, and demo data.

---

## 📋 Prerequisites

- Supabase account and project created
- Access to Supabase SQL Editor
- OverDryv project ID: `qbhimvjkmsulmjmhduzh` (or your project ID)

---

## 🚀 Quick Setup (Recommended)

### Step 1: Run All Migrations

In your Supabase Dashboard:
1. Go to **SQL Editor** (left sidebar)
2. Run each migration file in order:

```sql
-- 1. Run: migrations/20250827021241_yellow_wind.sql
-- This creates all base tables (profiles, vehicles, work_orders, photos, waivers, service_items)

-- 2. Run: migrations/allow_customer_profiles_without_auth.sql
-- This allows customer profiles to exist without auth.users

-- 3. Run: migrations/create_estimates_table.sql
-- This creates the estimates table and links it to service_items

-- 4. Run: migrations/add_estimates_and_invoices.sql
-- This adds invoices table for billing
```

### Step 2: Load Demo Data

Run the complete setup file:
```sql
-- Run: demo-data/COMPLETE_SETUP.sql
-- This populates 18 customers, 20 vehicles, 8 estimates, 6 work orders
```

### Step 3: Create Demo User in Authentication

1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Click **Add user** > **Create new user**
3. Enter:
   - **Email**: `demo@overdryv.io`
   - **Password**: `Demo123!`
   - Check "Auto Confirm User"
4. Click **Create user**
5. The SQL script will automatically create the admin profile for this user

---

## 📊 What Gets Created

### Tables
- ✅ **profiles** - User accounts (customers, admins, technicians)
- ✅ **vehicles** - Customer vehicles with VIN, make, model, year
- ✅ **estimates** - Price quotes with dual pricing (cash vs card)
- ✅ **work_orders** - Active service jobs
- ✅ **service_items** - Line items for estimates and work orders
- ✅ **photos** - Vehicle and service documentation
- ✅ **waivers** - Digital signatures
- ✅ **invoices** - Billing records

### Demo Data
- 👥 **18 Customer Profiles** - John Smith, Sarah Davis, Mike Chen, etc.
- 🚗 **20 Vehicles** - Toyota Camry, Ford F-150, Honda Civic, etc.
- 📝 **8 Estimates** - Various statuses (draft, sent, approved, declined)
- 🔧 **6 Work Orders** - Various stages (pending, in progress, completed)
- 📋 **50+ Service Items** - Detailed line items for all estimates and work orders

### User Accounts
- 🔐 **Demo Admin**: `demo@overdryv.io` / `Demo123!`
- 👤 **Test Customers**: 18 customer profiles (no login, profile-only)

---

## 🔍 Database Schema Overview

### Estimates Table Structure
```sql
CREATE TABLE estimates (
  id uuid PRIMARY KEY,
  estimate_number text UNIQUE,           -- EST-2026-XXXXXX
  customer_id uuid REFERENCES profiles,
  vehicle_id uuid REFERENCES vehicles,
  status text,                           -- draft, sent, approved, declined, expired
  service_type text,
  description text,
  total_amount decimal(10,2),            -- Cash price
  priority text,                         -- low, normal, high, urgent
  valid_until timestamptz,               -- Auto-set to 30 days from creation
  notes text,
  created_at timestamptz,
  updated_at timestamptz
);
```

### Key Features
- **Dual Pricing**: Card price = Cash price × 1.035 (3.5% processing fee)
- **Estimate Statuses**: draft → sent → approved/declined/expired
- **Convert to Work Order**: One-click conversion from approved estimate
- **Service Items**: Shared table for both estimates and work orders
- **Row Level Security**: Customers see only their data, admins see all

---

## 🧪 Verification

After running the setup, verify with these queries:

```sql
-- Check record counts
SELECT 
  'Customers' as type, COUNT(*) as count FROM profiles WHERE role = 'customer'
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'Estimates', COUNT(*) FROM estimates
UNION ALL
SELECT 'Work Orders', COUNT(*) FROM work_orders;

-- Expected results:
-- Customers: 18
-- Vehicles: 20
-- Estimates: 8
-- Work Orders: 6
```

---

## 🎨 Testing the Demo

1. **Login as Demo Admin**:
   - Go to: `http://localhost:5173/login`
   - Email: `demo@overdryv.io`
   - Password: `Demo123!`

2. **Navigate to Estimates**:
   - Click **Estimates** tab in navigation
   - View 8 demo estimates in various statuses

3. **Create New Estimate**:
   - Click **+ New Estimate**
   - Select customer: John Smith
   - Select vehicle: 2022 Toyota Camry
   - Add service items
   - See dual pricing (Cash vs Card)
   - Save as draft or send to customer

4. **Convert Estimate to Work Order**:
   - Open an approved estimate
   - Click **Convert to Work Order**
   - Estimate data copies to new work order
   - Work order appears in Work Orders tab

---

## 📝 Important Notes

### All Data is Database-Driven
- ✅ No hardcoded sample data in the app
- ✅ All customers, vehicles, estimates, and work orders come from Supabase
- ✅ Changes made in the demo persist in the database
- ✅ Users can create/edit/delete records through the UI

### Estimate Workflow
1. **Draft** - Can edit, delete, or send
2. **Sent** - Can edit, resend, or mark approved
3. **Approved** - Can convert to work order
4. **Declined** - Customer rejected
5. **Expired** - Past valid_until date (30 days default)

### Dual Pricing System
- **Cash Price**: Base price (no fee)
- **Card Price**: Cash price + 3.5% processing fee
- Both prices displayed in estimate list and detail views
- Calculation: `card_price = cash_price * 1.035`

---

## 🔧 Troubleshooting

### Issue: "Demo user not found"
**Solution**: Create the auth user first in Authentication > Users, then run the SQL

### Issue: "relation 'estimates' does not exist"
**Solution**: Run `create_estimates_table.sql` migration first

### Issue: "violates foreign key constraint"
**Solution**: Ensure migrations run in order (base tables before estimates)

### Issue: Estimates not showing in UI
**Solution**: Check browser console for errors, verify Supabase connection in `src/lib/supabase.ts`

---

## 📚 File Reference

### Migration Files (run in order)
1. `migrations/20250827021241_yellow_wind.sql` - Base tables
2. `migrations/allow_customer_profiles_without_auth.sql` - Customer profiles
3. `migrations/create_estimates_table.sql` - Estimates table
4. `migrations/add_estimates_and_invoices.sql` - Invoices table

### Demo Data Files
- `demo-data/COMPLETE_SETUP.sql` - All-in-one setup with demo data (RECOMMENDED)
- `demo-data/import-existing-tables.sql` - Alternative manual setup
- `demo-data/customers.csv` - Customer list for reference
- `demo-data/vehicles-template.csv` - Vehicle list for reference

### Component Files
- `src/components/admin/EstimatesManagement.tsx` - Main estimates list
- `src/components/admin/CreateEstimateModal.tsx` - Create/edit modal
- `src/components/admin/EstimateDetail.tsx` - Detail view with actions
- `src/pages/AdminDashboard.tsx` - Admin routing

---

## 🎯 Next Steps

After setup is complete:

1. ✅ Verify demo login works
2. ✅ Check that all 8 estimates appear in Estimates tab
3. ✅ Test creating a new estimate
4. ✅ Test converting an approved estimate to work order
5. ✅ Test dual pricing calculation
6. ✅ Test estimate status changes

---

## 🆘 Support

If you encounter issues:
- Check Supabase logs in Dashboard > Logs
- Verify RLS policies are enabled
- Ensure all migrations ran successfully
- Check browser console for API errors

---

## ✨ Features Summary

### Estimates System ✅
- ✅ List view with status filtering
- ✅ Search by customer, vehicle, service
- ✅ Dual pricing display (Cash vs Card +3.5%)
- ✅ Create/Edit estimates with service items
- ✅ Send/Resend via email (placeholder)
- ✅ Approve/Decline workflow
- ✅ Convert to Work Order
- ✅ Print/Email/SMS actions
- ✅ 30-day validity period
- ✅ Status badges and visual indicators

### Database ✅
- ✅ All tables created with proper relationships
- ✅ Row Level Security policies
- ✅ Demo data loaded (18 customers, 20 vehicles, 8 estimates)
- ✅ Service items shared between estimates and work orders
- ✅ Foreign key constraints and cascading deletes

---

**Setup Date**: January 13, 2026  
**OverDryv Version**: 1.0  
**Database**: Supabase PostgreSQL 12

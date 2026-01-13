# Database Setup Instructions

Follow these steps in order to set up the estimates system with demo data.

## Step 1: Run the Migration (REQUIRED FIRST)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open `/workspaces/OverDryv/supabase/migrations/fix_estimate_number_sequence.sql`
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run**

**What this does:**
- Creates a sequence for generating unique estimate numbers
- Removes the old epoch-based default that was causing duplicate key errors
- Adds a trigger to auto-generate estimate numbers in format: `EST-YYYY-NNNNNN`

## Step 2: Load Demo Data

1. In Supabase SQL Editor (same location)
2. Open `/workspaces/OverDryv/supabase/demo-data/LOAD_DEMO_DATA.sql`
3. Copy the entire contents
4. Paste into Supabase SQL Editor
5. Click **Run**

**What this does:**
- Clears existing demo data using TRUNCATE (safe, fast reset)
- Loads 18 customers with profiles
- Loads 20 vehicles linked to customers
- Creates 8 estimates with various statuses:
  - 2 Draft estimates
  - 3 Sent estimates
  - 2 Approved estimates
  - 1 Declined estimate
- Adds service items (parts, labor, fees) to each estimate

## Step 3: Verify in Application

1. Login to OverDryv
2. Navigate to **Admin Dashboard** → **Estimates**
3. You should see 8 estimates with:
   - Unique estimate numbers (EST-2025-001000, EST-2025-001001, etc.)
   - Customer names
   - Vehicle information
   - Service descriptions
   - **Dual Pricing Display:**
     - Cash Price (original amount)
     - Card Price (Cash × 1.035 = +3.5% processing fee)
   - Various statuses (Draft, Sent, Approved, Declined)

## Troubleshooting

**If you get "policy already exists" errors:**
- This is OK - policies from previous runs will be skipped
- Check that estimate_number values are unique

**If you still get duplicate key errors:**
- Make sure you ran Step 1 (migration) FIRST before Step 2 (demo data)
- The sequence must be created before inserting estimates

**To reset everything:**
- Just run LOAD_DEMO_DATA.sql again (it uses TRUNCATE to clear old data first)
- No need to drop tables or run migrations again

## What's Different Now

### OLD (Caused Duplicates)
```sql
estimate_number DEFAULT 'EST-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(EXTRACT(epoch FROM now())::text, 10, '0')
```
Problem: Multiple inserts in same second got identical epoch timestamps

### NEW (Guaranteed Unique)
```sql
CREATE SEQUENCE estimates_number_seq START 1000;
CREATE TRIGGER set_estimate_number_trigger BEFORE INSERT ON estimates
```
Solution: Database sequence atomically increments, trigger generates format

## Demo Data Summary

- **Customers:** 18 profiles with contact information
- **Vehicles:** 20 vehicles (make, model, year, VIN, mileage)
- **Estimates:** 8 estimates totaling $2,439.98 (Cash) / $2,525.33 (Card)
- **Service Items:** Parts, labor, and fees for realistic estimates
- **Date Range:** All estimates valid for 30 days from creation

Ready to test the Estimates system! 🚗

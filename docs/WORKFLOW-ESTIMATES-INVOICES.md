# Estimates vs Work Orders vs Invoices

## The Problem
Currently, everything is called a "Work Order" which confuses the workflow stages.

## Industry Standard Terminology

1. **ESTIMATE/QUOTE** 
   - Customer brings car in
   - Shop inspects and provides price quote
   - Customer has NOT approved yet
   - May be declined/modified

2. **WORK ORDER**
   - Customer APPROVED the estimate
   - Work is authorized and begins
   - Tracks actual work progress
   - May differ from estimate (found additional issues)

3. **INVOICE**
   - Work is COMPLETED
   - Final bill generated
   - Customer owes money
   - Ready for payment

## Recommended Implementation

### Option A: Add `type` field to work_orders table

```sql
ALTER TABLE work_orders ADD COLUMN type TEXT DEFAULT 'work_order'
  CHECK (type IN ('estimate', 'work_order', 'invoice'));
```

**Status Flow:**
- **Estimate**: `type: 'estimate'`, `status: 'pending'` → waiting for approval
- **Work Order**: `type: 'work_order'`, `status: 'in_progress'` → doing work
- **Invoice**: `type: 'invoice'`, `status: 'completed'` → ready to bill

### Option B: Use existing status field better

Keep current table, clarify status meanings:

```typescript
status: 
  | 'estimate'        // Quote given, not approved
  | 'approved'        // Estimate accepted, ready to start
  | 'in_progress'     // Work happening
  | 'quality_check'   // Work done, being verified
  | 'completed'       // Ready for pickup, invoice generated
  | 'picked_up'       // Customer got vehicle
  | 'declined'        // Customer rejected estimate
```

### Option C: Separate tables (most robust)

```sql
-- Estimates (quotes)
CREATE TABLE estimates (
  id UUID PRIMARY KEY,
  customer_id UUID,
  vehicle_id UUID,
  description TEXT,
  estimated_amount DECIMAL,
  status TEXT, -- 'pending', 'approved', 'declined'
  valid_until DATE
);

-- Work Orders (approved work)
CREATE TABLE work_orders (
  id UUID PRIMARY KEY,
  estimate_id UUID REFERENCES estimates(id), -- link to original quote
  customer_id UUID,
  vehicle_id UUID,
  status TEXT, -- 'in_progress', 'quality_check', 'completed'
  actual_amount DECIMAL
);

-- Invoices (billing)
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  work_order_id UUID REFERENCES work_orders(id),
  invoice_number TEXT,
  total_amount DECIMAL,
  paid BOOLEAN,
  payment_date DATE
);
```

## Recommended: **Option B** (Simplest, Uses Existing Table)

### UI Changes Needed:

1. **Dashboard "New Work Order" button** → **"Create Estimate"**
2. **Estimate Modal**: Create quote, status = 'estimate'
3. **Estimate can be:**
   - **Approved** → Convert to work order (status = 'approved')
   - **Declined** → Mark declined
   - **Modified** → Edit and re-send
4. **When work completed** → Auto-generate invoice view
5. **Invoice = Read-only view** of completed work order with payment tracking

### Button Labels:
- "Create Estimate" (primary action)
- "Convert to Work Order" (after customer approves)
- "Generate Invoice" (after work completed)
- "Mark as Paid" (after payment received)

## Implementation Steps

1. Update `status` enum in database:
```sql
ALTER TABLE work_orders 
  DROP CONSTRAINT IF EXISTS work_orders_status_check;
  
ALTER TABLE work_orders 
  ADD CONSTRAINT work_orders_status_check 
  CHECK (status IN ('estimate', 'approved', 'in_progress', 'quality_check', 'completed', 'picked_up', 'declined'));
```

2. Update TypeScript types in `src/types/database.ts`

3. Update UI components:
   - CreateWorkOrderModal → CreateEstimateModal
   - Add "Convert to WO" button on estimate cards
   - Add "Generate Invoice" button on completed work orders
   - Create InvoiceView component

4. Add workflow actions:
   - `approveEstimate()` → changes status from 'estimate' to 'approved'
   - `startWork()` → changes status to 'in_progress'
   - `completeWork()` → changes status to 'completed', enables invoice
   - `markPaid()` → add payment tracking

Would you like me to implement this?

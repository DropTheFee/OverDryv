# 🚀 STEP 1: START HERE

**Status:** Ready to begin Phase 0  
**Date:** January 13, 2026

---

## 📍 Where We Are

✅ **Planning Complete:**
- [MVP-MIGRATION-PLAN.md](./MVP-MIGRATION-PLAN.md) - Updated with Phase 0 (Subscriptions first)
- [SUBSCRIPTION-ARCHITECTURE.md](./SUBSCRIPTION-ARCHITECTURE.md) - Complete subscription system design

✅ **Architecture Defined:**
- 5 subscription tiers: Starter ($97), Professional ($197), Growth ($347), Enterprise (Custom), Founder ($7,500)
- 25+ features mapped to tiers
- Database schema for feature flags (normalized tables, not JSONB)
- React TenantContext for feature gating
- Integration dependency map (Twilio, AWS S3, Digits AI, PartsTech, Honkamp)

---

## ⚡ STEP 1: Create Subscription Database Schema

### **What to Do RIGHT NOW (30-60 minutes)**

#### 1. Create Migration File

```bash
cd /workspaces/OverDryv
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_add_subscription_infrastructure.sql
```

#### 2. Copy Schema from Documentation

Open [SUBSCRIPTION-ARCHITECTURE.md](./SUBSCRIPTION-ARCHITECTURE.md) and copy the **complete database schema** section including:

**Tables to create:**
- Update `organizations` table (add subscription fields)
- `organization_features` table
- `organization_integrations` table
- `feature_audit_log` table
- `subscription_history` table
- `usage_tracking` table

**Triggers to create:**
- `sync_features_on_tier_change()` - Auto-enable features on tier change
- `check_feature_dependencies()` - Validate integrations before enabling features
- `log_feature_change()` - Auto-log all changes to audit table

**Views to create:**
- `v_organization_features` - Quick feature lookup
- `v_organization_integrations` - Integration status overview
- `v_feature_audit_summary` - Audit log summary

#### 3. Run Migration

**Option A: Supabase Dashboard**
```
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
2. Click "SQL Editor"
3. Paste the migration SQL
4. Click "Run"
```

**Option B: Supabase CLI**
```bash
supabase migration up
```

#### 4. Seed Demo Organization

```sql
-- Update demo organization with subscription plan
UPDATE organizations 
SET 
  subscription_plan = 'professional',
  monthly_price = 197,
  user_limit = 3,
  subscription_status = 'active',
  is_founder = false
WHERE subdomain = 'demo';

-- The trigger will automatically populate organization_features table
-- with all Professional-tier features
```

#### 5. Verify Tables Created

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'organization_features',
  'organization_integrations',
  'feature_audit_log',
  'subscription_history',
  'usage_tracking'
);

-- Check demo org has features
SELECT * FROM v_organization_features WHERE organization_name = 'Demo Organization';

-- Should show 15+ features enabled for Professional tier
```

---

## 🎯 STEP 2: Create TypeScript Configuration (2-3 hours)

### **Create Feature Config File**

```bash
cd /workspaces/OverDryv
mkdir -p src/config
touch src/config/featureConfig.ts
```

### **Copy Configuration**

Open [SUBSCRIPTION-ARCHITECTURE.md](./SUBSCRIPTION-ARCHITECTURE.md) and find the **Feature Enablement Matrix** section.

Copy the complete TypeScript code including:
- `FEATURE_CONFIG` object (Starter, Professional, Growth, Enterprise, Founder)
- `INTEGRATION_DEPENDENCIES` map
- Helper functions: `isFeatureEnabled()`, `getFeatureDependencies()`, `areDependenciesConfigured()`

### **Update Type Definitions**

```bash
# Edit: src/types/database.ts
# Add interfaces for Organization, OrganizationFeature, OrganizationIntegration
```

### **Test Configuration**

```typescript
// Test in browser console or create test file
import { FEATURE_CONFIG } from './config/featureConfig';

console.log(FEATURE_CONFIG.PROFESSIONAL.features.time_keeping);
// Should output: { enabled: true, dependencies: [] }

console.log(FEATURE_CONFIG.STARTER.features.time_keeping);
// Should output: undefined (not available in Starter)
```

---

## 🔥 STEP 3: Implement TenantContext (3-4 hours)

### **Create Context Provider**

```bash
cd /workspaces/OverDryv
mkdir -p src/contexts
touch src/contexts/TenantContext.tsx
```

### **Copy Implementation**

Open [SUBSCRIPTION-ARCHITECTURE.md](./SUBSCRIPTION-ARCHITECTURE.md) and find the **React Frontend Feature Gating** section.

Copy the complete `TenantContext.tsx` code including:
- TenantContext provider
- `useTenant()` hook
- Real-time subscription handlers

### **Update App.tsx**

```tsx
// src/App.tsx
import { TenantProvider } from './contexts/TenantContext';

function App() {
  return (
    <AuthProvider>
      <TenantProvider>  {/* ← ADD THIS */}
        <Router>
          {/* Your routes */}
        </Router>
      </TenantProvider>
    </AuthProvider>
  );
}
```

### **Test TenantContext**

Create a test component:

```tsx
// src/components/TenantTest.tsx
import { useTenant } from '../contexts/TenantContext';

export function TenantTest() {
  const { tenant, hasFeature, hasIntegration, loading } = useTenant();
  
  if (loading) return <div>Loading tenant...</div>;
  
  if (!tenant) return <div>No tenant found</div>;
  
  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">Tenant Test</h2>
      <div className="space-y-2">
        <p><strong>Organization:</strong> {tenant.organization.name}</p>
        <p><strong>Subdomain:</strong> {tenant.organization.subdomain}</p>
        <p><strong>Plan:</strong> {tenant.organization.subscription_plan}</p>
        <p><strong>User Limit:</strong> {tenant.organization.user_limit || 'Unlimited'}</p>
        
        <h3 className="font-bold mt-4">Feature Checks:</h3>
        <p>Time-Keeping: {hasFeature('time_keeping') ? '✅ Yes' : '❌ No'}</p>
        <p>SMS Notifications: {hasFeature('sms_notifications') ? '✅ Yes' : '❌ No'}</p>
        <p>API Access: {hasFeature('api_access') ? '✅ Yes' : '❌ No'}</p>
        
        <h3 className="font-bold mt-4">Integration Checks:</h3>
        <p>Twilio: {hasIntegration('twilio') ? '✅ Configured' : '❌ Not configured'}</p>
        <p>AWS S3: {hasIntegration('aws_s3') ? '✅ Configured' : '❌ Not configured'}</p>
      </div>
    </div>
  );
}
```

Add to a page temporarily to verify:
```tsx
// In AdminDashboard.tsx or similar
import { TenantTest } from '../components/TenantTest';

// Add inside render:
<TenantTest />
```

**Expected Result:**
- Shows "Demo Organization"
- Plan: "professional"
- Time-Keeping: ✅ Yes
- SMS Notifications: ✅ Yes
- API Access: ❌ No (Growth+ only)

---

## 🎨 STEP 4: Create UI Components (2-3 hours)

### **Create Components Directory**

```bash
cd /workspaces/OverDryv
mkdir -p src/components/ui
touch src/components/ui/UpgradePrompt.tsx
touch src/components/ui/ConfigureIntegrationPrompt.tsx
touch src/components/ui/FeatureGate.tsx
```

### **Copy Component Code**

Open [SUBSCRIPTION-ARCHITECTURE.md](./SUBSCRIPTION-ARCHITECTURE.md) and find the component implementations:

1. **UpgradePrompt** - Shows tier comparison, upgrade button
2. **ConfigureIntegrationPrompt** - Links to integration settings
3. **FeatureGate** - Wrapper component for conditional rendering

### **Test UpgradePrompt**

```tsx
// Add to any page temporarily
<UpgradePrompt 
  feature="API Access" 
  requiredTier="Growth"
  currentPrice="$197/mo"
  upgradePrice="$347/mo"
/>
```

**Expected Result:**
- Shows side-by-side comparison
- "Current: Professional $197/mo" vs "Upgrade to: Growth $347/mo"
- "Upgrade Now" button

---

## ✅ STEP 5: Verify Phase 0 Complete (1-2 hours)

### **Checklist:**

- [ ] All 6 database tables exist
- [ ] Triggers functional (test by changing subscription_plan)
- [ ] Demo org has features in organization_features table
- [ ] `featureConfig.ts` created with all tiers
- [ ] Type definitions updated
- [ ] TenantContext.tsx implemented
- [ ] App.tsx wrapped with TenantProvider
- [ ] UpgradePrompt component works
- [ ] ConfigureIntegrationPrompt component works
- [ ] FeatureGate wrapper works
- [ ] `useTenant()` hook returns correct data
- [ ] `hasFeature()` returns correct values
- [ ] `hasIntegration()` validates correctly

### **Manual Tests:**

```
Test 1: Change subscription tier
1. Run SQL: UPDATE organizations SET subscription_plan = 'starter' WHERE subdomain = 'demo';
2. Refresh app
3. TenantTest should show Time-Keeping: ❌ No
4. Run SQL: UPDATE organizations SET subscription_plan = 'professional' WHERE subdomain = 'demo';
5. Refresh app
6. TenantTest should show Time-Keeping: ✅ Yes

Test 2: Feature gate
1. Add <FeatureGate feature="time_keeping" requiredTier="Professional">...</FeatureGate>
2. Set org to 'starter'
3. Should show upgrade prompt
4. Set org to 'professional'
5. Should show content

Test 3: Real-time updates
1. Open app in 2 tabs
2. In tab 1: Change subscription_plan via SQL
3. In tab 2: Features should update automatically (no refresh needed)
```

---

## 🎉 When Phase 0 is Complete

**You will have:**
- ✅ Subscription infrastructure fully functional
- ✅ Feature gating working throughout the app
- ✅ Database schema ready for multi-tenant
- ✅ React context providing tenant data
- ✅ UI components for upgrade prompts
- ✅ Real-time feature updates

**You are ready for:**
- Phase 1: Work Orders Database Migration
- Phase 2: Invoice System Migration
- Phase 3: Auth Fixes
- Phase 4: URL Restructure
- Phase 5: Multi-Tenant Implementation
- Phase 6: Testing & Deployment

---

## 📊 Timeline Estimate

| Step | Task | Time | When |
|------|------|------|------|
| 1 | Database schema | 1-2 hours | Right now |
| 2 | Feature config | 2-3 hours | After Step 1 |
| 3 | TenantContext | 3-4 hours | After Step 2 |
| 4 | UI components | 2-3 hours | After Step 3 |
| 5 | Testing | 1-2 hours | After Step 4 |
| **Total** | **Phase 0** | **8-12 hours** | **Day 1** |

---

## 🆘 If You Get Stuck

**Database Issues:**
- Check Supabase logs in dashboard
- Verify migrations ran: `SELECT * FROM schema_migrations;`
- Check RLS policies: `SELECT * FROM pg_policies;`

**TypeScript Errors:**
- Ensure all types imported correctly
- Check `database.ts` has new interfaces
- Verify `featureConfig.ts` exports properly

**TenantContext Not Loading:**
- Check browser console for errors
- Verify `profile.organization_id` exists
- Check Supabase query in Network tab
- Ensure RLS policies allow read access

**Real-Time Not Working:**
- Check Supabase Realtime is enabled in dashboard
- Verify channel subscriptions in console
- Check for WebSocket connection errors

---

## 📚 Reference

- [MVP-MIGRATION-PLAN.md](./MVP-MIGRATION-PLAN.md) - Complete migration plan
- [SUBSCRIPTION-ARCHITECTURE.md](./SUBSCRIPTION-ARCHITECTURE.md) - All implementation details
- [WORKFLOW-ESTIMATES-INVOICES.md](./WORKFLOW-ESTIMATES-INVOICES.md) - Business workflows

---

**Current Status:** Ready to begin Step 1  
**Next Action:** Create subscription database schema migration  
**Estimated Time to Phase 0 Complete:** 8-12 hours

---

**Let's build! 🚀**

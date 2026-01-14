# Subdomain Multi-Tenancy Setup Guide

## ✅ What's Already Done (Phase 5)
- Subdomain detection code in `src/utils/subdomain.ts`
- AuthContext loads organization by subdomain
- TenantContext uses subdomain-based organization
- Local testing support via `?org=subdomain` parameter

## 🔧 What You Need to Do

### Step 1: Run Database Migration
Apply the demo organization migration to Supabase:

```bash
# In Supabase SQL Editor, run:
supabase/migrations/add_demo_organization.sql
```

**OR** if using Supabase CLI:
```bash
supabase db push
```

This creates:
- Demo organization with subdomain "demo"
- Links demo@overdryv.io user to this organization
- Enables Professional tier features

### Step 2: Test Locally (Works Immediately)
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:5173/login?org=demo`
3. Login with: `demo@overdryv.io` / `Demo123!`
4. You should see "Demo Auto Shop" context loaded

### Step 3: Cloudflare DNS Setup (For Production Subdomains)

#### 3a. Add Wildcard DNS Record
In Cloudflare dashboard:
1. Go to DNS settings for `overdryv.app`
2. Add CNAME record:
   - **Type:** CNAME
   - **Name:** `*` (wildcard)
   - **Target:** `cname.vercel-dns.com` (or your current Vercel target)
   - **Proxy status:** Proxied (orange cloud)
   - **TTL:** Auto

#### 3b. Configure Vercel
In Vercel dashboard:
1. Go to Project Settings → Domains
2. Add domain: `*.overdryv.app`
3. Verify ownership (may require TXT record)
4. Wait for SSL certificate provisioning

### Step 4: Test Production
Once DNS propagates (5-30 minutes):
```
https://demo.overdryv.app/login
```

## 🧪 Testing Scenarios

### Scenario 1: No Subdomain (Main Site)
- URL: `https://overdryv.app`
- Expected: Landing page, no organization context
- User sees: Public marketing site

### Scenario 2: Demo Subdomain
- URL: `https://demo.overdryv.app/login`
- Expected: Loads "Demo Auto Shop" organization
- User sees: Professional tier features enabled

### Scenario 3: Local Development
- URL: `http://localhost:5173/login?org=demo`
- Expected: Simulates demo.overdryv.app locally
- User sees: Same as production demo subdomain

## 📋 Verification Checklist

- [ ] Database migration applied
- [ ] `?org=demo` works locally
- [ ] Cloudflare wildcard DNS configured
- [ ] Vercel wildcard domain added
- [ ] SSL certificate provisioned
- [ ] `demo.overdryv.app` resolves correctly
- [ ] Login shows correct organization context

## 🐛 Troubleshooting

### "Organization not found"
- Check: Does organization exist in database with subdomain value?
- SQL: `SELECT * FROM organizations WHERE subdomain = 'demo';`

### DNS not resolving
- Wait 5-30 minutes for propagation
- Check: `dig demo.overdryv.app` or `nslookup demo.overdryv.app`

### Vercel 404 error
- Verify wildcard domain is added in Vercel
- Check domain status is "Active"
- Redeploy if needed

### Wrong organization loads
- Clear browser cache and localStorage
- Check URL subdomain spelling
- Verify user's profile.organization_id matches

## 🎯 Next Steps After Setup

Once subdomains work:
1. Create more organizations with unique subdomains
2. Set up signup flow to create organization + subdomain
3. Add subdomain availability checking
4. Implement organization switching for multi-org users

## 📝 Example: Adding New Organization

```sql
INSERT INTO organizations (
  subdomain,
  name,
  subscription_plan,
  subscription_status
) VALUES (
  'joes-garage',
  "Joe's Auto Repair",
  'starter',
  'active'
);

-- Get the new organization_id
-- Update user profile:
UPDATE profiles 
SET organization_id = '<new-org-id>'
WHERE email = 'joe@joesgarage.com';
```

Then visit: `https://joes-garage.overdryv.app`

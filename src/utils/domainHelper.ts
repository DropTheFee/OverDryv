/**
 * Extract subdomain from hostname
 * Returns null if on root domain (overdryv.app) or localhost
 */
export function getSubdomain(): string | null {
  const hostname = window.location.hostname;
  
  // Localhost or IP address - no subdomain
  if (hostname === 'localhost' || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }
  
  // Split hostname into parts
  const parts = hostname.split('.');
  
  // Root domain (overdryv.app) or preview URLs (*.vercel.app) - no subdomain
  if (parts.length <= 2) {
    return null;
  }
  
  // Check if it's a Vercel preview URL (subdomain-hash.vercel.app)
  if (parts[parts.length - 2] === 'vercel' && parts[parts.length - 1] === 'app') {
    return null;
  }
  
  // Extract subdomain (first part before .overdryv.app)
  return parts[0];
}

/**
 * Check if we're on the root domain (no subdomain)
 */
export function isRootDomain(): boolean {
  return getSubdomain() === null;
}

/**
 * Check if we're on a tenant subdomain
 */
export function isTenantSubdomain(): boolean {
  return getSubdomain() !== null;
}
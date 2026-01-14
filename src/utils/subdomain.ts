/**
 * Subdomain detection utility for multi-tenant support
 * 
 * Examples:
 * - demo.overdryv.app → "demo"
 * - localhost:5173 → null (development)
 * - overdryv.app → null (main site)
 */

export const getSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  
  // Development environment (localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // You can set a test subdomain via URL param for local testing
    const params = new URLSearchParams(window.location.search);
    return params.get('org') || null;
  }
  
  // Split hostname into parts
  const parts = hostname.split('.');
  
  // If there are 3+ parts (e.g., demo.overdryv.app), the first part is the subdomain
  if (parts.length >= 3) {
    return parts[0];
  }
  
  // No subdomain (e.g., overdryv.app or www.overdryv.app)
  return null;
};

export const buildSubdomainUrl = (subdomain: string | null): string => {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  // Development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `${protocol}//${window.location.hostname}${port}${subdomain ? `?org=${subdomain}` : ''}`;
  }
  
  // Production - get base domain (e.g., overdryv.app)
  const parts = window.location.hostname.split('.');
  const baseDomain = parts.length >= 2 ? parts.slice(-2).join('.') : window.location.hostname;
  
  if (subdomain) {
    return `${protocol}//${subdomain}.${baseDomain}${port}`;
  }
  
  return `${protocol}//${baseDomain}${port}`;
};

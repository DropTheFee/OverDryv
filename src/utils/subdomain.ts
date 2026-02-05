/**
 * Subdomain detection utility for multi-tenant support
 * 
 * Examples:
 * - demo.overdryv.app → "demo"
 * - www.overdryv.app → null (root domain)
 * - localhost:5173 → null (development)
 * - overdryv.app → null (main site)
 */

export const getSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return new URLSearchParams(window.location.search).get('tenant');
  }
  
  // Production: extract subdomain
  const parts = hostname.split('.');
  
  // Handle www.overdryv.app as root domain (return null)
  // Handle overdryv.app as root domain (return null)  
  // Handle demo.overdryv.app as subdomain (return "demo")
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0];
  }
  
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

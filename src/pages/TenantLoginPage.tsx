import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { Eye, EyeOff } from 'lucide-react';

const TenantLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    password: '',
  });

  const { signIn, user, profile, loading: authLoading } = useAuth();
  const { organization, loading: tenantLoading } = useTenant();
  const navigate = useNavigate();

  // Auto-redirect after successful login when profile is loaded
  useEffect(() => {
    if (user && profile && !authLoading) {
      if (profile.role === 'customer') {
        navigate('/customer', { replace: true });
      } else if (profile.role === 'admin' || profile.role === 'technician' || profile.role === 'master_admin') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setError(error.message || 'Invalid email or password');
        setLoading(false);
        return;
      }
      // useEffect will handle navigation when profile loads
      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  // Show loading only while tenant is loading, not while auth is loading
  if (tenantLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          {/* Shop Logo or OverDryv Logo */}
          <div className="flex justify-center mb-4">
            {organization?.logo_url || organization?.settings?.logo_url ? (
              <img 
                src={organization.logo_url || organization.settings?.logo_url} 
                alt={`${organization.name} Logo`}
                className="h-16 w-auto"
              />
            ) : (
              <img 
                src="/OverdryvLogov3.png" 
                alt="OverDryv Logo" 
                className="h-16 w-auto"
              />
            )}
          </div>
          
          {/* Organization Name */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {organization?.name || 'Sign In'}
          </h2>
          <p className="text-gray-600">
            Access your service portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <input
            type="email"
            required
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              autoComplete="current-password"
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold">OverDryv</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TenantLoginPage;
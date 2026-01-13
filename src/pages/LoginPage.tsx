import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wrench, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const { signIn, signUp, profile } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect after successful login when profile is loaded
  useEffect(() => {
    if (profile && !loading && !error) {
      if (profile.role === 'customer') {
        navigate('/customer', { replace: true });
      } else if (profile.role === 'admin' || profile.role === 'technician') {
        navigate('/admin', { replace: true });
      }
    }
  }, [profile, loading, error, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
        if (error) {
          console.error('Sign up error:', error);
          setError(error.message || 'Failed to create account');
          setLoading(false);
          return;
        }
        // Profile will be loaded and useEffect will handle navigation
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          console.error('Sign in error:', error);
          setError(error.message || 'Invalid email or password');
          setLoading(false);
          return;
        }
        // Profile will be loaded and useEffect will handle navigation
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Wrench className="w-12 h-12 text-accent-600 transform rotate-45" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp 
              ? 'Join thousands of satisfied customers who trust OverDryv' 
              : 'Access your personalized service portal'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                required
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <input
            type="email"
            required
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {isSignUp && (
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          )}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':&quot;\\|,.<>\/?`~]).{8,}$"
              title="Password must contain at least 8 characters with uppercase, lowercase, number, and special character"
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
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-primary-600 hover:text-primary-500 font-semibold"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <div className="text-center pt-4 border-t border-gray-200">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Demo Credentials (Shop Owner View):</p>
            <p className="text-sm text-blue-700">Email: demo@overdryv.io</p>
            <p className="text-sm text-blue-700">Password: Demo123!</p>
          </div>
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
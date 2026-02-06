import React, { useState } from 'react';
import { ArrowRight, Search, Wrench } from 'lucide-react';
import { supabase } from '../lib/supabase';

const RootLandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setError(null);

    try {
      // Query profiles table to find user's organization_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (profileError || !profileData) {
        setError('No account found for this email. Contact your shop administrator or request a demo.');
        setSearching(false);
        return;
      }

      // Query organizations table to get subdomain
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('subdomain')
        .eq('id', profileData.organization_id)
        .single();

      if (orgError || !orgData) {
        setError('Unable to find your shop. Please contact support.');
        setSearching(false);
        return;
      }

      // Redirect to tenant subdomain with pre-filled email
      const subdomain = orgData.subdomain;
      const redirectUrl = `https://${subdomain}.overdryv.app/login?email=${encodeURIComponent(email)}`;
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Error finding shop:', err);
      setError('An error occurred. Please try again.');
      setSearching(false);
    }
  };

  const scrollToFindShop = () => {
    document.getElementById('find-shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <nav className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/OverdryvLogov3.png" 
                alt="OverDryv Logo" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="https://demo.overdryv.app/login"
                className="hover:text-accent-300 transition-colors font-medium"
              >
                Try Demo
              </a>
              <button
                onClick={scrollToFindShop}
                className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Find Your Shop
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="/OverdryvLogov3.png" 
              alt="OverDryv Logo" 
              className="h-32 w-auto"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">OverDryv</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The complete automotive shop management platform that keeps your business running smoothly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://demo.overdryv.app/login" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2 shadow-lg"
            >
              Try Demo <ArrowRight className="w-5 h-5" />
            </a>
            <button
              onClick={scrollToFindShop}
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2 border-gray-300 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find Your Shop
            </button>
          </div>
        </div>
      </div>

      {/* Find Your Shop Section */}
      <div id="find-shop" className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Shop</h2>
            <p className="text-gray-600">
              Enter your email address to find your shop's login page
            </p>
          </div>

          <form onSubmit={handleFindShop} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={searching || !email.trim()}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {searching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Find Shop
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Don't have an account? Contact your shop administrator or{' '}
              <a href="https://demo.overdryv.app/login" className="text-primary-600 hover:text-primary-700 font-medium">
                try our demo
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2026 OverDryv. Professional automotive shop management software.
          </p>
          <p className="text-xs mt-2">
            Questions? Visit <a href="https://overdryv.io" className="text-primary-400 hover:text-primary-300">OverDryv.io</a> or contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default RootLandingPage;
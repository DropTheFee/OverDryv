import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isRootDomain } from '../../utils/domainHelper';
import { User, LogOut, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const onRootDomain = isRootDomain();

  const handleSignOut = async () => {
    await signOut();
  };

  // Root domain navbar - no authentication, minimal navigation
  if (onRootDomain) {
    return (
      <nav className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src="/OverdryvLogov3.png" 
                alt="OverDryv Logo" 
                className="h-10 w-auto"
              />
            </Link>

            <div className="flex items-center space-x-6">
              <a 
                href="https://demo.overdryv.app/login"
                className="hover:text-accent-300 transition-colors font-medium"
              >
                Try Demo
              </a>
              <button
                onClick={() => document.getElementById('find-shop')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Find Your Shop
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Subdomain navbar - full authentication and navigation
  return (
    <nav className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src="/OverdryvLogov3.png" 
              alt="OverDryv Logo" 
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center space-x-6">
            {!user ? (
              <Link to="/login" className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md font-medium transition-colors">
                Login
              </Link>
            ) : (
              <>
                <span className="text-sm">
                  Welcome, {profile?.first_name || user.email?.split('@')[0]}
                </span>
                
                {/* Check In link - only visible after login on subdomain */}
                <Link to="/check-in" className="hover:text-orange-300 transition-colors font-medium">
                  Check In
                </Link>
                
                {profile?.role === 'customer' && (
                  <Link to="/customer" className="flex items-center space-x-1 hover:text-orange-300 transition-colors">
                    <User className="w-4 h-4" />
                    <span>My Portal</span>
                  </Link>
                )}
                {(profile?.role === 'admin' || profile?.role === 'technician' || profile?.role === 'master_admin') && (
                  <Link to="/dashboard" className="flex items-center space-x-1 hover:text-accent-300 transition-colors">
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                {!profile && (
                  <Link to="/dashboard" className="flex items-center space-x-1 hover:text-accent-300 transition-colors">
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 hover:text-accent-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
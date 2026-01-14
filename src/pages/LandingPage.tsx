import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, BarChart3, Shield, Zap, ArrowRight, Wrench } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            <Link 
              to="/login" 
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2 border-gray-300 flex items-center gap-2"
            >
              Client Login
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Existing clients: Your shop has its own dedicated subdomain (e.g., yourshop.overdryv.app)
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Manage Your Shop
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Users className="w-8 h-8" />}
            title="Customer Management"
            description="Keep detailed customer profiles, service history, and communication logs all in one place"
          />
          <FeatureCard 
            icon={<Wrench className="w-8 h-8" />}
            title="Work Orders"
            description="Create, track, and manage work orders with real-time status updates for your customers"
          />
          <FeatureCard 
            icon={<FileText className="w-8 h-8" />}
            title="Digital Check-In"
            description="Streamline customer check-in with digital forms, photo uploads, and electronic waivers"
          />
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8" />}
            title="Parts Inventory"
            description="Track parts, manage inventory levels, and automate reordering to keep your shop stocked"
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8" />}
            title="Invoicing"
            description="Generate professional invoices with labor, parts, and tax calculations automatically"
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8" />}
            title="Real-Time Updates"
            description="Keep customers informed with automated status updates and notifications"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Shop?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            See how OverDryv can streamline your operations and delight your customers
          </p>
          <a 
            href="https://demo.overdryv.app/login" 
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2"
          >
            Start Demo <ArrowRight className="w-5 h-5" />
          </a>
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

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ 
  icon, 
  title, 
  description 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-primary-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPage;

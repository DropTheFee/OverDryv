import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, FileText } from 'lucide-react';

const CustomerNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/customer', icon: Home, label: 'Dashboard' },
    { path: '/customer/status', icon: Clock, label: 'Service Status' },
    { path: '/customer/history', icon: FileText, label: 'Service History' },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                location.pathname === item.path
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CustomerNavigation;
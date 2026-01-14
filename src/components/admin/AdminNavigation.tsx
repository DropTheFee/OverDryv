import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Car, 
  BarChart3,
  Package,
  Settings,
  FileText
} from 'lucide-react';

const AdminNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/estimates', icon: FileText, label: 'Estimates' },
    { path: '/dashboard/work-orders', icon: ClipboardList, label: 'Work Orders' },
    { path: '/dashboard/customers', icon: Users, label: 'Customers' },
    { path: '/dashboard/vehicles', icon: Car, label: 'Vehicles' },
    { path: '/dashboard/parts', icon: Package, label: 'Parts' },
    { path: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

export default AdminNavigation;
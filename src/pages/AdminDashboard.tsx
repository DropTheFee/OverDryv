import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavigation from '../components/admin/AdminNavigation';
import AdminOverview from '../components/admin/AdminOverview';
import EstimatesManagement from '../components/admin/EstimatesManagement';
import WorkOrdersManagement from '../components/admin/WorkOrdersManagement';
import CustomersManagement from '../components/admin/CustomersManagement';
import VehiclesManagement from '../components/admin/VehiclesManagement';
import PartsInventory from '../components/admin/PartsInventory';
import ReportsSection from '../components/admin/ReportsSection';
import AdminSettings from '../components/admin/AdminSettings';
import { SubscriptionTest } from '../components/admin/SubscriptionTest';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="estimates" element={<EstimatesManagement />} />
          <Route path="work-orders" element={<WorkOrdersManagement />} />
          <Route path="customers" element={<CustomersManagement />} />
          <Route path="vehicles" element={<VehiclesManagement />} />
          <Route path="parts" element={<PartsInventory />} />
          <Route path="reports" element={<ReportsSection />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="test-subscription" element={<SubscriptionTest />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
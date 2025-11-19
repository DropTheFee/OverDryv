import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerDashboard from '../components/customer/CustomerDashboard';
import VehicleStatus from '../components/customer/VehicleStatus';
import ServiceHistory from '../components/customer/ServiceHistory';
import CustomerNavigation from '../components/customer/CustomerNavigation';

const CustomerPortal: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<CustomerDashboard />} />
          <Route path="status" element={<VehicleStatus />} />
          <Route path="history" element={<ServiceHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default CustomerPortal;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CheckInPage from './pages/CheckInPage';
import InvoiceDemo from './pages/InvoiceDemo';
import AdminDashboard from './pages/AdminDashboard';
import CustomerPortal from './pages/CustomerPortal';

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/demo" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/check-in" element={<CheckInPage />} />
            <Route path="/invoice-demo" element={<InvoiceDemo />} />
            <Route path="/dashboard/*" element={<AdminDashboard />} />
            <Route path="/customer/*" element={<CustomerPortal />} />
          </Routes>
        </Layout>
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;
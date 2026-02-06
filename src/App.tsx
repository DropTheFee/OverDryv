import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { isRootDomain } from './utils/domainHelper';
import Layout from './components/layout/Layout';
import RootLandingPage from './pages/RootLandingPage';
import TenantLoginPage from './pages/TenantLoginPage';
import CheckInPage from './pages/CheckInPage';
import InvoiceDemo from './pages/InvoiceDemo';
import AdminDashboard from './pages/AdminDashboard';
import CustomerPortal from './pages/CustomerPortal';

function App() {
  const onRootDomain = isRootDomain();

  return (
    <TenantProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            {onRootDomain ? (
              // Root domain routes - no authentication, just routing
              <>
                <Route path="/" element={<RootLandingPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              // Subdomain routes - full app functionality
              <>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<TenantLoginPage />} />
                <Route path="/check-in" element={<CheckInPage />} />
                <Route path="/invoice-demo" element={<InvoiceDemo />} />
                <Route path="/dashboard/*" element={<AdminDashboard />} />
                <Route path="/customer/*" element={<CustomerPortal />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
        </Layout>
      </AuthProvider>
    </TenantProvider>
  );
}

export default App;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CheckInPage from './pages/CheckInPage';
import PricingPage from './pages/PricingPage';
import InvoiceDemo from './pages/InvoiceDemo';
import AdminDashboard from './pages/AdminDashboard';
import CustomerPortal from './pages/CustomerPortal';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/invoice-demo" element={<InvoiceDemo />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/customer/*" element={<CustomerPortal />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
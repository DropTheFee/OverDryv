import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Mail, Phone, Car, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTenant } from '../../contexts/TenantContext';
import CustomerProfileModal from './CustomerProfileModal';
import CustomerHistoryModal from './CustomerHistoryModal';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: number | null;
  created_at: string;
  vehicles: Array<{ id: string; make: string; model: string; year: number; color: string; license_plate: string }>;
  work_orders: Array<{ id: string; status: string; service_type: string; created_at: string }>;
}

const CustomersManagement: React.FC = () => {
  const navigate = useNavigate();
  const { organizationId } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organizationId) {
      fetchCustomers();
    }
  }, [organizationId]);

  const fetchCustomers = async () => {
    if (!organizationId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          vehicles (id, make, model, year, color, license_plate),
          work_orders:work_orders!customer_id (id, status, description, created_at)
        `)
        .eq('organization_id', organizationId)
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone: number | null): string => {
    if (!phone) return 'N/A';
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
    }
    return phoneStr;
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(searchLower) ||
      customer.last_name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      (customer.phone && customer.phone.toString().includes(searchTerm))
    );
  });

  const calculateTotalSpent = (workOrders: Customer['work_orders']) => {
    // This is a placeholder - in production, you'd sum invoice amounts
    return workOrders.filter(wo => wo.status === 'completed').length * 250;
  };

  const getLastServiceDate = (workOrders: Customer['work_orders']) => {
    if (!workOrders || workOrders.length === 0) return null;
    const sorted = [...workOrders].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sorted[0]?.created_at;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
          <p className="text-gray-600">Manage customer information and relationships</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          <span onClick={() => navigate('/check-in')}>Add Customer</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">{customers.length}</h3>
          <p className="text-gray-600">Total Customers</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {customers.reduce((sum, c) => sum + (c.vehicles?.length || 0), 0)}
          </h3>
          <p className="text-gray-600">Total Vehicles</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            ${customers.reduce((sum, c) => sum + calculateTotalSpent(c.work_orders || []), 0).toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            ${customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + calculateTotalSpent(c.work_orders || []), 0) / customers.length) : 0}
          </h3>
          <p className="text-gray-600">Avg. Customer Value</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map(customer => {
                  const lastService = getLastServiceDate(customer.work_orders || []);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Customer since {new Date(customer.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            {formatPhoneNumber(customer.phone)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Car className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{customer.vehicles?.length || 0} vehicles</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {customer.work_orders?.length || 0} orders
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {lastService ? new Date(lastService).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => {
                              setSelectedCustomerId(customer.id);
                              setShowProfile(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Customer Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedCustomerId(customer.id);
                              setShowHistory(true);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                          >
                            View History
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Profile Modal */}
      {showProfile && selectedCustomerId && (
        <CustomerProfileModal
          customerId={selectedCustomerId}
          onClose={() => {
            setShowProfile(false);
            setSelectedCustomerId(null);
          }}
        />
      )}

      {/* Customer History Modal */}
      {showHistory && selectedCustomerId && (
        <CustomerHistoryModal
          customerId={selectedCustomerId}
          onClose={() => {
            setShowHistory(false);
            setSelectedCustomerId(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomersManagement;
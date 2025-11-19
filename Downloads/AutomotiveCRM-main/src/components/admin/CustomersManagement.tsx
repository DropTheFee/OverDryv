import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Mail, Phone, Car, Eye } from 'lucide-react';
import CustomerProfileModal from './CustomerProfileModal';
import CustomerHistoryModal from './CustomerHistoryModal';

const CustomersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Mock data
  const customers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      vehicles: 2,
      totalSpent: 1250.75,
      lastService: '2025-01-15',
      joinDate: '2024-03-15',
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Davis',
      email: 'sarah.davis@email.com',
      phone: '(555) 234-5678',
      vehicles: 1,
      totalSpent: 890.25,
      lastService: '2025-01-14',
      joinDate: '2024-06-20',
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike.chen@email.com',
      phone: '(555) 345-6789',
      vehicles: 1,
      totalSpent: 450.00,
      lastService: '2024-12-10',
      joinDate: '2024-08-05',
    },
  ];

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName} ${customer.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
              placeholder="Search customers..."
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
            {customers.reduce((sum, c) => sum + c.vehicles, 0)}
          </h3>
          <p className="text-gray-600">Total Vehicles</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            ${Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length)}
          </h3>
          <p className="text-gray-600">Avg. Customer Value</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                  Total Spent
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
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Customer since {new Date(customer.joinDate).toLocaleDateString()}
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
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Car className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{customer.vehicles} vehicles</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {new Date(customer.lastService).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => {
                          setSelectedCustomerId(customer.id.toString());
                          setShowProfile(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Customer Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedCustomerId(customer.id.toString());
                          setShowHistory(true);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                      >
                        View History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
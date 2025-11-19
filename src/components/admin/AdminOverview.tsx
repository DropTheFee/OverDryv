import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Package,
  Wrench,
  FileText,
  Settings
} from 'lucide-react';
import CreateWorkOrderModal from './CreateWorkOrderModal';
import AddCustomerModal from './AddCustomerModal';
import VehicleLookupModal from './VehicleLookupModal';

const AdminOverview: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateWorkOrder, setShowCreateWorkOrder] = React.useState(false);
  const [showAddCustomer, setShowAddCustomer] = React.useState(false);
  const [showVehicleLookup, setShowVehicleLookup] = React.useState(false);

  // Mock data
  const stats = [
    { label: 'Active Work Orders', value: 8, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed Today', value: 5, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: "Today's Revenue", value: '$1,247', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Customers', value: 156, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const activeWorkOrders = [
    {
      id: 'WO-001',
      customer: 'John Smith',
      vehicle: '2022 Toyota Camry',
      service: 'Oil Change & Inspection',
      status: 'in_progress',
      technician: 'Mike Johnson',
      priority: 'normal',
    },
    {
      id: 'WO-002', 
      customer: 'Sarah Davis',
      vehicle: '2020 Honda Civic',
      service: 'Brake Repair',
      status: 'quality_check',
      technician: 'Tom Wilson',
      priority: 'high',
    },
    {
      id: 'WO-003',
      customer: 'Mike Chen',
      vehicle: '2019 Ford F-150',
      service: 'Engine Diagnostics',
      status: 'pending',
      technician: null,
      priority: 'urgent',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'in_progress': return 'text-blue-700 bg-blue-100';
      case 'quality_check': return 'text-purple-700 bg-purple-100';
      case 'completed': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Overview</h1>
        <p className="text-gray-600">Real-time view of your automotive shop operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Work Orders */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Active Work Orders</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            New Work Order
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {activeWorkOrders.map(order => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Car className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.customer}</h3>
                    <p className="text-gray-600">{order.vehicle}</p>
                    <p className="text-sm text-gray-500">{order.service}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`text-xs font-medium ${getPriorityColor(order.priority)}`}>
                        {order.priority.toUpperCase()} PRIORITY
                      </span>
                      {order.technician && (
                        <span className="text-xs text-gray-500">
                          Assigned to {order.technician}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <Link 
                    to={`/admin/work-orders?view=${order.id}`}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowCreateWorkOrder(true)}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <Wrench className="w-6 h-6 text-blue-600 mb-2" />
          <p className="font-medium text-gray-900">New Work Order</p>
          <p className="text-sm text-gray-600">Create a new service order</p>
        </button>
        <button 
          onClick={() => setShowAddCustomer(true)}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <Users className="w-6 h-6 text-green-600 mb-2" />
          <p className="font-medium text-gray-900">Add Customer</p>
          <p className="text-sm text-gray-600">Register new customer</p>
        </button>
        <button 
          onClick={() => setShowVehicleLookup(true)}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <Car className="w-6 h-6 text-purple-600 mb-2" />
          <p className="font-medium text-gray-900">Vehicle Lookup</p>
          <p className="text-sm text-gray-600">Search vehicle history</p>
        </button>
        <button 
          onClick={() => navigate('/admin/parts')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <Package className="w-6 h-6 text-indigo-600 mb-2" />
          <p className="font-medium text-gray-900">Parts Inventory</p>
          <p className="text-sm text-gray-600">Manage parts and stock</p>
        </button>
        <button 
          onClick={() => navigate('/admin/reports')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <FileText className="w-6 h-6 text-purple-600 mb-2" />
          <p className="font-medium text-gray-900">View Reports</p>
          <p className="text-sm text-gray-600">Business analytics and reports</p>
        </button>
        <button 
          onClick={() => navigate('/admin/settings')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <Settings className="w-6 h-6 text-gray-600 mb-2" />
          <p className="font-medium text-gray-900">Shop Settings</p>
          <p className="text-sm text-gray-600">Configure dual pricing & more</p>
        </button>
        <button 
          onClick={() => navigate('/admin/reports')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
          <p className="font-medium text-gray-900">Daily Reports</p>
          <p className="text-sm text-gray-600">View today's metrics</p>
        </button>
      </div>

      {/* Alerts */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
          <div>
            <p className="text-sm font-medium text-orange-800">System Alert</p>
            <p className="text-sm text-orange-700">3 work orders are past their estimated completion time</p>
          </div>
        </div>
      </div>

      {/* Create Work Order Modal */}
      <CreateWorkOrderModal
        isOpen={showCreateWorkOrder}
        onClose={() => setShowCreateWorkOrder(false)}
        onSuccess={() => {
          setShowCreateWorkOrder(false);
          // Navigate to work orders page to see the new order
          navigate('/admin/work-orders');
        }}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onSuccess={(customer) => {
          setShowAddCustomer(false);
          alert(`Customer ${customer.first_name} ${customer.last_name} added successfully!`);
        }}
      />

      {/* Vehicle Lookup Modal */}
      <VehicleLookupModal
        isOpen={showVehicleLookup}
        onClose={() => setShowVehicleLookup(false)}
        onVehicleSelected={(vehicle) => {
          console.log('Vehicle selected:', vehicle);
          // Could navigate to vehicle profile or perform other actions
        }}
      />
    </div>
  );
};

export default AdminOverview;
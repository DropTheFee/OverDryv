import React, { useState, useEffect, useRef } from 'react';
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
import { supabase } from '../../lib/supabase';
import CreateWorkOrderModal from './CreateWorkOrderModal';
import AddCustomerModal from './AddCustomerModal';
import VehicleLookupModal from './VehicleLookupModal';

type WorkOrderRow = {
  id: string;
  work_order_number: string;
  status: string;
  service_type: string;
  priority?: string;
  total_amount: number;
  actual_completion: string | null;
  estimated_completion: string | null;
  created_at: string;
  customer?: { first_name: string; last_name: string } | null;
  vehicle?: { year: number; make: string; model: string } | null;
  technician?: { first_name: string; last_name: string } | null;
};

const AdminOverview: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateWorkOrder, setShowCreateWorkOrder] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showVehicleLookup, setShowVehicleLookup] = useState(false);
  const [workOrders, setWorkOrders] = useState<WorkOrderRow[]>([]);
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchData = async () => {
      try {
        const [woRes, countRes] = await Promise.all([
          supabase
            .from('work_orders')
            .select(
              'id, work_order_number, status, service_type, priority, total_amount, actual_completion, estimated_completion, created_at, customer:profiles!customer_id(first_name, last_name), vehicle:vehicles!vehicle_id(year, make, model), technician:profiles!technician_id(first_name, last_name)'
            )
            .order('created_at', { ascending: false }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
        ]);

        if (!mountedRef.current) return;
        if (woRes.error) throw woRes.error;
        if (countRes.error) throw countRes.error;

        setWorkOrders((woRes.data as WorkOrderRow[]) || []);
        setCustomerCount(countRes.count ?? 0);
      } catch (error: unknown) {
        if (!mountedRef.current) return;
        if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'AbortError') {
          return;
        }
        console.error('Error fetching overview data:', error);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const activeStatuses = ['pending', 'in_progress', 'quality_check', 'approved', 'estimate'];
  const activeWorkOrders = workOrders.filter((wo) => activeStatuses.includes(wo.status));
  const today = new Date().toDateString();
  const completedToday = workOrders.filter(
    (wo) => wo.status === 'completed' && wo.actual_completion && new Date(wo.actual_completion).toDateString() === today
  );
  const todayRevenue = completedToday.reduce((sum, wo) => sum + (wo.total_amount || 0), 0);
  const now = new Date();
  const overdueCount = workOrders.filter(
    (wo) =>
      !['completed', 'picked_up'].includes(wo.status) &&
      wo.estimated_completion &&
      new Date(wo.estimated_completion) < now
  ).length;

  const stats = [
    { label: 'Active Work Orders', value: activeWorkOrders.length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed Today', value: completedToday.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: "Today's Revenue", value: `$${todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Customers', value: customerCount, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

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
          <button
            onClick={() => setShowCreateWorkOrder(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            New Work Order
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {activeWorkOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No active work orders. Create one to get started.
            </div>
          ) : (
            activeWorkOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Car className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {order.customer?.first_name} {order.customer?.last_name}
                      </h3>
                      <p className="text-gray-600">
                        {order.vehicle?.year} {order.vehicle?.make} {order.vehicle?.model}
                      </p>
                      <p className="text-sm text-gray-500">{order.service_type}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`text-xs font-medium ${getPriorityColor(order.priority ?? '')}`}>
                          {(order.priority ?? 'normal').toUpperCase()} PRIORITY
                        </span>
                        {order.technician && (
                          <span className="text-xs text-gray-500">
                            Assigned to {order.technician.first_name} {order.technician.last_name}
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
                      to={`/dashboard/work-orders?view=${order.id}`}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
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
          onClick={() => navigate('/dashboard/parts')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <Package className="w-6 h-6 text-indigo-600 mb-2" />
          <p className="font-medium text-gray-900">Parts Inventory</p>
          <p className="text-sm text-gray-600">Manage parts and stock</p>
        </button>
        <button 
          onClick={() => navigate('/dashboard/reports')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <FileText className="w-6 h-6 text-purple-600 mb-2" />
          <p className="font-medium text-gray-900">View Reports</p>
          <p className="text-sm text-gray-600">Business analytics and reports</p>
        </button>
        <button 
          onClick={() => navigate('/dashboard/settings')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <Settings className="w-6 h-6 text-gray-600 mb-2" />
          <p className="font-medium text-gray-900">Shop Settings</p>
          <p className="text-sm text-gray-600">Configure dual pricing & more</p>
        </button>
        <button 
          onClick={() => navigate('/dashboard/reports')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
          <p className="font-medium text-gray-900">Daily Reports</p>
          <p className="text-sm text-gray-600">View today's metrics</p>
        </button>
      </div>

      {/* Alerts */}
      {overdueCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-orange-800">System Alert</p>
              <p className="text-sm text-orange-700">
                {overdueCount} work order{overdueCount !== 1 ? 's are' : ' is'} past their estimated completion time
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Work Order Modal */}
      <CreateWorkOrderModal
        isOpen={showCreateWorkOrder}
        onClose={() => setShowCreateWorkOrder(false)}
        onSuccess={() => {
          setShowCreateWorkOrder(false);
          // Navigate to work orders page to see the new order
          navigate('/dashboard/work-orders');
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
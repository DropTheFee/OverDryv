import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Eye, Edit, Clock, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import WorkOrderDetail from './WorkOrderDetail';
import CreateWorkOrderModal from './CreateWorkOrderModal';

const WorkOrdersManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(
    searchParams.get('view') || null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          customer:profiles!customer_id(id, first_name, last_name, email),
          vehicle:vehicles!vehicle_id(id, year, make, model, vin, license_plate),
          technician:profiles!technician_id(id, first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (!mountedRef.current) return;
      if (error) {
        console.error('Error fetching work orders:', error);
        setWorkOrders([]);
        return;
      }
      setWorkOrders(data || []);
    } catch (error: unknown) {
      if (!mountedRef.current) return;
      if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'AbortError') {
        // Ignore aborted requests, but allow finally to clear loading.
      } else {
        console.error('Error fetching work orders:', error);
        setWorkOrders([]);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchWorkOrders();
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'in_progress': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'quality_check': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'completed': return 'text-green-700 bg-green-100 border-green-200';
      case 'picked_up': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-green-600 bg-green-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCloseWorkOrder = () => {
    setSelectedWorkOrder(null);
    setSearchParams({});
  };

  const refreshWorkOrders = () => {
    fetchWorkOrders();
  };
  const filteredOrders = workOrders.filter(order => {
    const customerName = order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : '';
    const vehicleDesc = order.vehicle ? `${order.vehicle.year} ${order.vehicle.make} ${order.vehicle.model}` : '';
    const matchesSearch =
      (order.work_order_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.service_type || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: workOrders.length,
    pending: workOrders.filter(w => w.status === 'pending').length,
    inProgress: workOrders.filter(w => w.status === 'in_progress').length,
    completed: workOrders.filter(w => w.status === 'completed').length,
    overdue: workOrders.filter(w => 
      new Date(w.estimated_completion) < new Date() && 
      !['completed', 'picked_up'].includes(w.status)
    ).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Work Orders</h1>
          <p className="text-gray-600">Manage all vehicle service orders</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Work Order
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-gray-600 text-sm">Total Orders</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-gray-600 text-sm">Pending</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          <p className="text-gray-600 text-sm">In Progress</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-gray-600 text-sm">Completed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          <p className="text-gray-600 text-sm">Overdue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search work orders, customers, vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="quality_check">Quality Check</option>
            <option value="completed">Completed</option>
            <option value="picked_up">Picked Up</option>
          </select>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer / Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => {
                const isOverdue = new Date(order.estimated_completion) < new Date() && 
                                !['completed', 'picked_up'].includes(order.status);
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900 flex items-center">
                          {order.work_order_number}
                          {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(order.priority)}`}>
                            {order.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customer?.first_name} {order.customer?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.vehicle?.year} {order.vehicle?.make} {order.vehicle?.model}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{order.service_type}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {order.technician ? 
                        `${order.technician.first_name} ${order.technician.last_name}` : 
                        <span className="text-gray-400 italic">Unassigned</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setSelectedWorkOrder(order.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        {order.status === 'completed' && (
                          <button 
                            onClick={() => {
                              setSelectedWorkOrder(order.id);
                              // Auto-open invoice generator for completed orders
                              setTimeout(() => {
                                const event = new CustomEvent('openInvoiceGenerator');
                                window.dispatchEvent(event);
                              }, 500);
                            }}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            Invoice
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Performance */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Today's Progress</h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium text-green-600">
                {workOrders.filter(w => w.status === 'completed').length}/{workOrders.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${(workOrders.filter(w => w.status === 'completed').length / workOrders.length) * 100}%` 
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Revenue</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              ${workOrders.reduce((sum, w) => sum + w.total_amount, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total pending</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Efficiency</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">94%</p>
            <p className="text-sm text-gray-600">On-time completion</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedWorkOrder && (
        <WorkOrderDetail
          workOrderId={selectedWorkOrder}
          onClose={handleCloseWorkOrder}
          onUpdate={() => {
            refreshWorkOrders();
          }}
        />
      )}

      <CreateWorkOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          refreshWorkOrders();
        }}
      />
    </div>
  );
};

export default WorkOrdersManagement;
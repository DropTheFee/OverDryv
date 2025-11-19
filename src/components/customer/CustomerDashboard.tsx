import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Clock, CheckCircle, AlertCircle, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  mileage: number;
}

interface WorkOrder {
  id: string;
  work_order_number: string;
  vehicle_id: string;
  service_type: string;
  description: string;
  status: string;
  estimated_completion: string;
  total_amount: number;
  created_at: string;
  vehicles: Vehicle;
  technician?: {
    first_name: string;
    last_name: string;
  };
}

const CustomerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeOrders, setActiveOrders] = useState<WorkOrder[]>([]);
  const [recentOrders, setRecentOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, [profile]);

  const fetchCustomerData = async () => {
    if (!profile?.id) return;

    try {
      // Fetch vehicles
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('*')
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false });

      setVehicles(vehiclesData || []);

      // Fetch active work orders
      const { data: activeData } = await supabase
        .from('work_orders')
        .select(`
          *,
          vehicles (id, make, model, year, color, license_plate, mileage),
          technician:profiles!technician_id (first_name, last_name)
        `)
        .eq('customer_id', profile.id)
        .in('status', ['pending', 'in_progress', 'quality_check'])
        .order('created_at', { ascending: false });

      setActiveOrders(activeData || []);

      // Fetch recent completed orders
      const { data: recentData } = await supabase
        .from('work_orders')
        .select(`
          *,
          vehicles (id, make, model, year, color, license_plate, mileage)
        `)
        .eq('customer_id', profile.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5);

      setRecentOrders(recentData || []);

    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'in_progress': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'quality_check': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'in_progress': return Clock;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.first_name}!
        </h1>
        <p className="text-gray-600">Your personalized service dashboard - track, manage, and stay informed</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Car className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
              <p className="text-gray-600">Vehicles Registered</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
              <p className="text-gray-600">Active Services</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{recentOrders.length}</p>
              <p className="text-gray-600">Recent Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Services */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Current Services</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            <Link to="/check-in" className="text-white">Request Service</Link>
          </button>
        </div>
        
        {activeOrders.length > 0 ? (
          <div className="grid gap-6">
            {activeOrders.map(order => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Car className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {order.vehicles.year} {order.vehicles.make} {order.vehicles.model}
                        </h3>
                        <p className="text-gray-600">{order.service_type}</p>
                        <p className="text-sm text-gray-500">
                          Work Order: {order.work_order_number}
                        </p>
                        {order.technician && (
                          <p className="text-sm text-gray-500">
                            Technician: {order.technician.first_name} {order.technician.last_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status.replace('_', ' ').toUpperCase()}
                      </div>
                      {order.estimated_completion && (
                        <p className="text-sm text-gray-500 mt-2">
                          Est. completion: {new Date(order.estimated_completion).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm">{order.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Services</h3>
            <p className="text-gray-500 mb-4">You don't have any vehicles currently being serviced.</p>
            <Link 
              to="/check-in"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block"
            >
              Request Service
            </Link>
          </div>
        )}
      </div>

      {/* Recent Services */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Service History</h2>
        
        {recentOrders.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {recentOrders.map(order => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">{order.service_type}</h3>
                        <p className="text-gray-600">
                          {order.vehicles.year} {order.vehicles.make} {order.vehicles.model}
                        </p>
                        <p className="text-sm text-gray-500">
                          Completed: {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total_amount.toFixed(2)}</p>
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium mt-1">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent service history available</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 text-center">
          <Car className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Add Vehicle</h3>
          <p className="text-gray-600 text-sm mb-4">Register a new vehicle to your account</p>
          <Link 
            to="/check-in"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium inline-block"
          >
            Add Vehicle
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 text-center">
          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Schedule Service</h3>
          <p className="text-gray-600 text-sm mb-4">Book your next maintenance appointment</p>
          <Link 
            to="/check-in"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium inline-block"
          >
            Book Appointment
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 text-center">
          <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Emergency Service</h3>
          <p className="text-gray-600 text-sm mb-4">Need immediate assistance?</p>
          <a 
            href="tel:555-123-4567"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium inline-block"
          >
            Call (555) 123-4567
          </a>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
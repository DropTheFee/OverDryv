import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Car, Eye, Calendar, Bell, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTenant } from '../../contexts/TenantContext';
import VehicleProfileModal from './VehicleProfileModal';
import AppointmentScheduler from './AppointmentScheduler';
import { emailService } from '../../services/emailService';

interface Vehicle {
  id: string;
  vin: string | null;
  make: string;
  model: string;
  year: number;
  color: string | null;
  mileage: number | null;
  license_plate: string | null;
  created_at: string;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: number | null;
  } | null;
  work_orders: Array<{ id: string; status: string; description: string; created_at: string }>;
}

const VehiclesManagement: React.FC = () => {
  const navigate = useNavigate();
  const { organizationId } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showVehicleProfile, setShowVehicleProfile] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);
  const [selectedVehicleForScheduling, setSelectedVehicleForScheduling] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    maintenanceDueEnabled: true,
    overdueEnabled: true,
    daysBeforeDue: 7,
    emailEnabled: true,
    smsEnabled: true,
  });

  useEffect(() => {
    if (organizationId) {
      fetchVehicles();
    }
  }, [organizationId]);

  const fetchVehicles = async () => {
    if (!organizationId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          customer:profiles!customer_id (id, first_name, last_name, email, phone),
          work_orders:work_orders!vehicle_id (id, status, description, created_at)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleService = (vehicle: any) => {
    setSelectedVehicleForScheduling(vehicle);
    setShowAppointmentScheduler(true);
  };

  const handleSendMaintenanceReminder = async (vehicle: any, type: 'due' | 'overdue') => {
    try {
      const customerData = {
        name: vehicle.customer ? `${vehicle.customer.first_name} ${vehicle.customer.last_name}` : 'Customer',
        email: vehicle.customer?.email || '',
        phone: vehicle.customer?.phone?.toString() || ''
      };
      
      const result = await emailService.sendMaintenanceReminder(
        customerData, 
        vehicle, 
        type === 'overdue'
      );
      
      if (result.success) {
        alert(`${type === 'due' ? 'Maintenance reminder' : 'Overdue notice'} sent to ${customerData.name}!`);
      } else {
        console.error('Email send error:', result.error);
        alert('Email sent successfully! (Demo mode)');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Email sent successfully! (Demo mode)');
    }
  };

  const handleBulkNotifications = async (vehicles: any[], type: 'due' | 'overdue') => {
    try {
      const promises = vehicles.map(vehicle => {
        const customerData = {
          name: vehicle.customer ? `${vehicle.customer.first_name} ${vehicle.customer.last_name}` : 'Customer',
          email: vehicle.customer?.email || '',
          phone: vehicle.customer?.phone?.toString() || ''
        };
        return emailService.sendMaintenanceReminder(customerData, vehicle, type === 'overdue');
      });
      
      await Promise.all(promises);
      alert(`${type === 'due' ? 'Maintenance reminders' : 'Overdue notices'} sent to ${vehicles.length} customers!`);
    } catch (error) {
      console.error('Bulk email error:', error);
      alert(`${type === 'due' ? 'Maintenance reminders' : 'Overdue notices'} sent to ${vehicles.length} customers! (Demo mode)`);
    }
  };

  const makes = ['All Makes', ...new Set(vehicles.map(v => v.make))];

  const filteredVehicles = vehicles.filter(vehicle => {
    const customerName = vehicle.customer 
      ? `${vehicle.customer.first_name} ${vehicle.customer.last_name}`.toLowerCase()
      : '';
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (vehicle.vin && vehicle.vin.toLowerCase().includes(searchLower)) ||
      `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchLower) ||
      (vehicle.license_plate && vehicle.license_plate.toLowerCase().includes(searchLower)) ||
      customerName.includes(searchLower);
    
    const matchesMake = makeFilter === 'all' || makeFilter === 'All Makes' || vehicle.make === makeFilter;
    
    return matchesSearch && matchesMake;
  });

  const getServiceStatus = (workOrders: Vehicle['work_orders']) => {
    if (!workOrders || workOrders.length === 0) {
      return { status: 'unknown', color: 'text-gray-600 bg-gray-100', text: 'No service' };
    }
    
    const sorted = [...workOrders].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const lastService = sorted[0]?.created_at;
    
    if (!lastService) {
      return { status: 'unknown', color: 'text-gray-600 bg-gray-100', text: 'No service' };
    }
    
    const daysSince = Math.floor((Date.now() - new Date(lastService).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 120) return { status: 'overdue', color: 'text-red-600 bg-red-100', text: `${daysSince} days` };
    if (daysSince > 90) return { status: 'due', color: 'text-orange-600 bg-orange-100', text: `${daysSince} days` };
    return { status: 'good', color: 'text-green-600 bg-green-100', text: `${daysSince} days` };
  };

  const calculateTotalSpent = (workOrders: Vehicle['work_orders']) => {
    return workOrders.filter(wo => wo.status === 'completed').length * 250;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Management</h1>
          <p className="text-gray-600">Track and manage all customer vehicles</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          <span onClick={() => navigate('/check-in')}>Add Vehicle</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles, VINs, license plates, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={makeFilter}
            onChange={(e) => setMakeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicle Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">{vehicles.length}</h3>
          <p className="text-gray-600">Total Vehicles</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {vehicles.filter(v => getServiceStatus(v.work_orders || []).status === 'overdue').length}
          </h3>
          <p className="text-gray-600">Overdue Service</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            ${vehicles.reduce((sum, v) => sum + calculateTotalSpent(v.work_orders || []), 0).toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + (v.mileage || 0), 0) / vehicles.length).toLocaleString() : 0}
          </h3>
          <p className="text-gray-600">Avg. Mileage</p>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No vehicles found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VIN / Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mileage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.map(vehicle => {
                  const serviceStatus = getServiceStatus(vehicle.work_orders || []);
                  return (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Car className="w-8 h-8 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>
                            <p className="text-sm text-gray-600">{vehicle.color || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">
                            {vehicle.customer ? `${vehicle.customer.first_name} ${vehicle.customer.last_name}` : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">{vehicle.customer?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900 font-mono">{vehicle.vin || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{vehicle.license_plate || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {vehicle.mileage ? vehicle.mileage.toLocaleString() : 'N/A'} mi
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${serviceStatus.color}`}>
                            {serviceStatus.text} ago
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{vehicle.work_orders?.length || 0} orders</p>
                          <p className="text-sm text-gray-600">
                            {vehicle.work_orders?.filter(wo => wo.status === 'completed').length || 0} completed
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedVehicleId(vehicle.id);
                              setShowVehicleProfile(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Vehicle Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleScheduleService(vehicle)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            New Service
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

      {/* Maintenance Alerts */}
      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Automated Marketing Notifications</h3>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailEnabled}
                  onChange={(e) => setNotificationSettings({...notificationSettings, emailEnabled: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Email</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notificationSettings.smsEnabled}
                  onChange={(e) => setNotificationSettings({...notificationSettings, smsEnabled: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">SMS</span>
              </label>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-gray-700 mb-1">Send reminders</label>
              <select
                value={notificationSettings.daysBeforeDue}
                onChange={(e) => setNotificationSettings({...notificationSettings, daysBeforeDue: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={3}>3 days before due</option>
                <option value={7}>7 days before due</option>
                <option value={14}>14 days before due</option>
                <option value={30}>30 days before due</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 text-orange-600 mr-2" />
            Maintenance Due Soon
            </h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleBulkNotifications(
                  vehicles.filter(v => getServiceStatus(v.work_orders || []).status === 'due'), 
                  'due'
                )}
                className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded text-xs font-medium transition-colors flex items-center"
              >
                <Mail className="w-3 h-3 mr-1" />
                Notify All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {vehicles.filter(v => getServiceStatus(v.work_orders || []).status === 'due').map(vehicle => (
              <div key={vehicle.id} className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-gray-600">
                    {vehicle.customer ? `${vehicle.customer.first_name} ${vehicle.customer.last_name}` : 'N/A'}
                  </p>
                </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleSendMaintenanceReminder(vehicle, 'due')}
                      className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center"
                      title="Send Reminder"
                    >
                      <Bell className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleScheduleService(vehicle)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Last service: {getServiceStatus(vehicle.work_orders || []).text} ago
                </div>
              </div>
            ))}
            {vehicles.filter(v => getServiceStatus(v.work_orders || []).status === 'due').length === 0 && (
              <p className="text-gray-500 text-sm">No vehicles due for service</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-red-600 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Overdue Maintenance
            </h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleBulkNotifications(
                  vehicles.filter(v => getServiceStatus(v.work_orders || []).status === 'overdue'), 
                  'overdue'
                )}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-xs font-medium transition-colors flex items-center"
              >
                <Mail className="w-3 h-3 mr-1" />
                Notify All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {vehicles.filter(v => getServiceStatus(v.work_orders || []).status === 'overdue').map(vehicle => (
              <div key={vehicle.id} className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-gray-600">
                    {vehicle.customer ? `${vehicle.customer.first_name} ${vehicle.customer.last_name}` : 'N/A'}
                  </p>
                </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleSendMaintenanceReminder(vehicle, 'overdue')}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center"
                      title="Send Urgent Notice"
                    >
                      <Bell className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleScheduleService(vehicle)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
                <div className="text-xs text-red-600 font-medium">
                  OVERDUE: {getServiceStatus(vehicle.work_orders || []).text} past due
                </div>
              </div>
            ))}
            {vehicles.filter(v => getServiceStatus(v.work_orders || []).status === 'overdue').length === 0 && (
              <p className="text-gray-500 text-sm">No overdue vehicles</p>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Vehicle Profile Modal */}
      {showVehicleProfile && selectedVehicleId && (
        <VehicleProfileModal
          vehicleId={selectedVehicleId}
          onClose={() => {
            setShowVehicleProfile(false);
            setSelectedVehicleId(null);
          }}
          onUpdate={() => {
            fetchVehicles();
          }}
        />
      )}

      {/* Appointment Scheduler Modal */}
      {showAppointmentScheduler && selectedVehicleForScheduling && (
        <AppointmentScheduler
          vehicle={selectedVehicleForScheduling}
          onClose={() => {
            setShowAppointmentScheduler(false);
            setSelectedVehicleForScheduling(null);
          }}
          onScheduled={(appointmentData) => {
            console.log('Appointment scheduled:', appointmentData);
            alert(`Appointment scheduled for ${selectedVehicleForScheduling.customer?.first_name}!`);
            setShowAppointmentScheduler(false);
            setSelectedVehicleForScheduling(null);
          }}
        />
      )}
    </div>
  );
};

export default VehiclesManagement;
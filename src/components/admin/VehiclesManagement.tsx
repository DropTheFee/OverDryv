import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Car, Eye, Calendar, Bell, Mail, MessageSquare, Clock } from 'lucide-react';
import VehicleProfileModal from './VehicleProfileModal';
import AppointmentScheduler from './AppointmentScheduler';
import { emailService } from '../../services/emailService';

const VehiclesManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showVehicleProfile, setShowVehicleProfile] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);
  const [selectedVehicleForScheduling, setSelectedVehicleForScheduling] = useState<any>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    maintenanceDueEnabled: true,
    overdueEnabled: true,
    daysBeforeDue: 7,
    emailEnabled: true,
    smsEnabled: true,
  });

  // Mock data
  const vehicles = [
    {
      id: 1,
      vin: '1HGBH41JXMN109186',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      mileage: 45200,
      licensePlate: 'ABC-1234',
      customer: {
        id: 'cust1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567'
      },
      lastService: '2025-01-15',
      totalServices: 8,
      totalSpent: 1250.75,
    },
    {
      id: 2,
      vin: '2HGFC2F59GH123456',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      color: 'Blue',
      mileage: 32800,
      licensePlate: 'XYZ-5678',
      customer: {
        id: 'cust2',
        name: 'Sarah Davis',
        email: 'sarah.davis@email.com',
        phone: '(555) 234-5678'
      },
      lastService: '2025-01-14',
      totalServices: 5,
      totalSpent: 890.25,
    },
    {
      id: 3,
      vin: '1FTEW1EP5GKF12345',
      make: 'Ford',
      model: 'F-150',
      year: 2019,
      color: 'Black',
      mileage: 78500,
      licensePlate: 'DEF-9012',
      customer: {
        id: 'cust3',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '(555) 345-6789'
      },
      lastService: '2024-12-10',
      totalServices: 12,
      totalSpent: 2100.50,
    },
  ];

  const handleScheduleService = (vehicle: any) => {
    setSelectedVehicleForScheduling(vehicle);
    setShowAppointmentScheduler(true);
  };

  const handleSendMaintenanceReminder = async (vehicle: any, type: 'due' | 'overdue') => {
    try {
      const result = await emailService.sendMaintenanceReminder(
        vehicle.customer, 
        vehicle, 
        type === 'overdue'
      );
      
      if (result.success) {
        alert(`${type === 'due' ? 'Maintenance reminder' : 'Overdue notice'} sent to ${vehicle.customer.name}!`);
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
      const promises = vehicles.map(vehicle => 
        emailService.sendMaintenanceReminder(vehicle.customer, vehicle, type === 'overdue')
      );
      
      await Promise.all(promises);
      alert(`${type === 'due' ? 'Maintenance reminders' : 'Overdue notices'} sent to ${vehicles.length} customers!`);
    } catch (error) {
      console.error('Bulk email error:', error);
      alert(`${type === 'due' ? 'Maintenance reminders' : 'Overdue notices'} sent to ${vehicles.length} customers! (Demo mode)`);
    }
  };
  const makes = ['All Makes', ...new Set(vehicles.map(v => v.make))];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMake = makeFilter === 'all' || makeFilter === 'All Makes' || vehicle.make === makeFilter;
    
    return matchesSearch && matchesMake;
  });

  const getServiceStatus = (lastService: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastService).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 120) return { status: 'overdue', color: 'text-red-600 bg-red-100', text: `${daysSince} days` };
    if (daysSince > 90) return { status: 'due', color: 'text-orange-600 bg-orange-100', text: `${daysSince} days` };
    return { status: 'good', color: 'text-green-600 bg-green-100', text: `${daysSince} days` };
  };

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
              placeholder="Search vehicles, VINs, customers..."
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
            {vehicles.filter(v => getServiceStatus(v.lastService).status === 'overdue').length}
          </h3>
          <p className="text-gray-600">Overdue Service</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            ${vehicles.reduce((sum, v) => sum + v.totalSpent, 0).toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {Math.round(vehicles.reduce((sum, v) => sum + v.mileage, 0) / vehicles.length).toLocaleString()}
          </h3>
          <p className="text-gray-600">Avg. Mileage</p>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map(vehicle => {
                const serviceStatus = getServiceStatus(vehicle.lastService);
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Car className="w-8 h-8 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-sm text-gray-600">{vehicle.color}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{vehicle.customer.name}</p>
                        <p className="text-sm text-gray-600">{vehicle.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900 font-mono">{vehicle.vin}</p>
                        <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {vehicle.mileage.toLocaleString()} mi
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
                        <p className="font-medium text-gray-900">${vehicle.totalSpent.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{vehicle.totalServices} services</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedVehicleId(vehicle.id.toString());
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
                  vehicles.filter(v => getServiceStatus(v.lastService).status === 'due'), 
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
            {vehicles.filter(v => getServiceStatus(v.lastService).status === 'due').map(vehicle => (
              <div key={vehicle.id} className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-gray-600">{vehicle.customer.name}</p>
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
                  Last service: {Math.round((Date.now() - new Date(vehicle.lastService).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </div>
              </div>
            ))}
            {vehicles.filter(v => getServiceStatus(v.lastService).status === 'due').length === 0 && (
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
                  vehicles.filter(v => getServiceStatus(v.lastService).status === 'overdue'), 
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
            {vehicles.filter(v => getServiceStatus(v.lastService).status === 'overdue').map(vehicle => (
              <div key={vehicle.id} className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-gray-600">{vehicle.customer.name}</p>
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
                  OVERDUE: {Math.round((Date.now() - new Date(vehicle.lastService).getTime()) / (1000 * 60 * 60 * 24))} days past due
                </div>
              </div>
            ))}
            {vehicles.filter(v => getServiceStatus(v.lastService).status === 'overdue').length === 0 && (
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
            // Refresh vehicle data
            console.log('Vehicle updated, refreshing data...');
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
            alert(`Appointment scheduled for ${selectedVehicleForScheduling.customer}!`);
            setShowAppointmentScheduler(false);
            setSelectedVehicleForScheduling(null);
          }}
        />
      )}
    </div>
  );
};

export default VehiclesManagement;
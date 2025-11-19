import React, { useState, useEffect } from 'react';
import { 
  X, 
  Car, 
  Edit, 
  Save, 
  Calendar, 
  Wrench, 
  DollarSign,
  Clock,
  FileText,
  Phone,
  Mail,
  User
} from 'lucide-react';
import AppointmentScheduler from './AppointmentScheduler';
import CreateWorkOrderModal from './CreateWorkOrderModal';

interface VehicleProfileModalProps {
  vehicleId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  licensePlate: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  serviceHistory: ServiceRecord[];
  totalSpent: number;
  totalServices: number;
  lastService: string;
  nextDueDate: string;
  notes: string;
}

interface ServiceRecord {
  id: string;
  date: string;
  service: string;
  mileage: number;
  amount: number;
  technician: string;
  status: string;
}

const VehicleProfileModal: React.FC<VehicleProfileModalProps> = ({ 
  vehicleId, 
  onClose, 
  onUpdate 
}) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);
  const [showCreateWorkOrder, setShowCreateWorkOrder] = useState(false);

  useEffect(() => {
    fetchVehicleProfile();
  }, [vehicleId]);

  const fetchVehicleProfile = async () => {
    // Mock data - in production, fetch from API
    const mockVehicle: Vehicle = {
      id: vehicleId,
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
      totalSpent: 1250.75,
      totalServices: 8,
      lastService: '2025-01-15',
      nextDueDate: '2025-04-15',
      notes: 'Customer prefers synthetic oil. Usually drives highway miles.',
      serviceHistory: [
        {
          id: '1',
          date: '2025-01-15',
          service: 'Oil Change & Inspection',
          mileage: 45200,
          amount: 75.99,
          technician: 'Mike Johnson',
          status: 'completed'
        },
        {
          id: '2',
          date: '2024-10-12',
          service: 'Brake Pad Replacement',
          mileage: 42800,
          amount: 285.50,
          technician: 'Sarah Davis',
          status: 'completed'
        },
        {
          id: '3',
          date: '2024-07-08',
          service: 'Tire Rotation',
          mileage: 40100,
          amount: 45.00,
          technician: 'Tom Wilson',
          status: 'completed'
        }
      ]
    };

    setTimeout(() => {
      setVehicle(mockVehicle);
      setLoading(false);
    }, 500);
  };

  const handleSave = () => {
    // In production, save to API
    console.log('Saving vehicle profile:', vehicle);
    setEditing(false);
    onUpdate?.();
    alert('Vehicle profile updated successfully!');
  };

  const handleScheduleService = () => {
    setShowAppointmentScheduler(true);
  };

  const handleCreateWorkOrder = () => {
    setShowCreateWorkOrder(true);
  };

  const refreshAfterWorkOrderCreation = () => {
    // Refresh the parent component if needed
    onUpdate?.();
  };
  const handleSendReminder = async () => {
    if (!vehicle) return;
    
    const serviceStatus = getServiceStatus(vehicle.lastService);
    const message = serviceStatus.status === 'overdue' 
      ? `URGENT: Your ${vehicle.year} ${vehicle.make} ${vehicle.model} is overdue for maintenance. Please schedule immediately.`
      : `Hi ${vehicle.customer.name}, your ${vehicle.year} ${vehicle.make} ${vehicle.model} is due for maintenance. Schedule today!`;
    
    // In production, this would send actual email/SMS
    console.log('Sending maintenance reminder:', { vehicle, message });
    alert(`Maintenance reminder sent to ${vehicle.customer.name}!`);
  };
  const getServiceStatus = (lastService: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastService).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 120) return { status: 'overdue', color: 'text-red-600', text: 'Overdue' };
    if (daysSince > 90) return { status: 'due', color: 'text-orange-600', text: 'Due Soon' };
    return { status: 'good', color: 'text-green-600', text: 'Up to Date' };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  const serviceStatus = getServiceStatus(vehicle.lastService);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Car className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-gray-600">Vehicle Profile & Service History</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {editing ? (
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Vehicle
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Vehicle Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{vehicle.totalServices}</div>
              <div className="text-gray-600 text-sm">Total Services</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">${vehicle.totalSpent.toLocaleString()}</div>
              <div className="text-gray-600 text-sm">Total Spent</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${vehicle.totalServices > 0 ? (vehicle.totalSpent / vehicle.totalServices).toFixed(0) : '0'}
              </div>
              <div className="text-gray-600 text-sm">Avg per Service</div>
            </div>
            <div className={`border rounded-lg p-4 text-center ${
              serviceStatus.status === 'overdue' ? 'bg-red-50 border-red-200' :
              serviceStatus.status === 'due' ? 'bg-orange-50 border-orange-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className={`text-2xl font-bold ${serviceStatus.color}`}>
                {Math.round((Date.now() - new Date(vehicle.lastService).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-gray-600 text-sm">Days Since Service</div>
              <div className={`text-xs font-medium ${serviceStatus.color}`}>{serviceStatus.text}</div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Car className="w-5 h-5 mr-2" />
                Vehicle Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                    {editing ? (
                      <input
                        type="text"
                        value={vehicle.make}
                        onChange={(e) => setVehicle({...vehicle, make: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.make}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    {editing ? (
                      <input
                        type="text"
                        value={vehicle.model}
                        onChange={(e) => setVehicle({...vehicle, model: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.model}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    {editing ? (
                      <input
                        type="number"
                        value={vehicle.year}
                        onChange={(e) => setVehicle({...vehicle, year: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.year}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    {editing ? (
                      <input
                        type="text"
                        value={vehicle.color}
                        onChange={(e) => setVehicle({...vehicle, color: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.color}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    {editing ? (
                      <input
                        type="text"
                        value={vehicle.licensePlate}
                        onChange={(e) => setVehicle({...vehicle, licensePlate: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.licensePlate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Mileage</label>
                    {editing ? (
                      <input
                        type="number"
                        value={vehicle.mileage}
                        onChange={(e) => setVehicle({...vehicle, mileage: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.mileage.toLocaleString()} mi</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                  {editing ? (
                    <input
                      type="text"
                      value={vehicle.vin}
                      onChange={(e) => setVehicle({...vehicle, vin: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  ) : (
                    <p className="text-gray-900 font-mono">{vehicle.vin}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Owner Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <p className="text-gray-900 font-medium">{vehicle.customer.name}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${vehicle.customer.email}`} className="hover:text-blue-600">
                    {vehicle.customer.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${vehicle.customer.phone}`} className="hover:text-blue-600">
                    {vehicle.customer.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Service Schedule */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Maintenance Schedule
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Service</label>
                <p className="text-gray-900">{new Date(vehicle.lastService).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">
                  {Math.round((Date.now() - new Date(vehicle.lastService).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                <p className={`font-medium ${serviceStatus.color}`}>
                  {new Date(vehicle.nextDueDate).toLocaleDateString()}
                </p>
                <p className={`text-sm ${serviceStatus.color}`}>{serviceStatus.text}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Notes</label>
            {editing ? (
              <textarea
                rows={3}
                value={vehicle.notes}
                onChange={(e) => setVehicle({...vehicle, notes: e.target.value})}
                placeholder="Add notes about vehicle preferences, special instructions, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                {vehicle.notes ? (
                  <p className="text-gray-700">{vehicle.notes}</p>
                ) : (
                  <p className="text-gray-500 italic">No notes on file</p>
                )}
              </div>
            )}
          </div>

          {/* Recent Service History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Recent Service History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mileage</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Technician</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehicle.serviceHistory.slice(0, 5).map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-900">{record.service}</td>
                      <td className="px-4 py-3 text-gray-900">{record.mileage.toLocaleString()} mi</td>
                      <td className="px-4 py-3 text-gray-900">{record.technician}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ${record.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {vehicle.serviceHistory.length > 5 && (
              <div className="text-center mt-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Complete History ({vehicle.serviceHistory.length} total)
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <button 
              onClick={handleScheduleService}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
            >
              <Wrench className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Schedule Service</div>
              <div className="text-sm opacity-90">Book next appointment</div>
            </button>
            <button 
              onClick={handleCreateWorkOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Create Work Order</div>
              <div className="text-sm opacity-90">Start new service</div>
            </button>
            <button 
              onClick={handleSendReminder}
              className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors"
            >
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Send Reminder</div>
              <div className="text-sm opacity-90">Maintenance notification</div>
            </button>
          </div>
        </div>

        {/* Modals */}
        {showAppointmentScheduler && vehicle && (
          <AppointmentScheduler
            vehicle={vehicle}
            onClose={() => setShowAppointmentScheduler(false)}
            onScheduled={(appointmentData) => {
              console.log('Appointment scheduled:', appointmentData);
              alert(`Appointment scheduled for ${vehicle.customer.name}!`);
              setShowAppointmentScheduler(false);
            }}
          />
        )}

        {showCreateWorkOrder && vehicle && (
          <CreateWorkOrderModal
            isOpen={showCreateWorkOrder}
            onClose={() => setShowCreateWorkOrder(false)}
            onSuccess={() => {
              alert(`Work order created for ${vehicle.customer.name}! Check the Work Orders page to view it.`);
              setShowCreateWorkOrder(false);
              refreshAfterWorkOrderCreation();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VehicleProfileModal;
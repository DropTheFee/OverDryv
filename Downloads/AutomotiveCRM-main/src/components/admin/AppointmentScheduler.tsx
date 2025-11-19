import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Car, 
  Wrench, 
  Mail, 
  MessageSquare,
  Phone,
  CheckCircle
} from 'lucide-react';

interface AppointmentSchedulerProps {
  vehicle: any;
  onClose: () => void;
  onScheduled: (appointmentData: any) => void;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ 
  vehicle, 
  onClose, 
  onScheduled 
}) => {
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    serviceType: '',
    estimatedDuration: '2',
    technician: '',
    priority: 'normal',
    notes: '',
    sendConfirmation: true,
    sendReminder: true,
    reminderDays: 1,
  });

  const serviceTypes = [
    'Oil Change',
    'Brake Service', 
    'Engine Diagnostics',
    'Tire Service',
    'Transmission Service',
    'Air Conditioning',
    'Battery & Electrical',
    'General Inspection',
    'Scheduled Maintenance',
    'Custom Service',
  ];

  const technicians = [
    { id: 'tech1', name: 'Mike Johnson' },
    { id: 'tech2', name: 'Sarah Davis' },
    { id: 'tech3', name: 'Tom Wilson' },
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointment = {
      ...appointmentData,
      vehicleId: vehicle.id,
      customerId: vehicle.customer.id,
      customerName: vehicle.customer.name,
      vehicleInfo: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      scheduledAt: new Date().toISOString(),
    };

    // In production, this would save to database and send notifications
    console.log('Scheduling appointment:', appointment);
    
    onScheduled(appointment);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Schedule Appointment</h2>
              <p className="text-gray-600">Book service for {vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer & Vehicle Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <p className="font-medium text-gray-900">{vehicle.customer.name}</p>
                  <p className="text-sm text-gray-600">{vehicle.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Car className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <p className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-gray-600">{vehicle.licensePlate} • {vehicle.mileage?.toLocaleString()} mi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
              <input
                type="date"
                required
                value={appointmentData.date}
                onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                min={getMinDate()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
              <select
                required
                value={appointmentData.time}
                onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {new Date(`2000-01-01T${time}`).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                required
                value={appointmentData.serviceType}
                onChange={(e) => setAppointmentData({...appointmentData, serviceType: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select service</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
              <select
                value={appointmentData.estimatedDuration}
                onChange={(e) => setAppointmentData({...appointmentData, estimatedDuration: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">Half day (4 hours)</option>
                <option value="8">Full day</option>
              </select>
            </div>
          </div>

          {/* Technician & Priority */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign Technician</label>
              <select
                value={appointmentData.technician}
                onChange={(e) => setAppointmentData({...appointmentData, technician: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Auto-assign</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={appointmentData.priority}
                onChange={(e) => setAppointmentData({...appointmentData, priority: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Notes</label>
            <textarea
              rows={3}
              value={appointmentData.notes}
              onChange={(e) => setAppointmentData({...appointmentData, notes: e.target.value})}
              placeholder="Any special instructions or customer requests..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notification Settings */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Customer Notifications
            </h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={appointmentData.sendConfirmation}
                  onChange={(e) => setAppointmentData({...appointmentData, sendConfirmation: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Send appointment confirmation (Email & SMS)</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={appointmentData.sendReminder}
                  onChange={(e) => setAppointmentData({...appointmentData, sendReminder: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Send appointment reminder</span>
              </label>
              {appointmentData.sendReminder && (
                <div className="ml-6">
                  <select
                    value={appointmentData.reminderDays}
                    onChange={(e) => setAppointmentData({...appointmentData, reminderDays: parseInt(e.target.value)})}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={1}>1 day before</option>
                    <option value={2}>2 days before</option>
                    <option value={3}>3 days before</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Schedule Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
import React, { useState, useEffect } from 'react';
import { X, User, Car, Phone, Mail, MapPin, Calendar, Edit, Save } from 'lucide-react';

interface CustomerProfileModalProps {
  customerId: string;
  onClose: () => void;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  joinDate: string;
  totalSpent: number;
  totalServices: number;
  vehicles: Vehicle[];
  notes?: string;
}

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  mileage: number;
  vin: string;
  lastService?: string;
}

const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ customerId, onClose }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchCustomerProfile();
  }, [customerId]);

  const fetchCustomerProfile = async () => {
    // Mock data - in production, fetch from API
    const mockCustomer: Customer = {
      id: customerId,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      address: '123 Oak Street',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      joinDate: '2024-03-15',
      totalSpent: 1250.75,
      totalServices: 8,
      notes: 'Prefers early morning appointments. Drives frequently for work.',
      vehicles: [
        {
          id: '1',
          year: 2022,
          make: 'Toyota',
          model: 'Camry',
          color: 'Silver',
          licensePlate: 'ABC-1234',
          mileage: 45200,
          vin: '1HGBH41JXMN109186',
          lastService: '2025-01-15'
        },
        {
          id: '2',
          year: 2019,
          make: 'Honda',
          model: 'CR-V',
          color: 'White',
          licensePlate: 'XYZ-5678',
          mileage: 62800,
          vin: '2HGFC2F59GH123456',
          lastService: '2024-12-10'
        }
      ]
    };

    setTimeout(() => {
      setCustomer(mockCustomer);
      setLoading(false);
    }, 500);
  };

  const handleSave = () => {
    // In production, save to API
    console.log('Saving customer profile:', customer);
    setEditing(false);
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

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customer.firstName} {customer.lastName}
              </h2>
              <p className="text-gray-600">Customer Profile</p>
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
                Edit Profile
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{customer.totalServices}</div>
              <div className="text-gray-600">Total Services</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">${customer.totalSpent.toLocaleString()}</div>
              <div className="text-gray-600">Total Spent</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{customer.vehicles.length}</div>
              <div className="text-gray-600">Vehicles</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <a href={`mailto:${customer.email}`} className="text-blue-600 hover:text-blue-800">
                      {customer.email}
                    </a>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <a href={`tel:${customer.phone}`} className="text-blue-600 hover:text-blue-800">
                      {customer.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              {editing ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={customer.address || ''}
                    onChange={(e) => setCustomer({...customer, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={customer.city || ''}
                    onChange={(e) => setCustomer({...customer, city: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={customer.state || ''}
                    onChange={(e) => setCustomer({...customer, state: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={customer.zipCode || ''}
                    onChange={(e) => setCustomer({...customer, zipCode: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                  <div>
                    {customer.address && (
                      <div>
                        <div>{customer.address}</div>
                        <div>{customer.city}, {customer.state} {customer.zipCode}</div>
                      </div>
                    )}
                    {!customer.address && (
                      <span className="text-gray-500 italic">No address on file</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Since */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Since</label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{new Date(customer.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Vehicles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Registered Vehicles
            </h3>
            <div className="grid gap-4">
              {customer.vehicles.map(vehicle => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Car className="w-8 h-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Color: {vehicle.color} • License: {vehicle.licensePlate}</div>
                          <div>Mileage: {vehicle.mileage.toLocaleString()} mi</div>
                          <div className="font-mono text-xs">VIN: {vehicle.vin}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {vehicle.lastService && (
                        <div className="text-sm text-gray-600">
                          Last Service: {new Date(vehicle.lastService).toLocaleDateString()}
                        </div>
                      )}
                      <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View History
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Notes</label>
            {editing ? (
              <textarea
                rows={3}
                value={customer.notes || ''}
                onChange={(e) => setCustomer({...customer, notes: e.target.value})}
                placeholder="Add notes about customer preferences, special instructions, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                {customer.notes ? (
                  <p className="text-gray-700">{customer.notes}</p>
                ) : (
                  <p className="text-gray-500 italic">No notes on file</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileModal;
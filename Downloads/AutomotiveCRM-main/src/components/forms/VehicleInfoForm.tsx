import React, { useState } from 'react';
import { Car, User, Search, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface VehicleInfoFormProps {
  onComplete: (data: any) => void;
}

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  mileage: number;
  vin: string;
}

const VehicleInfoForm: React.FC<VehicleInfoFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'lookup' | 'customer' | 'vehicle'>('lookup');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerVehicles, setCustomerVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Vehicle Info
    vin: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    mileage: '',
    licensePlate: '',
  });

  const searchCustomers = async () => {
    if (!searchTerm.trim()) return;
    
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone')
        .or(`email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .eq('role', 'customer')
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching customers:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      ...formData,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      phone: customer.phone,
    });

    // Fetch customer's vehicles
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('customer_id', customer.id);

      if (error) throw error;
      setCustomerVehicles(data || []);
      setStep('vehicle');
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setCustomerVehicles([]);
      setStep('vehicle');
    }
  };

  const selectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      ...formData,
      vin: vehicle.vin || '',
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || '',
      mileage: vehicle.mileage?.toString() || '',
      licensePlate: vehicle.license_plate || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...formData,
      customerId: selectedCustomer?.id,
      vehicleId: selectedVehicle?.id,
      isExistingCustomer: !!selectedCustomer,
      isExistingVehicle: !!selectedVehicle,
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // Customer Lookup Step
  if (step === 'lookup') {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-4">
            <Search className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Find Your Account</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Search for your existing account using your email, phone number, or name.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter email, phone, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchCustomers()}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={searchCustomers}
                disabled={!searchTerm.trim() || searching}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-2 bg-gray-50 font-medium text-gray-700">
                  Found {searchResults.length} customer{searchResults.length !== 1 ? 's' : ''}
                </div>
                {searchResults.map(customer => (
                  <button
                    key={customer.id}
                    onClick={() => selectCustomer(customer)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">
                      {customer.first_name} {customer.last_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {customer.email} • {customer.phone}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchTerm && searchResults.length === 0 && !searching && (
              <div className="text-center py-4 text-gray-500">
                No customers found. You can create a new account below.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={() => setStep('customer')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            I'm a New Customer
          </button>
        </div>
      </div>
    );
  }

  // Vehicle Selection Step (for existing customers)
  if (step === 'vehicle' && selectedCustomer) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-4">
            <Car className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Select Your Vehicle</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Welcome back, {selectedCustomer.first_name}! Please select the vehicle you'd like to service.
          </p>

          {customerVehicles.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                {customerVehicles.map(vehicle => (
                  <button
                    key={vehicle.id}
                    onClick={() => selectVehicle(vehicle)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedVehicle?.id === vehicle.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {vehicle.color && `${vehicle.color} • `}
                      {vehicle.license_plate && `License: ${vehicle.license_plate} • `}
                      {vehicle.mileage && `${vehicle.mileage.toLocaleString()} miles`}
                    </div>
                  </button>
                ))}
              </div>

              {selectedVehicle && (
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  Continue with {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No vehicles found for your account.
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setIsNewVehicle(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add a Different Vehicle
            </button>
          </div>

          {isNewVehicle && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900">Add New Vehicle</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="VIN (Optional)"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  required
                  placeholder="License Plate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  placeholder="Make (e.g., Toyota)"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  required
                  placeholder="Model (e.g., Camry)"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  required
                  placeholder="Current Mileage"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={!formData.make || !formData.model || !formData.year || !formData.mileage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue with New Vehicle
              </button>
            </form>
          )}
        </div>

        <button
          type="button"
          onClick={() => setStep('lookup')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Search
        </button>
      </div>
    );
  }

  // New Customer Form (original form)
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Information */}
      <div>
        <div className="flex items-center mb-4">
          <User className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Customer Information</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            required
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="email"
            required
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="tel"
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Vehicle Information */}
      <div>
        <div className="flex items-center mb-4">
          <Car className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Vehicle Information</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="VIN (Optional)"
            value={formData.vin}
            onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            required
            placeholder="License Plate"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <input
            type="text"
            required
            placeholder="Make (e.g., Toyota)"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            required
            placeholder="Model (e.g., Camry)"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            required
            placeholder="Current Mileage"
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep('lookup')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Search
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors transform hover:scale-[1.02] shadow-lg"
        >
          Continue to Service Request
        </button>
      </div>
    </form>
  );
};

export default VehicleInfoForm;
import React, { useState } from 'react';
import { X, Search, Car, User, Eye, Plus, Calendar } from 'lucide-react';

interface VehicleLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleSelected?: (vehicle: any) => void;
}

const VehicleLookupModal: React.FC<VehicleLookupModalProps> = ({
  isOpen,
  onClose,
  onVehicleSelected,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Mock vehicle database for demonstration
  const vehicleDatabase = [
    {
      id: '1',
      vin: '1HGBH41JXMN109186',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      license_plate: 'ABC-1234',
      mileage: 45200,
      customer: {
        id: 'cust1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567'
      },
      lastService: '2025-01-15',
      totalServices: 8,
      totalSpent: 1250.75,
      serviceHistory: [
        { date: '2025-01-15', service: 'Oil Change & Inspection', amount: 75.99 },
        { date: '2024-10-12', service: 'Brake Pad Replacement', amount: 285.50 },
        { date: '2024-07-08', service: 'Tire Rotation', amount: 45.00 },
      ]
    },
    {
      id: '2',
      vin: '2HGFC2F59GH123456',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      color: 'Blue',
      license_plate: 'XYZ-5678',
      mileage: 32800,
      customer: {
        id: 'cust2',
        name: 'Sarah Davis',
        email: 'sarah.davis@email.com',
        phone: '(555) 234-5678'
      },
      lastService: '2025-01-14',
      totalServices: 5,
      totalSpent: 890.25,
      serviceHistory: [
        { date: '2025-01-14', service: 'Brake Inspection', amount: 89.99 },
        { date: '2024-09-20', service: 'Oil Change', amount: 45.99 },
      ]
    },
    {
      id: '3',
      vin: '1FTEW1EP5GKF12345',
      make: 'Ford',
      model: 'F-150',
      year: 2019,
      color: 'Black',
      license_plate: 'DEF-9012',
      mileage: 78500,
      customer: {
        id: 'cust3',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '(555) 345-6789'
      },
      lastService: '2024-12-10',
      totalServices: 12,
      totalSpent: 2100.50,
      serviceHistory: [
        { date: '2024-12-10', service: 'Engine Diagnostics', amount: 150.00 },
        { date: '2024-08-15', service: 'Transmission Service', amount: 450.00 },
      ]
    },
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    
    // Simulate API search delay
    setTimeout(() => {
      const results = vehicleDatabase.filter(vehicle =>
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer.phone.includes(searchTerm)
      );
      
      setSearchResults(results);
      setSearching(false);
    }, 500);
  };

  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    onVehicleSelected?.(vehicle);
  };

  const getServiceStatus = (lastService: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastService).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 120) return { status: 'overdue', color: 'text-red-600', text: 'Overdue' };
    if (daysSince > 90) return { status: 'due', color: 'text-orange-600', text: 'Due Soon' };
    return { status: 'good', color: 'text-green-600', text: 'Up to Date' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Search className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Vehicle Lookup</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by VIN, License Plate, Vehicle, or Customer
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter VIN, license plate, vehicle info, or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={!searchTerm.trim() || searching}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                {searching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Found {searchResults.length} vehicle{searchResults.length !== 1 ? 's' : ''}
              </h3>
              <div className="space-y-4">
                {searchResults.map(vehicle => {
                  const serviceStatus = getServiceStatus(vehicle.lastService);
                  
                  return (
                    <div 
                      key={vehicle.id} 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedVehicle?.id === vehicle.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleVehicleSelect(vehicle)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Car className="w-8 h-8 text-blue-600 mt-1" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Color: {vehicle.color} • License: {vehicle.license_plate}</div>
                              <div>Mileage: {vehicle.mileage.toLocaleString()} mi</div>
                              <div className="font-mono text-xs">VIN: {vehicle.vin}</div>
                            </div>
                            
                            {/* Customer Info */}
                            <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                              <div className="flex items-center mb-2">
                                <User className="w-4 h-4 text-gray-600 mr-2" />
                                <span className="font-medium text-gray-900">{vehicle.customer.name}</span>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <span className="w-12">Email:</span>
                                  <a href={`mailto:${vehicle.customer.email}`} className="text-blue-600 hover:text-blue-800">
                                    {vehicle.customer.email}
                                  </a>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-12">Phone:</span>
                                  <a href={`tel:${vehicle.customer.phone}`} className="text-blue-600 hover:text-blue-800">
                                    {vehicle.customer.phone}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            serviceStatus.status === 'overdue' ? 'bg-red-100 text-red-600' :
                            serviceStatus.status === 'due' ? 'bg-orange-100 text-orange-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {serviceStatus.text}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            Last Service: {new Date(vehicle.lastService).toLocaleDateString()}
                          </div>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            ${vehicle.totalSpent.toLocaleString()} total
                          </div>
                        </div>
                      </div>

                      {/* Service History Preview */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">Recent Services</h5>
                        <div className="space-y-1">
                          {vehicle.serviceHistory.slice(0, 2).map((service: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{service.service}</span>
                              <div className="text-right">
                                <span className="text-gray-900 font-medium">${service.amount}</span>
                                <span className="text-gray-500 ml-2">{new Date(service.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {searchTerm && searchResults.length === 0 && !searching && (
            <div className="text-center py-8 text-gray-500">
              <Car className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Found</h3>
              <p>No vehicles match your search criteria.</p>
              <button 
                onClick={() => alert('Add Vehicle functionality - would open vehicle registration form')}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Vehicle
              </button>
            </div>
          )}

          {/* Selected Vehicle Actions */}
          {selectedVehicle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button 
                  onClick={() => alert(`Opening full profile for ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <Eye className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">View Full Profile</div>
                  <div className="text-sm opacity-90">Complete vehicle details</div>
                </button>
                <button 
                  onClick={() => alert(`Creating work order for ${selectedVehicle.customer.name}'s ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`)}
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <Plus className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Create Work Order</div>
                  <div className="text-sm opacity-90">Start new service</div>
                </button>
                <button 
                  onClick={() => alert(`Scheduling appointment for ${selectedVehicle.customer.name}`)}
                  className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <Calendar className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Schedule Service</div>
                  <div className="text-sm opacity-90">Book appointment</div>
                </button>
              </div>
            </div>
          )}

          {!searchTerm && (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Vehicle Database Search</h3>
              <p>Search for any vehicle in your database using VIN, license plate, vehicle details, or customer information.</p>
              <div className="mt-6 grid md:grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <strong>Search Examples:</strong>
                  <ul className="mt-2 space-y-1 text-left">
                    <li>• VIN: 1HGBH41JXMN109186</li>
                    <li>• License: ABC-1234</li>
                    <li>• Vehicle: 2022 Toyota Camry</li>
                    <li>• Customer: John Smith</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <strong>Quick Access:</strong>
                  <ul className="mt-2 space-y-1 text-left">
                    <li>• View service history</li>
                    <li>• Create work orders</li>
                    <li>• Schedule appointments</li>
                    <li>• Update vehicle info</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleLookupModal;
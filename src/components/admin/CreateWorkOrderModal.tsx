import React, { useState, useEffect } from 'react';
import { X, Car, User, Wrench, Plus } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import { workOrderService } from '../../services/workOrderService';
import AddCustomerModal from './AddCustomerModal';
import VehicleLookupModal from './VehicleLookupModal';

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_id: '',
    service_type: '',
    description: '',
    priority: 'normal' as const,
    estimated_completion: '',
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
    'Custom Service',
  ];

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.customer_id) {
      fetchCustomerVehicles(formData.customer_id);
    }
  }, [formData.customer_id]);

  const fetchCustomers = async () => {
    // Mock data for demonstration
    const mockCustomers = [
      { id: 'cust1', first_name: 'John', last_name: 'Smith', email: 'john.smith@email.com' },
      { id: 'cust2', first_name: 'Sarah', last_name: 'Davis', email: 'sarah.davis@email.com' },
      { id: 'cust3', first_name: 'Mike', last_name: 'Chen', email: 'mike.chen@email.com' },
    ];
    setCustomers(mockCustomers);
  };

  const fetchCustomerVehicles = async (customerId: string) => {
    // Mock data for demonstration
    const mockVehicles = [
      { id: 'veh1', make: 'Toyota', model: 'Camry', year: 2022, license_plate: 'ABC-1234' },
      { id: 'veh2', make: 'Honda', model: 'Civic', year: 2020, license_plate: 'XYZ-5678' },
    ];
    setVehicles(mockVehicles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create new work order with proper data structure
      const selectedCustomer = customers.find(c => c.id === formData.customer_id);
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);
      
      const newWorkOrder = {
        id: `wo${Date.now()}`,
        work_order_number: `WO-${String(Date.now()).slice(-3).padStart(3, '0')}`,
        customer: {
          first_name: selectedCustomer?.first_name || 'Unknown',
          last_name: selectedCustomer?.last_name || 'Customer',
        },
        vehicle: {
          year: selectedVehicle?.year || 2020,
          make: selectedVehicle?.make || 'Unknown',
          model: selectedVehicle?.model || 'Vehicle',
        },
        service_type: formData.service_type,
        description: formData.description,
        status: 'pending',
        priority: formData.priority,
        technician: null,
        created_at: new Date().toISOString(),
        estimated_completion: formData.estimated_completion || new Date(Date.now() + 24*60*60*1000).toISOString(),
        total_amount: 0,
      };
      
      // Get existing work orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
      
      // Add new work order
      const updatedOrders = [newWorkOrder, ...existingOrders];
      
      // Save back to localStorage
      localStorage.setItem('workOrders', JSON.stringify(updatedOrders));
      
      console.log('Work order created:', newWorkOrder);
      
      onSuccess?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating work order:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      customer_id: '',
      vehicle_id: '',
      service_type: '',
      description: '',
      priority: 'normal',
      estimated_completion: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Work Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Customer</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomer(true)}
                className="flex items-center gap-2 px-4 py-2 text-base text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Customer
              </button>
            </div>
            <select
              required
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value, vehicle_id: '' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name} - {customer.email}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selection */}
          {formData.customer_id && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Vehicle</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(true)}
                  className="flex items-center gap-2 px-4 py-2 text-base text-white bg-green-600 hover:bg-green-700 font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Vehicle
                </button>
              </div>
              <select
                required
                value={formData.vehicle_id}
                onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.license_plate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Service Information */}
          <div>
            <div className="flex items-center mb-3">
              <Wrench className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Service Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select
                  required
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the service needed or issue reported..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Completion</label>
                  <input
                    type="datetime-local"
                    value={formData.estimated_completion}
                    onChange={(e) => setFormData({ ...formData, estimated_completion: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
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
              disabled={loading || !formData.customer_id || !formData.vehicle_id}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Work Order'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onSuccess={(newCustomer) => {
          setShowAddCustomer(false);
          fetchCustomers(); // Refresh customer list
          setFormData({ ...formData, customer_id: newCustomer.id }); // Auto-select new customer
        }}
      />

      {/* Add Vehicle Modal */}
      <VehicleLookupModal
        isOpen={showAddVehicle}
        onClose={() => setShowAddVehicle(false)}
        customerId={formData.customer_id}
        onVehicleSelect={(vehicle) => {
          setShowAddVehicle(false);
          fetchCustomerVehicles(formData.customer_id); // Refresh vehicle list
          setFormData({ ...formData, vehicle_id: vehicle.id }); // Auto-select new vehicle
        }}
      />
    </div>
  );
};

export default CreateWorkOrderModal;
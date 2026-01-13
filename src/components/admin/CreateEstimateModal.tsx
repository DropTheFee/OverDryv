import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddCustomerModal from './AddCustomerModal';
import VehicleLookupModal from './VehicleLookupModal';

interface CreateEstimateModalProps {
  onClose: () => void;
  onSuccess: () => void;
  estimateToEdit?: any;
}

interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  item_type: 'labor' | 'part' | 'fee';
}

const CreateEstimateModal: React.FC<CreateEstimateModalProps> = ({
  onClose,
  onSuccess,
  estimateToEdit,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([{
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unit_price: 0,
    item_type: 'labor',
  }]);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_id: '',
    service_type: '',
    description: '',
    priority: 'normal' as const,
    notes: '',
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  });

  const serviceTypes = [
    'Oil Change',
    'Brake Service',
    'Engine Diagnostics',
    'Tire Service',
    'Transmission Service',
    'Air Conditioning',
    'Battery & Electrical',
    'Suspension & Steering',
    'Exhaust System',
    'Cooling System',
    'Timing Belt Service',
    'General Inspection',
    'Custom Service',
  ];

  useEffect(() => {
    fetchCustomers();
    if (estimateToEdit) {
      loadEstimateData();
    }
  }, []);

  useEffect(() => {
    if (formData.customer_id) {
      fetchCustomerVehicles(formData.customer_id);
    }
  }, [formData.customer_id]);

  const loadEstimateData = async () => {
    if (!estimateToEdit) return;
    
    setFormData({
      customer_id: estimateToEdit.customer_id,
      vehicle_id: estimateToEdit.vehicle_id,
      service_type: estimateToEdit.service_type,
      description: estimateToEdit.description,
      priority: estimateToEdit.priority,
      notes: estimateToEdit.notes || '',
      valid_until: estimateToEdit.valid_until?.split('T')[0] || '',
    });

    // Fetch service items
    const { data: items } = await supabase
      .from('service_items')
      .select('*')
      .eq('estimate_id', estimateToEdit.id);
    
    if (items && items.length > 0) {
      setServiceItems(items.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        item_type: item.item_type || 'labor',
      })) as ServiceItem[]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };

  const fetchCustomerVehicles = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false});
      
      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    }
  };

  const addServiceItem = () => {
    setServiceItems([...serviceItems, {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unit_price: 0,
      item_type: 'labor',
    }]);
  };

  const removeServiceItem = (id: string) => {
    if (serviceItems.length > 1) {
      setServiceItems(serviceItems.filter(item => item.id !== id));
    }
  };

  const updateServiceItem = (id: string, field: keyof ServiceItem, value: any) => {
    setServiceItems(serviceItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return serviceItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const calculateCardPrice = (amount: number) => {
    return amount * 1.035; // 3.5% card processing fee
  };

  const generateEstimateNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const timestamp = now.getTime().toString().slice(-6);
    return `EST-${year}-${timestamp}`;
  };

  const handleSubmit = async () => {
    if (!formData.customer_id || !formData.vehicle_id || !formData.service_type) {
      alert('Please fill in all required fields');
      return;
    }

    if (serviceItems.length === 0 || serviceItems.some(item => !item.description || item.unit_price <= 0)) {
      alert('Please add at least one valid service item');
      return;
    }

    setLoading(true);

    try {
      const subtotal = calculateSubtotal();
      
      if (estimateToEdit) {
        // Update existing estimate
        const { error: updateError } = await (supabase
          .from('estimates') as any)
          .update({
            customer_id: formData.customer_id,
            vehicle_id: formData.vehicle_id,
            service_type: formData.service_type,
            description: formData.description,
            priority: formData.priority,
            notes: formData.notes,
            total_amount: subtotal,
            valid_until: formData.valid_until,
            updated_at: new Date().toISOString(),
          })
          .eq('id', estimateToEdit.id);

        if (updateError) throw updateError;

        // Delete old service items
        await supabase
          .from('service_items')
          .delete()
          .eq('estimate_id', estimateToEdit.id);

        // Insert new service items
        const itemsToInsert = serviceItems.map(item => ({
          estimate_id: estimateToEdit.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          item_type: item.item_type,
        }));

        const { error: itemsError } = await (supabase
          .from('service_items') as any)
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;

      } else {
        // Create new estimate
        const estimateNumber = generateEstimateNumber();
        
        const { data: estimate, error: estimateError } = await (supabase
          .from('estimates') as any)
          .insert({
            estimate_number: estimateNumber,
            customer_id: formData.customer_id,
            vehicle_id: formData.vehicle_id,
            status: 'draft',
            service_type: formData.service_type,
            description: formData.description,
            priority: formData.priority,
            notes: formData.notes,
            total_amount: subtotal,
            valid_until: formData.valid_until,
          })
          .select()
          .single();

        if (estimateError) throw estimateError;
        if (!estimate) throw new Error('Failed to create estimate');

        // Insert service items
        const itemsToInsert = serviceItems.map(item => ({
          estimate_id: estimate.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          item_type: item.item_type,
        }));

        const { error: itemsError } = await (supabase
          .from('service_items') as any)
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving estimate:', error);
      alert('Failed to save estimate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const cardTotal = calculateCardPrice(subtotal);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {estimateToEdit ? 'Edit Estimate' : 'Create New Estimate'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Customer & Vehicle */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Customer *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.customer_id}
                    onChange={(e) => {
                      setFormData({ ...formData, customer_id: e.target.value, vehicle_id: '' });
                      setVehicles([]);
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a customer...</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} - {customer.email}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(true)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                </div>
              </div>

              {formData.customer_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vehicle *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.vehicle_id}
                      onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a vehicle...</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.license_plate}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddVehicle(true)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Vehicle
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!formData.customer_id || !formData.vehicle_id}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Service Details
              </button>
            </div>
          )}

          {/* Step 2: Service Details & Items */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select service type...</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the services needed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Internal notes (not shown to customer)..."
                />
              </div>

              {/* Service Items */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Service Items</h3>
                  <button
                    type="button"
                    onClick={addServiceItem}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {serviceItems.map((item) => {
                    const cashLineTotal = item.quantity * item.unit_price;
                    const cardLineTotal = cashLineTotal * 1.035;
                    const cardUnitPrice = item.unit_price * 1.035;
                    
                    return (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-4">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateServiceItem(item.id, 'description', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              placeholder="Service or part description..."
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Type
                            </label>
                            <select
                              value={item.item_type}
                              onChange={(e) => updateServiceItem(item.id, 'item_type', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                              <option value="labor">Labor</option>
                              <option value="part">Part</option>
                              <option value="fee">Fee</option>
                            </select>
                          </div>

                          <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Qty
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateServiceItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Cash Price
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) => updateServiceItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Card Price
                            </label>
                            <div className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-900">
                              ${cardUnitPrice.toFixed(2)}
                            </div>
                          </div>

                          <div className="col-span-1 flex items-end">
                            <button
                              type="button"
                              onClick={() => removeServiceItem(item.id)}
                              disabled={serviceItems.length === 1}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-300 grid grid-cols-2 gap-4">
                          <div className="text-sm">
                            <span className="text-gray-600">Cash Line Total: </span>
                            <span className="font-semibold text-green-700">${cashLineTotal.toFixed(2)}</span>
                          </div>
                          <div className="text-sm text-right">
                            <span className="text-gray-600">Card Line Total: </span>
                            <span className="font-semibold text-blue-700">${cardLineTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border-2 border-blue-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Cash Price</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-300">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Total:</span>
                          <span className="text-2xl font-bold text-green-600">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Card Price</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processing Fee (3.5%):</span>
                        <span className="font-medium">${(cardTotal - subtotal).toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-300">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Total:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            ${cardTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.service_type || serviceItems.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (estimateToEdit ? 'Update Estimate' : 'Create Estimate')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddCustomer && (
        <AddCustomerModal
          isOpen={showAddCustomer}
          onClose={() => setShowAddCustomer(false)}
          onSuccess={() => {
            setShowAddCustomer(false);
            fetchCustomers();
          }}
        />
      )}

      {showAddVehicle && formData.customer_id && (
        <VehicleLookupModal
          isOpen={showAddVehicle}
          onClose={() => setShowAddVehicle(false)}
          onVehicleSelected={(vehicle) => {
            setFormData({ ...formData, vehicle_id: vehicle.id });
            setShowAddVehicle(false);
            fetchCustomerVehicles(formData.customer_id);
          }}
        />
      )}
    </div>
  );
};

export default CreateEstimateModal;

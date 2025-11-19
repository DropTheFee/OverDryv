import React, { useState, useEffect } from 'react';
import { 
  Car, 
  User, 
  Clock, 
  Camera, 
  FileText, 
  Edit, 
  Save,
  X,
  Phone,
  Mail,
  Plus,
  Trash2,
  Wrench,
  Package,
  Search
} from 'lucide-react';
import InvoiceGenerator from './InvoiceGenerator';

interface WorkOrderDetailProps {
  workOrderId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

interface ServiceItem {
  id: string;
  type: 'labor' | 'part' | 'fee';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({ 
  workOrderId, 
  onClose, 
  onUpdate 
}) => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [existingInvoice, setExistingInvoice] = useState<any>(null);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedItemForInventory, setSelectedItemForInventory] = useState<string | null>(null);

  const statusOptions = [
    'pending',
    'in_progress', 
    'quality_check',
    'completed',
    'picked_up'
  ];

  const priorityOptions = [
    'low',
    'normal',
    'high',
    'urgent'
  ];

  useEffect(() => {
    fetchWorkOrderDetail();
    fetchInventoryItems();
    checkForExistingInvoice();
  }, [workOrderId]);

  const checkForExistingInvoice = async () => {
    // In production, this would check if an invoice already exists for this work order
    // For now, simulate checking
    const hasInvoice = localStorage.getItem(`invoice_${workOrderId}`);
    if (hasInvoice) {
      setExistingInvoice(JSON.parse(hasInvoice));
    }
  };
  const fetchWorkOrderDetail = async () => {
    // Mock data for demonstration
    const mockWorkOrder = {
      id: workOrderId,
      work_order_number: 'WO-001',
      status: 'in_progress',
      priority: 'normal',
      service_type: 'Oil Change & Inspection',
      description: 'Customer reports engine noise and requests full inspection. Vehicle due for regular maintenance.',
      estimated_completion: '2025-01-15T14:00:00',
      total_amount: 75.99,
      created_at: '2025-01-15T08:30:00',
      customer: {
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567'
      },
      vehicle: {
        year: 2022,
        make: 'Toyota',
        model: 'Camry',
        color: 'Silver',
        license_plate: 'ABC-1234',
        mileage: 45200,
        vin: '1HGBH41JXMN109186'
      },
      technician: {
        first_name: 'Mike',
        last_name: 'Johnson'
      }
    };

    const mockPhotos = [
      {
        id: 1,
        url: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'before',
        description: 'Engine bay before service',
        created_at: '2025-01-15T08:45:00'
      },
      {
        id: 2,
        url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'during',
        description: 'Oil change in progress',
        created_at: '2025-01-15T10:30:00'
      }
    ];

    const mockServiceItems = [
      {
        id: '1',
        type: 'labor' as const,
        description: 'Oil Change Service',
        quantity: 1,
        unitPrice: 45.99,
        total: 45.99
      },
      {
        id: '2',
        type: 'part' as const,
        description: 'Oil Filter',
        quantity: 1,
        unitPrice: 12.99,
        total: 12.99
      },
      {
        id: '3',
        type: 'part' as const,
        description: 'Motor Oil (5W-30)',
        quantity: 5,
        unitPrice: 3.50,
        total: 17.50
      }
    ];
    setWorkOrder(mockWorkOrder);
    setPhotos(mockPhotos);
    setServiceItems(mockServiceItems);
    setLoading(false);
  };

  const fetchInventoryItems = async () => {
    // Mock inventory data
    const mockInventory = [
      {
        id: '1',
        part_number: 'BRK-PAD-001',
        name: 'Brake Pads - Front',
        description: 'Premium ceramic brake pads for front wheels',
        category: 'Brakes',
        brand: 'Wagner',
        sell_price: 89.99,
        quantity_on_hand: 12,
        location: 'A-1-3'
      },
      {
        id: '2',
        part_number: 'OIL-FLT-002',
        name: 'Oil Filter',
        description: 'High-efficiency oil filter for most vehicles',
        category: 'Filters',
        brand: 'Fram',
        sell_price: 16.99,
        quantity_on_hand: 25,
        location: 'B-2-1'
      },
      {
        id: '3',
        part_number: 'ENG-OIL-005',
        name: 'Motor Oil 5W-30',
        description: 'Full synthetic motor oil 5W-30, 5 quart jug',
        category: 'Fluids',
        brand: 'Mobil 1',
        sell_price: 39.99,
        quantity_on_hand: 15,
        location: 'E-3-1'
      }
    ];
    setInventoryItems(mockInventory);
  };

  const addInventoryItem = (item: any, quantity: number = 1) => {
    if (selectedItemForInventory) {
      // Update existing service item
      const updatedItems = serviceItems.map(serviceItem => {
        if (serviceItem.id === selectedItemForInventory) {
          const updatedItem = {
            ...serviceItem,
            description: `${item.name} (${item.part_number})`,
            unitPrice: item.sell_price,
            total: serviceItem.quantity * item.sell_price
          };
          return updatedItem;
        }
        return serviceItem;
      });
      setServiceItems(updatedItems);
      
      // Update work order total
      const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      setWorkOrder(prev => ({ ...prev, total_amount: newTotal }));
      
      setSelectedItemForInventory(null);
    } else {
      // Add new service item
      const newServiceItem: ServiceItem = {
        id: Date.now().toString(),
        type: 'part',
        description: `${item.name} (${item.part_number})`,
        quantity: quantity,
        unitPrice: item.sell_price,
        total: quantity * item.sell_price
      };
      
      setServiceItems([...serviceItems, newServiceItem]);
      
      // Update work order total
      const newTotal = [...serviceItems, newServiceItem].reduce((sum, item) => sum + item.total, 0);
      setWorkOrder(prev => ({ ...prev, total_amount: newTotal }));
    }
    
    setShowInventoryModal(false);
    setInventorySearch('');
  };

  const filteredInventory = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.part_number.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.brand.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const handleStatusUpdate = (newStatus: string) => {
    setWorkOrder(prev => ({ ...prev, status: newStatus }));
    onUpdate?.();
  };

  const addServiceItem = () => {
    const newItem: ServiceItem = {
      id: Date.now().toString(),
      type: 'labor',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setServiceItems([...serviceItems, newItem]);
  };

  const updateServiceItem = (id: string, field: keyof ServiceItem, value: any) => {
    const updatedItems = serviceItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    setServiceItems(updatedItems);
    
    // Update work order total
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    setWorkOrder(prev => ({ ...prev, total_amount: newTotal }));
  };

  const removeServiceItem = (id: string) => {
    const updatedItems = serviceItems.filter(item => item.id !== id);
    setServiceItems(updatedItems);
    
    // Update work order total
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    setWorkOrder(prev => ({ ...prev, total_amount: newTotal }));
  };

  const handleSave = () => {
    // In production, this would save to the database
    console.log('Saving work order:', workOrder);
    console.log('Saving service items:', serviceItems);
    setEditing(false);
    onUpdate?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'in_progress': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'quality_check': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'completed': return 'text-green-700 bg-green-100 border-green-200';
      case 'picked_up': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-green-600 bg-green-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{workOrder.work_order_number}</h2>
            <p className="text-gray-600">{workOrder.service_type}</p>
          </div>
          <div className="flex items-center space-x-2">
            {editing && (
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            )}
            <button
              onClick={() => setEditing(!editing)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                editing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {editing ? (
                <>
                  <X className="w-4 h-4 mr-2 inline" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2 inline" />
                  Edit
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              {editing ? (
                <select
                  value={workOrder.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(workOrder.status)}`}>
                  {workOrder.status.replace('_', ' ').toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              {editing ? (
                <select
                  value={workOrder.priority}
                  onChange={(e) => setWorkOrder({...workOrder, priority: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorityOptions.map(priority => (
                    <option key={priority} value={priority}>
                      {priority.toUpperCase()}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(workOrder.priority)}`}>
                  {workOrder.priority.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Customer and Vehicle Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">
                  {workOrder.customer.first_name} {workOrder.customer.last_name}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${workOrder.customer.email}`} className="hover:text-blue-600">
                    {workOrder.customer.email}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${workOrder.customer.phone}`} className="hover:text-blue-600">
                    {workOrder.customer.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Car className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Vehicle Information</h3>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">
                  {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
                </p>
                <p className="text-sm text-gray-600">Color: {workOrder.vehicle.color}</p>
                <p className="text-sm text-gray-600">License: {workOrder.vehicle.license_plate}</p>
                <p className="text-sm text-gray-600">Mileage: {workOrder.vehicle.mileage.toLocaleString()} mi</p>
                <p className="text-sm text-gray-600 font-mono">VIN: {workOrder.vehicle.vin}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Service Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                {editing ? (
                  <input
                    type="text"
                    value={workOrder.service_type}
                    onChange={(e) => setWorkOrder({...workOrder, service_type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{workOrder.service_type}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                {editing ? (
                  <textarea
                    rows={3}
                    value={workOrder.description}
                    onChange={(e) => setWorkOrder({...workOrder, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-700">{workOrder.description}</p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-gray-900">{new Date(workOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion</label>
                  {editing ? (
                    <input
                      type="datetime-local"
                      value={workOrder.estimated_completion ? workOrder.estimated_completion.slice(0, 16) : ''}
                      onChange={(e) => setWorkOrder({...workOrder, estimated_completion: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {workOrder.estimated_completion 
                        ? new Date(workOrder.estimated_completion).toLocaleString()
                        : 'TBD'
                      }
                    </p>
                  )}
                </div>
              </div>
              {workOrder.technician && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Technician</label>
                  <p className="text-gray-900">
                    {workOrder.technician.first_name} {workOrder.technician.last_name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Service Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Wrench className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Service Items</h3>
              </div>
              {editing && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={addServiceItem}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </button>
                  <button
                    onClick={() => setShowInventoryModal(true)}
                    className="flex items-center text-green-600 hover:text-green-800 text-sm"
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Add from Inventory
                  </button>
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total</th>
                    {editing && (
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {serviceItems.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        {editing ? (
                          <select
                            value={item.type}
                            onChange={(e) => {
                              updateServiceItem(item.id, 'type', e.target.value);
                              // If selecting "part", open inventory lookup
                              if (e.target.value === 'part') {
                                setSelectedItemForInventory(item.id);
                                setShowInventoryModal(true);
                              }
                            }}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="labor">Labor</option>
                            <option value="part">Part</option>
                            <option value="fee">Fee</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.type === 'labor' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'part' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editing ? (
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateServiceItem(item.id, 'description', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Description"
                          />
                        ) : (
                          <span className="text-gray-900">{item.description}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editing ? (
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateServiceItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                            step="0.1"
                          />
                        ) : (
                          <span className="text-gray-900">{item.quantity}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editing ? (
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateServiceItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-20 text-right border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          <span className="text-gray-900">${item.unitPrice.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ${item.total.toFixed(2)}
                      </td>
                      {editing && (
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => removeServiceItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Photos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Camera className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Documentation Photos</h3>
              </div>
              <span className="text-sm text-gray-500">{photos.length} photos</span>
            </div>
            
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map(photo => (
                  <div key={photo.id} className="group relative">
                    <img
                      src={photo.url}
                      alt={photo.description}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity cursor-pointer"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {photo.category}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No photos uploaded yet</p>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Pricing Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Service Total:</span>
                <span className="font-semibold text-gray-900">${serviceItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (8.5%):</span>
                <span>${(serviceItems.reduce((sum, item) => sum + item.total, 0) * 0.085).toFixed(2)}</span>
              </div>
              <div className="border-t border-green-300 pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">${(serviceItems.reduce((sum, item) => sum + item.total, 0) * 1.085).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Send Update to Customer
            </button>
            <button 
              onClick={() => setShowInvoiceGenerator(true)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                existingInvoice 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {existingInvoice ? 'Edit Invoice' : 'Generate Invoice'}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Generator Modal */}
      {showInvoiceGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Generate Invoice</h3>
              <button
                onClick={() => setShowInvoiceGenerator(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <InvoiceGenerator
              workOrderId={workOrderId}
              workOrderData={{...workOrder, serviceItems}}
              existingInvoice={existingInvoice}
              onClose={() => setShowInvoiceGenerator(false)}
              onInvoiceSaved={(invoiceData) => {
                setExistingInvoice(invoiceData);
              }}
            />
          </div>
        </div>
      )}

      {/* Inventory Selection Modal */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Parts from Inventory</h3>
              <button
                onClick={() => setShowInventoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {selectedItemForInventory 
                    ? "Select a part to update the current service item:" 
                    : "Search and select parts from your inventory to add to this work order:"
                  }
                </p>
              </div>
              
              {/* Search */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search parts by name, part number, or brand..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Inventory Items */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredInventory.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.part_number} • {item.brand}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">Location: {item.location}</span>
                            <span className={`text-xs ${item.quantity_on_hand > 5 ? 'text-green-600' : 'text-orange-600'}`}>
                              Stock: {item.quantity_on_hand}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">${item.sell_price.toFixed(2)}</span>
                      <button
                        onClick={() => addInventoryItem(item)}
                        disabled={item.quantity_on_hand === 0}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedItemForInventory 
                            ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white'
                        }`}
                      >
                        {selectedItemForInventory ? 'Update Item' : 'Add to Order'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredInventory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No inventory items found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrderDetail;
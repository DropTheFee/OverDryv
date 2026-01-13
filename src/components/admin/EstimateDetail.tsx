import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Car, 
  User, 
  Edit, 
  Send, 
  Check, 
  Printer,
  Mail,
  MessageSquare,
  Trash2,
  Wrench
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatDate, formatPhoneNumber } from '../../utils/formatters';
import CreateEstimateModal from './CreateEstimateModal';

interface EstimateDetailProps {
  estimate: any;
  onClose: () => void;
}

const EstimateDetail: React.FC<EstimateDetailProps> = ({ estimate, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [estimateData, setEstimateData] = useState<any>(null);
  const [serviceItems, setServiceItems] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEstimateDetails();
  }, [estimate.id]);

  const fetchEstimateDetails = async () => {
    try {
      // Fetch full estimate details with relations
      const { data: estData, error: estError } = await supabase
        .from('estimates')
        .select(`
          *,
          profiles:customer_id (
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          vehicles:vehicle_id (
            id,
            year,
            make,
            model,
            color,
            license_plate,
            vin,
            mileage
          )
        `)
        .eq('id', estimate.id)
        .single();

      if (estError) throw estError;

      // Fetch service items
      const { data: items, error: itemsError } = await supabase
        .from('service_items')
        .select('*')
        .eq('estimate_id', estimate.id)
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;

      setEstimateData(estData);
      setServiceItems(items || []);
    } catch (error) {
      console.error('Error fetching estimate details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return serviceItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const calculateCardPrice = (amount: number) => {
    return amount * 1.035; // 3.5% card fee
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await (supabase
        .from('estimates') as any)
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', estimate.id);

      if (error) throw error;

      // Refresh data
      await fetchEstimateDetails();
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEstimate = async () => {
    if (!confirm('Send this estimate to the customer via email?')) {
      return;
    }

    setActionLoading(true);
    try {
      // Update status to sent
      const { error } = await (supabase
        .from('estimates') as any)
        .update({ 
          status: 'sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', estimate.id);

      if (error) throw error;

      // In production, this would trigger an email
      alert('Estimate sent successfully! (Email functionality would be triggered here)');
      await fetchEstimateDetails();
    } catch (error) {
      console.error('Error sending estimate:', error);
      alert('Failed to send estimate');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvertToWorkOrder = async () => {
    if (!confirm('Convert this estimate to a work order? This will create a new work order with all the details from this estimate.')) {
      return;
    }

    setActionLoading(true);
    try {
      // First, update estimate status to approved if not already
      if (estimateData.status !== 'approved') {
        await (supabase
          .from('estimates') as any)
          .update({ status: 'approved', updated_at: new Date().toISOString() })
          .eq('id', estimate.id);
      }

      // Generate work order number
      const now = new Date();
      const year = now.getFullYear();
      const timestamp = now.getTime().toString().slice(-6);
      const workOrderNumber = `WO-${year}-${timestamp}`;

      // Create work order from estimate
      const { data: workOrder, error: woError } = await (supabase
        .from('work_orders') as any)
        .insert({
          work_order_number: workOrderNumber,
          customer_id: estimateData.customer_id,
          vehicle_id: estimateData.vehicle_id,
          status: 'pending',
          service_type: estimateData.service_type,
          description: estimateData.description,
          priority: estimateData.priority,
          total_amount: estimateData.total_amount,
          notes: `Converted from estimate ${estimateData.estimate_number}. ${estimateData.notes || ''}`,
        })
        .select()
        .single();

      if (woError) throw woError;
      if (!workOrder) throw new Error('Failed to create work order');

      // Copy service items to work order
      const itemsToInsert = serviceItems.map(item => ({
        work_order_id: workOrder.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        item_type: item.item_type,
      }));

      const { error: itemsError } = await (supabase
        .from('service_items') as any)
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      alert(`Successfully converted to Work Order ${workOrderNumber}!`);
      onClose(); // Close and refresh parent
    } catch (error) {
      console.error('Error converting to work order:', error);
      alert('Failed to convert to work order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this estimate? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      // Service items will be deleted automatically due to CASCADE
      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', estimate.id);

      if (error) throw error;

      alert('Estimate deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting estimate:', error);
      alert('Failed to delete estimate');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSMS = () => {
    alert('SMS functionality would be integrated here with Twilio or similar service');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!estimateData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Estimate not found</p>
        <button onClick={onClose} className="mt-4 text-blue-600 hover:text-blue-700">
          Go Back
        </button>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const cardTotal = calculateCardPrice(subtotal);
  const customer = estimateData.profiles;
  const vehicle = estimateData.vehicles;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Estimates
        </button>

        <div className="flex items-center gap-3">
          {/* Action Buttons based on status */}
          {estimateData.status === 'draft' && (
            <>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleSendEstimate}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send to Customer
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}

          {estimateData.status === 'sent' && (
            <>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleSendEstimate}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Resend
              </button>
              <button
                onClick={() => handleStatusChange('approved')}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark Approved
              </button>
            </>
          )}

          {estimateData.status === 'approved' && (
            <button
              onClick={handleConvertToWorkOrder}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              Convert to Work Order
            </button>
          )}

          {/* Always show these */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleSendEstimate}
            disabled={actionLoading}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={handleSMS}
            className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            SMS
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="col-span-2 space-y-6">
          {/* Estimate Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {estimateData.estimate_number}
                </h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(estimateData.status)}`}>
                  {estimateData.status.charAt(0).toUpperCase() + estimateData.status.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{formatDate(estimateData.created_at)}</p>
                <p className="text-sm text-gray-500 mt-2">Valid Until</p>
                <p className="font-medium">{formatDate(estimateData.valid_until)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Service Type</h3>
                <p className="text-lg font-semibold text-gray-900">{estimateData.service_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
                <p className="text-lg font-semibold text-gray-900 capitalize">{estimateData.priority}</p>
              </div>
            </div>

            {estimateData.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-700">{estimateData.description}</p>
              </div>
            )}

            {estimateData.notes && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Internal Notes</h3>
                <p className="text-gray-600 text-sm">{estimateData.notes}</p>
              </div>
            )}
          </div>

          {/* Service Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Items</h3>
            
            <div className="space-y-3 mb-6">
              {serviceItems.map((item) => {
                const cashTotal = item.quantity * item.unit_price;
                const cardUnitPrice = item.unit_price * 1.035;
                const cardTotal = cashTotal * 1.035;
                
                return (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.description}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.item_type} • Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-300">
                      <div className="bg-green-50 rounded p-3 border border-green-200">
                        <p className="text-xs font-medium text-gray-600 mb-1">Cash Price</p>
                        <p className="text-sm text-gray-700">${item.unit_price.toFixed(2)} × {item.quantity}</p>
                        <p className="text-lg font-bold text-green-700 mt-1">${cashTotal.toFixed(2)}</p>
                      </div>
                      <div className="bg-blue-50 rounded p-3 border border-blue-200">
                        <p className="text-xs font-medium text-gray-600 mb-1">Card Price</p>
                        <p className="text-sm text-gray-700">${cardUnitPrice.toFixed(2)} × {item.quantity}</p>
                        <p className="text-lg font-bold text-blue-700 mt-1">${cardTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dual Pricing Summary */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Cash Price */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Cash Price</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-green-300">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-green-600">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Price */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
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
                    <div className="pt-2 border-t border-blue-300">
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
          </div>
        </div>

        {/* Right Column - Customer & Vehicle */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Customer</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {customer.first_name} {customer.last_name}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${customer.email}`} className="text-blue-600 hover:text-blue-700">
                  {customer.email}
                </a>
              </div>
              
              {customer.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href={`tel:${customer.phone}`} className="text-blue-600 hover:text-blue-700">
                    {formatPhoneNumber(customer.phone)}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Car className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Vehicle</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium text-gray-900">{vehicle.color}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">License Plate</p>
                <p className="font-medium text-gray-900">{vehicle.license_plate}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">VIN</p>
                <p className="font-mono text-xs text-gray-700">{vehicle.vin}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-medium text-gray-900">{vehicle.mileage?.toLocaleString()} mi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <CreateEstimateModal
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchEstimateDetails();
          }}
          estimateToEdit={estimateData}
        />
      )}
    </div>
  );
};

export default EstimateDetail;

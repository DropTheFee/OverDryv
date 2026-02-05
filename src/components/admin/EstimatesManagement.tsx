import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Clock, CheckCircle, XCircle, AlertCircle, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../utils/formatters';
import CreateEstimateModal from './CreateEstimateModal';
import EstimateDetail from './EstimateDetail';

interface Estimate {
  id: string;
  estimate_number: string;
  customer_id: string;
  vehicle_id: string;
  status: 'draft' | 'sent' | 'approved' | 'declined' | 'expired';
  service_type: string;
  description: string;
  total_amount: number;
  valid_until: string;
  priority: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
  vehicles: {
    year: number;
    make: string;
    model: string;
    license_plate: string;
  };
}

const EstimatesManagement: React.FC = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [filteredEstimates, setFilteredEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);

  const refetchEstimates = async () => {
    try {
      console.log('Fetching estimates...');
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEstimates(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        console.log('Fetching estimates...');
        const { data, error } = await supabase
          .from('estimates')
          .select('*')
          .order('created_at', { ascending: false });

        if (!isMounted) return;
        
        if (error) throw error;
        setEstimates(data || []);
      } catch (error) {
        if (!isMounted) return;
        console.error('Error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    filterEstimates();
  }, [estimates, searchTerm, statusFilter]);

  const filterEstimates = () => {
    let filtered = [...estimates];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(est => est.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(est =>
        est.estimate_number.toLowerCase().includes(search) ||
        `${est.profiles.first_name} ${est.profiles.last_name}`.toLowerCase().includes(search) ||
        est.service_type.toLowerCase().includes(search) ||
        `${est.vehicles.year} ${est.vehicles.make} ${est.vehicles.model}`.toLowerCase().includes(search)
      );
    }

    setFilteredEstimates(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'sent': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'declined': return 'bg-red-100 text-red-800 border-red-300';
      case 'expired': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const statusCounts = {
    all: estimates.length,
    draft: estimates.filter(e => e.status === 'draft').length,
    sent: estimates.filter(e => e.status === 'sent').length,
    approved: estimates.filter(e => e.status === 'approved').length,
    declined: estimates.filter(e => e.status === 'declined').length,
    expired: estimates.filter(e => e.status === 'expired').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedEstimate) {
    return (
      <EstimateDetail
        estimate={selectedEstimate}
        onClose={() => {
          setSelectedEstimate(null);
          refetchEstimates();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estimates</h1>
          <p className="text-gray-600 mt-1">Manage customer quotes and proposals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Estimate
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1 overflow-x-auto">
        {[
          { key: 'all', label: 'All Estimates', count: statusCounts.all },
          { key: 'draft', label: 'Draft', count: statusCounts.draft },
          { key: 'sent', label: 'Sent', count: statusCounts.sent },
          { key: 'approved', label: 'Approved', count: statusCounts.approved },
          { key: 'declined', label: 'Declined', count: statusCounts.declined },
          { key: 'expired', label: 'Expired', count: statusCounts.expired },
        ].map(status => (
          <button
            key={status.key}
            onClick={() => setStatusFilter(status.key)}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap ${
              statusFilter === status.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by estimate #, customer, service, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Estimates List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estimate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cash Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEstimates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No estimates found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Create your first estimate to get started'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEstimates.map((estimate) => {
                  const cardPrice = estimate.total_amount * 1.035; // 3.5% card fee
                  return (
                    <tr
                      key={estimate.id}
                      onClick={() => setSelectedEstimate(estimate)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${getStatusColor(estimate.status)} mr-3`}>
                            {getStatusIcon(estimate.status)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {estimate.estimate_number}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(estimate.created_at)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {estimate.profiles.first_name} {estimate.profiles.last_name}
                        </div>
                        <div className="text-xs text-gray-500">{estimate.profiles.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {estimate.vehicles.year} {estimate.vehicles.make} {estimate.vehicles.model}
                        </div>
                        <div className="text-xs text-gray-500">{estimate.vehicles.license_plate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{estimate.service_type}</div>
                        <div className={`text-xs font-medium ${getPriorityColor(estimate.priority)}`}>
                          {estimate.priority.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(estimate.total_amount)}
                        </div>
                        <div className="text-xs text-gray-500">Cash</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-600">
                          {formatCurrency(cardPrice)}
                        </div>
                        <div className="text-xs text-gray-500">Card (+3.5%)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(estimate.status)}`}>
                          {getStatusIcon(estimate.status)}
                          {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(estimate.valid_until)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <CreateEstimateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetchEstimates();
          }}
        />
      )}
    </div>
  );
};

export default EstimatesManagement;

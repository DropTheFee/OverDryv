import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Package, AlertTriangle, TrendingDown, TrendingUp, Edit, ShoppingCart, Minus } from 'lucide-react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTenant } from '../../contexts/TenantContext';

interface Part {
  id: string;
  organization_id: string;
  part_number: string | null;
  name: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  unit_cost: number;
  retail_price: number;
  quantity_on_hand: number;
  minimum_stock: number;
  maximum_stock: number | null;
  location: string | null;
  supplier: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

interface NewPartForm {
  part_number: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  unit_cost: string;
  retail_price: string;
  quantity_on_hand: string;
  minimum_stock: string;
  maximum_stock: string;
  location: string;
  supplier: string;
}

const initialFormState: NewPartForm = {
  part_number: '',
  name: '',
  description: '',
  category: '',
  brand: '',
  unit_cost: '',
  retail_price: '',
  quantity_on_hand: '0',
  minimum_stock: '0',
  maximum_stock: '',
  location: '',
  supplier: '',
};

const PartsInventory: React.FC = () => {
  const { organizationId } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [showEditPartModal, setShowEditPartModal] = useState(false);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [showAdjustStockModal, setShowAdjustStockModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState<NewPartForm>(initialFormState);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = useCallback(async () => {
    if (!organizationId) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setParts(data || []);
    } catch (err) {
      console.error('Error fetching parts:', err);
      setError('Failed to load parts inventory');
      setParts([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    if (organizationId) {
      fetchParts();
    }
  }, [organizationId, fetchParts]);

  const handleAddPart = async () => {
    if (!organizationId) return;
    if (!formData.name.trim()) {
      setError('Part name is required');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('parts')
        .insert({
          organization_id: organizationId,
          part_number: formData.part_number || null,
          name: formData.name.trim(),
          description: formData.description || null,
          category: formData.category || null,
          brand: formData.brand || null,
          unit_cost: parseFloat(formData.unit_cost) || 0,
          retail_price: parseFloat(formData.retail_price) || 0,
          quantity_on_hand: parseInt(formData.quantity_on_hand) || 0,
          minimum_stock: parseInt(formData.minimum_stock) || 0,
          maximum_stock: formData.maximum_stock ? parseInt(formData.maximum_stock) : null,
          location: formData.location || null,
          supplier: formData.supplier || null,
          is_active: true,
        });

      if (error) throw error;
      
      setShowAddPartModal(false);
      setFormData(initialFormState);
      await fetchParts();
    } catch (err) {
      console.error('Error adding part:', err);
      setError('Failed to add part');
    } finally {
      setSaving(false);
    }
  };

  const handleEditPart = async () => {
    if (!organizationId || !selectedPart) return;
    if (!formData.name.trim()) {
      setError('Part name is required');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('parts')
        .update({
          part_number: formData.part_number || null,
          name: formData.name.trim(),
          description: formData.description || null,
          category: formData.category || null,
          brand: formData.brand || null,
          unit_cost: parseFloat(formData.unit_cost) || 0,
          retail_price: parseFloat(formData.retail_price) || 0,
          quantity_on_hand: parseInt(formData.quantity_on_hand) || 0,
          minimum_stock: parseInt(formData.minimum_stock) || 0,
          maximum_stock: formData.maximum_stock ? parseInt(formData.maximum_stock) : null,
          location: formData.location || null,
          supplier: formData.supplier || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedPart.id)
        .eq('organization_id', organizationId);

      if (error) throw error;
      
      setShowEditPartModal(false);
      setSelectedPart(null);
      setFormData(initialFormState);
      await fetchParts();
    } catch (err) {
      console.error('Error updating part:', err);
      setError('Failed to update part');
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustStock = async () => {
    if (!organizationId || !selectedPart) return;

    const newQuantity = selectedPart.quantity_on_hand + stockAdjustment;
    if (newQuantity < 0) {
      setError('Stock cannot be negative');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('parts')
        .update({
          quantity_on_hand: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedPart.id)
        .eq('organization_id', organizationId);

      if (error) throw error;
      
      setShowAdjustStockModal(false);
      setSelectedPart(null);
      setStockAdjustment(0);
      await fetchParts();
    } catch (err) {
      console.error('Error adjusting stock:', err);
      setError('Failed to adjust stock');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (part: Part) => {
    setSelectedPart(part);
    setFormData({
      part_number: part.part_number || '',
      name: part.name,
      description: part.description || '',
      category: part.category || '',
      brand: part.brand || '',
      unit_cost: part.unit_cost.toString(),
      retail_price: part.retail_price.toString(),
      quantity_on_hand: part.quantity_on_hand.toString(),
      minimum_stock: part.minimum_stock.toString(),
      maximum_stock: part.maximum_stock?.toString() || '',
      location: part.location || '',
      supplier: part.supplier || '',
    });
    setShowEditPartModal(true);
  };

  const openAdjustStockModal = (part: Part) => {
    setSelectedPart(part);
    setStockAdjustment(0);
    setShowAdjustStockModal(true);
  };

  // Get unique categories from parts data
  const categories = ['All Categories', ...Array.from(new Set(parts.map(p => p.category).filter(Boolean) as string[]))];

  const getStockStatus = (part: Part) => {
    if (part.quantity_on_hand === 0) return { status: 'out', color: 'text-red-600 bg-red-100', text: 'Out of Stock' };
    if (part.quantity_on_hand <= part.minimum_stock) return { status: 'low', color: 'text-orange-600 bg-orange-100', text: 'Low Stock' };
    return { status: 'good', color: 'text-green-600 bg-green-100', text: 'In Stock' };
  };

  const calculateProfitMargin = (part: Part): string => {
    if (part.retail_price === 0) return '0.0';
    return ((part.retail_price - part.unit_cost) / part.retail_price * 100).toFixed(1);
  };

  const filteredParts = parts.filter(part => {
    const matchesSearch = 
      (part.part_number?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (part.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesCategory = categoryFilter === 'all' || categoryFilter === 'All Categories' || part.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'low' && part.quantity_on_hand <= part.minimum_stock && part.quantity_on_hand > 0) ||
      (stockFilter === 'instock' && part.quantity_on_hand > part.minimum_stock);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const stats = {
    totalParts: parts.length,
    totalValue: parts.reduce((sum, p) => sum + (p.quantity_on_hand * p.unit_cost), 0),
    lowStock: parts.filter(p => p.quantity_on_hand <= p.minimum_stock && p.quantity_on_hand > 0).length,
    outOfStock: parts.filter(p => p.quantity_on_hand === 0).length,
    categories: new Set(parts.map(p => p.category).filter(Boolean)).size,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parts Inventory</h1>
          <p className="text-gray-600">Manage parts, track stock levels, and monitor inventory</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCreateOrderModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create Order
          </button>
          <button 
            onClick={() => {
              setFormData(initialFormState);
              setError(null);
              setShowAddPartModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Part
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Inventory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalParts}</p>
              <p className="text-gray-600 text-sm">Total Parts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-gray-600 text-sm">Inventory Value</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
              <p className="text-gray-600 text-sm">Low Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
              <p className="text-gray-600 text-sm">Out of Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
              <p className="text-gray-600 text-sm">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search parts, part numbers, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="instock">In Stock</option>
          </select>
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty On Hand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retail Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    No parts found
                  </td>
                </tr>
              ) : (
                filteredParts.map(part => {
                  const stockStatus = getStockStatus(part);
                  const isLowStock = part.quantity_on_hand <= part.minimum_stock;
                  
                  return (
                    <tr key={part.id} className={`hover:bg-gray-50 ${isLowStock ? 'bg-orange-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-gray-900">{part.part_number || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{part.name}</p>
                          {part.description && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{part.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {part.brand || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {part.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{part.quantity_on_hand}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Min: {part.minimum_stock}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        ${part.unit_cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        ${part.retail_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-600 font-medium">{calculateProfitMargin(part)}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {part.location || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openAdjustStockModal(part)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Adjust Stock"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditModal(part)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit Part"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            Reorder Alerts
          </h3>
          <div className="space-y-3">
            {parts.filter(p => p.quantity_on_hand <= p.minimum_stock).slice(0, 3).map(part => (
              <div key={part.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{part.name}</p>
                  <p className="text-xs text-gray-600">{part.quantity_on_hand} left (min: {part.minimum_stock})</p>
                </div>
                <button 
                  onClick={() => openAdjustStockModal(part)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Adjust
                </button>
              </div>
            ))}
            {parts.filter(p => p.quantity_on_hand <= p.minimum_stock).length === 0 && (
              <p className="text-gray-500 text-sm">No reorder alerts</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-3">
            {Object.entries(
              parts.reduce((acc, part) => {
                const cat = part.category || 'Uncategorized';
                acc[cat] = (acc[cat] || 0) + part.quantity_on_hand;
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700">{category}</span>
                <span className="font-medium text-gray-900">{count} units</span>
              </div>
            ))}
            {parts.length === 0 && (
              <p className="text-gray-500 text-sm">No categories yet</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Inventory Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total SKUs</span>
              <span className="font-medium text-gray-900">{stats.totalParts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Units</span>
              <span className="font-medium text-gray-900">
                {parts.reduce((sum, p) => sum + p.quantity_on_hand, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Avg. Unit Cost</span>
              <span className="font-medium text-gray-900">
                ${parts.length > 0 ? (parts.reduce((sum, p) => sum + p.unit_cost, 0) / parts.length).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Avg. Margin</span>
              <span className="font-medium text-green-600">
                {parts.length > 0 ? (parts.reduce((sum, p) => sum + parseFloat(calculateProfitMargin(p)), 0) / parts.length).toFixed(1) : '0.0'}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Part Modal */}
      {showAddPartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Part</h3>
              <button 
                onClick={() => setShowAddPartModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                <input
                  type="text"
                  value={formData.part_number}
                  onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BRK-PAD-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Part name"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Part description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Brakes, Filters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Wagner, Fram"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unit_cost}
                  onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.retail_price}
                  onChange={(e) => setFormData({ ...formData, retail_price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity On Hand</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity_on_hand}
                  onChange={(e) => setFormData({ ...formData, quantity_on_hand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimum_stock}
                  onChange={(e) => setFormData({ ...formData, minimum_stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.maximum_stock}
                  onChange={(e) => setFormData({ ...formData, maximum_stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., A-1-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., AutoZone, NAPA"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddPartModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPart}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Part'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Part Modal */}
      {showEditPartModal && selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Part</h3>
              <button 
                onClick={() => {
                  setShowEditPartModal(false);
                  setSelectedPart(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                <input
                  type="text"
                  value={formData.part_number}
                  onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unit_cost}
                  onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.retail_price}
                  onChange={(e) => setFormData({ ...formData, retail_price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity On Hand</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity_on_hand}
                  onChange={(e) => setFormData({ ...formData, quantity_on_hand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimum_stock}
                  onChange={(e) => setFormData({ ...formData, minimum_stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.maximum_stock}
                  onChange={(e) => setFormData({ ...formData, maximum_stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditPartModal(false);
                  setSelectedPart(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPart}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustStockModal && selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Adjust Stock</h3>
              <button 
                onClick={() => {
                  setShowAdjustStockModal(false);
                  setSelectedPart(null);
                  setStockAdjustment(0);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <p className="font-medium text-gray-900">{selectedPart.name}</p>
              <p className="text-sm text-gray-600">{selectedPart.part_number || 'No part number'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Current Stock:</span>
                <span className="font-bold text-gray-900">{selectedPart.quantity_on_hand}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">New Stock:</span>
                <span className={`font-bold ${selectedPart.quantity_on_hand + stockAdjustment < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedPart.quantity_on_hand + stockAdjustment}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={() => setStockAdjustment(prev => prev - 1)}
                className="w-12 h-12 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xl font-bold"
              >
                <Minus className="w-6 h-6" />
              </button>
              <input
                type="number"
                value={stockAdjustment}
                onChange={(e) => setStockAdjustment(parseInt(e.target.value) || 0)}
                className="w-24 text-center text-2xl font-bold border border-gray-300 rounded-lg py-2"
              />
              <button
                onClick={() => setStockAdjustment(prev => prev + 1)}
                className="w-12 h-12 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center text-xl font-bold"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAdjustStockModal(false);
                  setSelectedPart(null);
                  setStockAdjustment(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustStock}
                disabled={saving || stockAdjustment === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Stock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create Parts Order</h3>
              <button 
                onClick={() => setShowCreateOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Parts ordering functionality coming soon...</p>
              <button 
                onClick={() => setShowCreateOrderModal(false)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartsInventory;
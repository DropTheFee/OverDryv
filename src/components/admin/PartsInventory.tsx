import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, AlertTriangle, TrendingDown, TrendingUp, Edit, Eye, ShoppingCart } from 'lucide-react';
import { X } from 'lucide-react';

interface Part {
  id: string;
  part_number: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  cost_price: number;
  sell_price: number;
  quantity_on_hand: number;
  minimum_stock: number;
  location: string;
  supplier: string;
  last_ordered: string;
  created_at: string;
}

const PartsInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);

  // Mock data for demonstration
  const mockParts: Part[] = [
    {
      id: '1',
      part_number: 'BRK-PAD-001',
      name: 'Brake Pads - Front',
      description: 'Premium ceramic brake pads for front wheels',
      category: 'Brakes',
      brand: 'Wagner',
      cost_price: 45.99,
      sell_price: 89.99,
      quantity_on_hand: 12,
      minimum_stock: 5,
      location: 'A-1-3',
      supplier: 'AutoZone',
      last_ordered: '2025-01-10',
      created_at: '2024-12-01',
    },
    {
      id: '2',
      part_number: 'OIL-FLT-002',
      name: 'Oil Filter',
      description: 'High-efficiency oil filter for most vehicles',
      category: 'Filters',
      brand: 'Fram',
      cost_price: 8.99,
      sell_price: 16.99,
      quantity_on_hand: 3,
      minimum_stock: 10,
      location: 'B-2-1',
      supplier: 'NAPA',
      last_ordered: '2025-01-05',
      created_at: '2024-11-15',
    },
    {
      id: '3',
      part_number: 'TIR-ALL-003',
      name: 'All-Season Tire 225/60R16',
      description: 'Premium all-season tire with 60,000 mile warranty',
      category: 'Tires',
      brand: 'Michelin',
      cost_price: 120.00,
      sell_price: 199.99,
      quantity_on_hand: 8,
      minimum_stock: 4,
      location: 'C-1-1',
      supplier: 'Tire Rack',
      last_ordered: '2024-12-20',
      created_at: '2024-10-01',
    },
    {
      id: '4',
      part_number: 'BAT-STD-004',
      name: 'Car Battery 12V',
      description: 'Standard 12V car battery with 3-year warranty',
      category: 'Electrical',
      brand: 'Interstate',
      cost_price: 89.99,
      sell_price: 149.99,
      quantity_on_hand: 0,
      minimum_stock: 3,
      location: 'D-1-2',
      supplier: 'Interstate Batteries',
      last_ordered: '2024-12-15',
      created_at: '2024-09-01',
    },
    {
      id: '5',
      part_number: 'ENG-OIL-005',
      name: 'Motor Oil 5W-30',
      description: 'Full synthetic motor oil 5W-30, 5 quart jug',
      category: 'Fluids',
      brand: 'Mobil 1',
      cost_price: 24.99,
      sell_price: 39.99,
      quantity_on_hand: 25,
      minimum_stock: 15,
      location: 'E-3-1',
      supplier: 'Valvoline',
      last_ordered: '2025-01-12',
      created_at: '2024-08-01',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setParts(mockParts);
      setLoading(false);
    }, 500);
  }, []);

  const categories = ['All Categories', ...new Set(parts.map(p => p.category))];

  const getStockStatus = (part: Part) => {
    if (part.quantity_on_hand === 0) return { status: 'out', color: 'text-red-600 bg-red-100', text: 'Out of Stock' };
    if (part.quantity_on_hand <= part.minimum_stock) return { status: 'low', color: 'text-orange-600 bg-orange-100', text: 'Low Stock' };
    return { status: 'good', color: 'text-green-600 bg-green-100', text: 'In Stock' };
  };

  const filteredParts = parts.filter(part => {
    const matchesSearch = 
      part.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || categoryFilter === 'All Categories' || part.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'low' && part.quantity_on_hand <= part.minimum_stock) ||
      (stockFilter === 'out' && part.quantity_on_hand === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const stats = {
    totalParts: parts.length,
    totalValue: parts.reduce((sum, p) => sum + (p.quantity_on_hand * p.cost_price), 0),
    lowStock: parts.filter(p => p.quantity_on_hand <= p.minimum_stock && p.quantity_on_hand > 0).length,
    outOfStock: parts.filter(p => p.quantity_on_hand === 0).length,
    categories: new Set(parts.map(p => p.category)).size,
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
            onClick={() => setShowAddPartModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Part
          </button>
        </div>
      </div>

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
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
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
            <option value="out">Out of Stock</option>
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
                  Part Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category / Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pricing
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
              {filteredParts.map(part => {
                const stockStatus = getStockStatus(part);
                const margin = ((part.sell_price - part.cost_price) / part.cost_price * 100);
                
                return (
                  <tr key={part.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{part.name}</p>
                        <p className="text-sm text-gray-600 font-mono">{part.part_number}</p>
                        <p className="text-xs text-gray-500 mt-1">{part.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{part.category}</p>
                        <p className="text-sm text-gray-600">{part.brand}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{part.quantity_on_hand}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Min: {part.minimum_stock}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">${part.sell_price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Cost: ${part.cost_price.toFixed(2)}</p>
                        <p className="text-xs text-green-600">+{margin.toFixed(0)}% margin</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{part.location}</p>
                        <p className="text-sm text-gray-600">{part.supplier}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        {part.quantity_on_hand <= part.minimum_stock && (
                          <button 
                            onClick={() => alert(`Reordering ${part.name} from ${part.supplier}`)}
                            className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            Reorder
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                  <p className="text-xs text-gray-600">{part.quantity_on_hand} left</p>
                </div>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Order Now
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-3">
            {Object.entries(
              parts.reduce((acc, part) => {
                acc[part.category] = (acc[part.category] || 0) + part.quantity_on_hand;
                return acc;
              }, {} as Record<string, number>)
            ).slice(0, 4).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700">{category}</span>
                <span className="font-medium text-gray-900">{count} parts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-900">Oil filters restocked</p>
              <p className="text-gray-500">2 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900">Brake pads sold</p>
              <p className="text-gray-500">4 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900">New tire shipment</p>
              <p className="text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Part Modal */}
      {showAddPartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Part</h3>
              <button 
                onClick={() => setShowAddPartModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Add Part functionality coming soon...</p>
              <button 
                onClick={() => setShowAddPartModal(false)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Close
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
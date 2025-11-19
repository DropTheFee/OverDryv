import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Clock,
  Wrench
} from 'lucide-react';

const ReportsSection: React.FC = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('overview');

  // Mock data
  const metrics = {
    totalRevenue: 15650.75,
    totalOrders: 45,
    averageOrderValue: 347.79,
    customerRetention: 85,
    completionRate: 94,
    averageCompletionTime: 2.3,
  };

  const revenueData = [
    { period: 'Jan 1-7', revenue: 2100, orders: 8 },
    { period: 'Jan 8-14', revenue: 3200, orders: 12 },
    { period: 'Jan 15-21', revenue: 2800, orders: 10 },
    { period: 'Jan 22-28', revenue: 3900, orders: 15 },
  ];

  const serviceBreakdown = [
    { service: 'Oil Change', count: 18, revenue: 899.82, percentage: 40 },
    { service: 'Brake Service', count: 8, revenue: 2280.00, percentage: 18 },
    { service: 'Diagnostics', count: 6, revenue: 1200.00, percentage: 13 },
    { service: 'Tire Service', count: 7, revenue: 1050.00, percentage: 16 },
    { service: 'Other', count: 6, revenue: 1220.93, percentage: 13 },
  ];

  const topCustomers = [
    { name: 'Mike Chen', orders: 4, spent: 1250.75, vehicles: 1 },
    { name: 'Sarah Davis', orders: 3, spent: 890.25, vehicles: 1 },
    { name: 'John Smith', orders: 3, spent: 725.50, vehicles: 2 },
  ];

  const technicianPerformance = [
    { name: 'Mike Johnson', completed: 15, avgTime: 2.1, efficiency: 96 },
    { name: 'Tom Wilson', completed: 12, avgTime: 2.8, efficiency: 89 },
    { name: 'Sarah Davis', completed: 18, avgTime: 1.9, efficiency: 98 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Reports</h1>
          <p className="text-gray-600">Comprehensive analytics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={() => {
              const csvData = `Date Range,Revenue,Orders,Average Order Value\n${dateRange},$${metrics.totalRevenue},$${metrics.totalOrders},$${metrics.averageOrderValue}`;
              const blob = new Blob([csvData], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `business-report-${dateRange}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toLocaleString()}</p>
              <p className="text-gray-600 text-sm">Total Revenue</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Wrench className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
              <p className="text-gray-600 text-sm">Work Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">${metrics.averageOrderValue}</p>
              <p className="text-gray-600 text-sm">Avg Order Value</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.customerRetention}%</p>
              <p className="text-gray-600 text-sm">Retention Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.completionRate}%</p>
              <p className="text-gray-600 text-sm">On-Time Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.averageCompletionTime}d</p>
              <p className="text-gray-600 text-sm">Avg Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
              <span className="text-gray-600">Orders</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {revenueData.map((data, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-24">{data.period}</span>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-4 relative">
                  <div 
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${data.revenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{data.orders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Breakdown and Top Customers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Breakdown</h3>
          <div className="space-y-4">
            {serviceBreakdown.map((service, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{service.service}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">${service.revenue.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-2">({service.count})</span>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Customers</h3>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.vehicles} vehicle{customer.vehicles > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${customer.spent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{customer.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technician Performance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Technician Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">Technician</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Completed Orders</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Avg Time (Days)</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {technicianPerformance.map((tech, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 font-medium text-gray-900">{tech.name}</td>
                  <td className="py-4 text-gray-900">{tech.completed}</td>
                  <td className="py-4 text-gray-900">{tech.avgTime}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3 max-w-24">
                        <div 
                          className={`h-2 rounded-full ${
                            tech.efficiency >= 95 ? 'bg-green-500' :
                            tech.efficiency >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${tech.efficiency}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{tech.efficiency}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
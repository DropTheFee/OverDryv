import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Clock,
  Wrench,
  Loader
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTenant } from '../../contexts/TenantContext';

interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
}

interface ServiceBreakdown {
  service: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface TopCustomer {
  name: string;
  orders: number;
  spent: number;
  vehicles: number;
}

interface TechnicianPerformance {
  name: string;
  completed: number;
  avgTime: number;
  efficiency: number;
  revenue: number;
}

const ReportsSection: React.FC = () => {
  const { organizationId } = useTenant();
  const [dateRange, setDateRange] = useState('90days');
  const [loading, setLoading] = useState(true);

  // Metrics state
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    outstanding: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    customerRetention: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    repeatCustomers: 0,
  });

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [serviceBreakdown, setServiceBreakdown] = useState<ServiceBreakdown[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [technicianPerformance, setTechnicianPerformance] = useState<TechnicianPerformance[]>([]);

  useEffect(() => {
    if (organizationId) {
      fetchAllReports();
    }
  }, [organizationId, dateRange]);

  const getDateRangeFilter = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear(), 0, 1);
        break;
      default:
        startDate.setDate(now.getDate() - 90);
    }
    
    return startDate.toISOString();
  };

  const fetchAllReports = async () => {
    if (!organizationId) return;
    
    setLoading(true);
    try {
      const startDate = getDateRangeFilter();
      
      await Promise.all([
        fetchRevenueMetrics(startDate),
        fetchWorkOrderStats(startDate),
        fetchCustomerMetrics(startDate),
        fetchServiceBreakdown(startDate),
        fetchTopCustomers(startDate),
        fetchTechnicianPerformance(startDate),
      ]);
    } catch (error) {
      console.error('[Reports] Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueMetrics = async (startDate: string) => {
    try {
      // Total Revenue and Outstanding
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('total_amount, amount_due, status, invoice_date')
        .eq('organization_id', organizationId)
        .gte('invoice_date', startDate);

      if (error) throw error;

      const totalRevenue = invoices
        ?.filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0) || 0;

      const outstanding = invoices
        ?.filter(inv => inv.status !== 'paid')
        .reduce((sum, inv) => sum + (Number(inv.amount_due) || 0), 0) || 0;

      const paidInvoices = invoices?.filter(inv => inv.status === 'paid') || [];
      const averageInvoiceValue = paidInvoices.length > 0
        ? totalRevenue / paidInvoices.length
        : 0;

      // Monthly revenue trend
      const monthlyRevenue = new Map<string, { revenue: number; orders: number }>();
      
      paidInvoices.forEach(invoice => {
        const date = new Date(invoice.invoice_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyRevenue.has(monthKey)) {
          monthlyRevenue.set(monthKey, { revenue: 0, orders: 0 });
        }
        
        const current = monthlyRevenue.get(monthKey)!;
        current.revenue += Number(invoice.total_amount) || 0;
        current.orders += 1;
      });

      const revenueArray: RevenueData[] = Array.from(monthlyRevenue.entries())
        .map(([month, data]) => ({
          period: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: data.revenue,
          orders: data.orders,
        }))
        .sort((a, b) => a.period.localeCompare(b.period))
        .slice(-6); // Last 6 periods

      setRevenueData(revenueArray);
      setMetrics(prev => ({
        ...prev,
        totalRevenue,
        outstanding,
        averageOrderValue: averageInvoiceValue,
      }));
    } catch (error) {
      console.error('[Reports] Error fetching revenue metrics:', error);
    }
  };

  const fetchWorkOrderStats = async (startDate: string) => {
    try {
      const { data: workOrders, error } = await supabase
        .from('work_orders')
        .select('id, status, service_type, priority, created_at, updated_at, actual_completion, total_amount')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate);

      if (error) throw error;

      const totalOrders = workOrders?.length || 0;
      const completedOrders = workOrders?.filter(wo => wo.status === 'completed') || [];
      
      // Calculate average completion time for completed orders
      let totalCompletionDays = 0;
      completedOrders.forEach(wo => {
        const completionDate = wo.actual_completion ? new Date(wo.actual_completion) : new Date(wo.updated_at);
        const createdDate = new Date(wo.created_at);
        const daysDiff = (completionDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        totalCompletionDays += daysDiff;
      });

      const averageCompletionTime = completedOrders.length > 0
        ? totalCompletionDays / completedOrders.length
        : 0;

      const completionRate = totalOrders > 0
        ? (completedOrders.length / totalOrders) * 100
        : 0;

      setMetrics(prev => ({
        ...prev,
        totalOrders,
        completionRate,
        averageCompletionTime,
      }));
    } catch (error) {
      console.error('[Reports] Error fetching work order stats:', error);
    }
  };

  const fetchCustomerMetrics = async (startDate: string) => {
    try {
      // Total customers
      const { data: allCustomers, error: customersError } = await supabase
        .from('profiles')
        .select('id, created_at')
        .eq('organization_id', organizationId)
        .eq('role', 'customer');

      if (customersError) throw customersError;

      const totalCustomers = allCustomers?.length || 0;

      // New customers this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const newCustomersThisMonth = allCustomers?.filter(
        c => new Date(c.created_at) >= new Date(firstDayOfMonth)
      ).length || 0;

      // Repeat customers (customers with more than 1 work order)
      const { data: workOrderCounts, error: woError } = await supabase
        .from('work_orders')
        .select('customer_id')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate);

      if (woError) throw woError;

      const customerOrderCounts = new Map<string, number>();
      workOrderCounts?.forEach(wo => {
        customerOrderCounts.set(wo.customer_id, (customerOrderCounts.get(wo.customer_id) || 0) + 1);
      });

      const repeatCustomers = Array.from(customerOrderCounts.values()).filter(count => count > 1).length;
      const customerRetention = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

      setMetrics(prev => ({
        ...prev,
        totalCustomers,
        newCustomersThisMonth,
        repeatCustomers,
        customerRetention,
      }));
    } catch (error) {
      console.error('[Reports] Error fetching customer metrics:', error);
    }
  };

  const fetchServiceBreakdown = async (startDate: string) => {
    try {
      const { data: serviceItems, error } = await supabase
        .from('service_items')
        .select('description, total_price, item_type')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate);

      if (error) throw error;

      // Group by description
      const serviceMap = new Map<string, { count: number; revenue: number }>();
      
      serviceItems?.forEach(item => {
        const desc = item.description || 'Other';
        if (!serviceMap.has(desc)) {
          serviceMap.set(desc, { count: 0, revenue: 0 });
        }
        const current = serviceMap.get(desc)!;
        current.count += 1;
        current.revenue += Number(item.total_price) || 0;
      });

      const totalRevenue = Array.from(serviceMap.values()).reduce((sum, s) => sum + s.revenue, 0);

      const breakdown: ServiceBreakdown[] = Array.from(serviceMap.entries())
        .map(([service, data]) => ({
          service,
          count: data.count,
          revenue: data.revenue,
          percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5); // Top 5 services

      setServiceBreakdown(breakdown);
    } catch (error) {
      console.error('[Reports] Error fetching service breakdown:', error);
    }
  };

  const fetchTopCustomers = async (startDate: string) => {
    try {
      const { data: workOrders, error: woError } = await supabase
        .from('work_orders')
        .select('customer_id, total_amount, vehicle_id')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate);

      if (woError) throw woError;

      // Group by customer
      const customerMap = new Map<string, { orders: number; spent: number; vehicles: Set<string> }>();
      
      workOrders?.forEach(wo => {
        if (!customerMap.has(wo.customer_id)) {
          customerMap.set(wo.customer_id, { orders: 0, spent: 0, vehicles: new Set() });
        }
        const current = customerMap.get(wo.customer_id)!;
        current.orders += 1;
        current.spent += Number(wo.total_amount) || 0;
        if (wo.vehicle_id) current.vehicles.add(wo.vehicle_id);
      });

      // Get customer names
      const customerIds = Array.from(customerMap.keys());
      const { data: customers, error: custError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', customerIds);

      if (custError) throw custError;

      const topCust: TopCustomer[] = customerIds
        .map(customerId => {
          const customer = customers?.find(c => c.id === customerId);
          const data = customerMap.get(customerId)!;
          return {
            name: customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown',
            orders: data.orders,
            spent: data.spent,
            vehicles: data.vehicles.size,
          };
        })
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5); // Top 5 customers

      setTopCustomers(topCust);
    } catch (error) {
      console.error('[Reports] Error fetching top customers:', error);
    }
  };

  const fetchTechnicianPerformance = async (startDate: string) => {
    try {
      const { data: workOrders, error: woError } = await supabase
        .from('work_orders')
        .select('technician_id, status, created_at, updated_at, actual_completion, total_amount')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate)
        .not('technician_id', 'is', null);

      if (woError) throw woError;

      // Group by technician
      const techMap = new Map<string, { 
        completed: number; 
        totalDays: number; 
        totalOrders: number;
        revenue: number;
      }>();
      
      workOrders?.forEach(wo => {
        if (!wo.technician_id) return;
        
        if (!techMap.has(wo.technician_id)) {
          techMap.set(wo.technician_id, { completed: 0, totalDays: 0, totalOrders: 0, revenue: 0 });
        }
        
        const current = techMap.get(wo.technician_id)!;
        current.totalOrders += 1;
        current.revenue += Number(wo.total_amount) || 0;
        
        if (wo.status === 'completed') {
          current.completed += 1;
          const completionDate = wo.actual_completion ? new Date(wo.actual_completion) : new Date(wo.updated_at);
          const createdDate = new Date(wo.created_at);
          const daysDiff = (completionDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
          current.totalDays += daysDiff;
        }
      });

      // Get technician names
      const techIds = Array.from(techMap.keys());
      const { data: technicians, error: techError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', techIds);

      if (techError) throw techError;

      const performance: TechnicianPerformance[] = techIds
        .map(techId => {
          const tech = technicians?.find(t => t.id === techId);
          const data = techMap.get(techId)!;
          const avgTime = data.completed > 0 ? data.totalDays / data.completed : 0;
          const efficiency = data.totalOrders > 0 ? (data.completed / data.totalOrders) * 100 : 0;
          
          return {
            name: tech ? `${tech.first_name} ${tech.last_name}` : 'Unknown',
            completed: data.completed,
            avgTime: Math.round(avgTime * 10) / 10,
            efficiency: Math.round(efficiency),
            revenue: data.revenue,
          };
        })
        .sort((a, b) => b.completed - a.completed);

      setTechnicianPerformance(performance);
    } catch (error) {
      console.error('[Reports] Error fetching technician performance:', error);
    }
  };

  const handleExport = () => {
    const csvRows = [
      ['Business Report', `Date Range: ${dateRange}`],
      [],
      ['Key Metrics'],
      ['Total Revenue', `$${metrics.totalRevenue.toFixed(2)}`],
      ['Outstanding', `$${metrics.outstanding.toFixed(2)}`],
      ['Total Work Orders', metrics.totalOrders],
      ['Average Order Value', `$${metrics.averageOrderValue.toFixed(2)}`],
      ['Customer Retention', `${metrics.customerRetention.toFixed(1)}%`],
      ['Completion Rate', `${metrics.completionRate.toFixed(1)}%`],
      ['Average Completion Time', `${metrics.averageCompletionTime.toFixed(1)} days`],
      [],
      ['Revenue Trends'],
      ['Period', 'Revenue', 'Orders'],
      ...revenueData.map(d => [d.period, `$${d.revenue.toFixed(2)}`, d.orders]),
      [],
      ['Service Breakdown'],
      ['Service', 'Count', 'Revenue'],
      ...serviceBreakdown.map(s => [s.service, s.count, `$${s.revenue.toFixed(2)}`]),
      [],
      ['Top Customers'],
      ['Name', 'Orders', 'Spent', 'Vehicles'],
      ...topCustomers.map(c => [c.name, c.orders, `$${c.spent.toFixed(2)}`, c.vehicles]),
      [],
      ['Technician Performance'],
      ['Name', 'Completed', 'Avg Time (Days)', 'Efficiency', 'Revenue'],
      ...technicianPerformance.map(t => [t.name, t.completed, t.avgTime, `${t.efficiency}%`, `$${t.revenue.toFixed(2)}`]),
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading organization data...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-green-600 animate-spin" />
        <p className="ml-3 text-gray-600">Loading reports...</p>
      </div>
    );
  }

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
            onClick={handleExport}
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
              <p className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
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
              <p className="text-2xl font-bold text-gray-900">${metrics.averageOrderValue.toFixed(0)}</p>
              <p className="text-gray-600 text-sm">Avg Order Value</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.customerRetention.toFixed(0)}%</p>
              <p className="text-gray-600 text-sm">Retention Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.completionRate.toFixed(0)}%</p>
              <p className="text-gray-600 text-sm">Completion Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.averageCompletionTime.toFixed(1)}d</p>
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
        
        {revenueData.length > 0 ? (
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
                  <p className="font-semibold text-gray-900">${data.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-gray-500">{data.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No revenue data available for this period</p>
        )}
      </div>

      {/* Service Breakdown and Top Customers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Breakdown</h3>
          {serviceBreakdown.length > 0 ? (
            <div className="space-y-4">
              {serviceBreakdown.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{service.service}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">${service.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
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
          ) : (
            <p className="text-center text-gray-500 py-8">No service data available</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Customers</h3>
          {topCustomers.length > 0 ? (
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
                    <p className="font-semibold text-gray-900">${customer.spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-gray-500">{customer.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No customer data available</p>
          )}
        </div>
      </div>

      {/* Technician Performance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Technician Performance</h3>
        {technicianPerformance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Technician</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Completed Orders</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Avg Time (Days)</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Revenue</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {technicianPerformance.map((tech, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 font-medium text-gray-900">{tech.name}</td>
                    <td className="py-4 text-gray-900">{tech.completed}</td>
                    <td className="py-4 text-gray-900">{tech.avgTime}</td>
                    <td className="py-4 text-gray-900">${tech.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
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
        ) : (
          <p className="text-center text-gray-500 py-8">No technician data available</p>
        )}
      </div>
    </div>
  );
};

export default ReportsSection;
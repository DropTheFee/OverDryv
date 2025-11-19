import React, { useState } from 'react';
import { Calendar, DollarSign, FileText, Eye } from 'lucide-react';

const ServiceHistory: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  // Mock data
  const serviceHistory = [
    {
      id: 'WO-098',
      date: '2024-12-10',
      service: 'Brake Pad Replacement',
      vehicle: '2022 Toyota Camry',
      amount: 285.50,
      status: 'completed',
      technician: 'Sarah Davis',
      mileage: 45200,
    },
    {
      id: 'WO-087',
      date: '2024-09-15',
      service: 'Oil Change & Filter',
      vehicle: '2022 Toyota Camry',
      amount: 45.99,
      status: 'completed',
      technician: 'Mike Johnson',
      mileage: 42800,
    },
    {
      id: 'WO-074',
      date: '2024-06-20',
      service: 'Annual Inspection',
      vehicle: '2022 Toyota Camry',
      amount: 89.99,
      status: 'completed',
      technician: 'Tom Wilson',
      mileage: 40100,
    },
    {
      id: 'WO-061',
      date: '2024-03-12',
      service: 'Tire Rotation & Balance',
      vehicle: '2022 Toyota Camry',
      amount: 65.00,
      status: 'completed',
      technician: 'Sarah Davis',
      mileage: 37500,
    },
  ];

  const years = ['2024', '2023', '2022'];
  const totalSpent = serviceHistory.reduce((sum, service) => sum + service.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service History</h1>
          <p className="text-gray-600">Complete record of all vehicle services</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{serviceHistory.length}</p>
              <p className="text-gray-600">Services in {selectedYear}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
              <p className="text-gray-600">Total spent</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {serviceHistory[0] ? Math.round((Date.now() - new Date(serviceHistory[0].date).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </p>
              <p className="text-gray-600">Days since last service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service History Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Service Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date / Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceHistory.map(service => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">{service.service}</p>
                      <p className="text-sm text-gray-500">{new Date(service.date).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {service.technician}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {service.mileage.toLocaleString()} mi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    ${service.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => alert(`Service details for ${service.service} on ${new Date(service.date).toLocaleDateString()}`)}
                      className="text-blue-600 hover:text-blue-900 flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
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

export default ServiceHistory;
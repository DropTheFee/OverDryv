import React from 'react';
import { Clock, CheckCircle, AlertCircle, Camera } from 'lucide-react';

const VehicleStatus: React.FC = () => {
  // Mock data
  const workOrders = [
    {
      id: 'WO-001',
      vehicle: '2022 Toyota Camry',
      service: 'Oil Change & Inspection',
      status: 'in_progress',
      createdAt: '2025-01-15 08:30',
      estimatedCompletion: '2025-01-15 14:00',
      progress: 65,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'in_progress': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'quality_check': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Status</h1>
        <p className="text-gray-600">Track your vehicle's service progress in real-time</p>
      </div>

      {workOrders.length > 0 ? (
        <div className="space-y-6">
          {workOrders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{order.service}</h2>
                    <p className="text-gray-600">{order.vehicle}</p>
                    <p className="text-sm text-gray-500">Work Order: {order.id}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{order.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Started: {new Date(order.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Est. Completion: {new Date(order.estimatedCompletion).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Photos Section */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    Service Photos
                  </h3>
                  <span className="text-sm text-gray-500">2 photos</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <img
                    src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Before service"
                    onClick={() => window.open('https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg', '_blank')}
                    className="w-full h-24 object-cover rounded border hover:opacity-90 transition-opacity cursor-pointer"
                  />
                  <img
                    src="https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="During service"
                    onClick={() => window.open('https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg', '_blank')}
                    className="w-full h-24 object-cover rounded border hover:opacity-90 transition-opacity cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Services</h3>
          <p className="text-gray-500">You don't have any vehicles currently being serviced.</p>
        </div>
      )}
    </div>
  );
};

export default VehicleStatus;
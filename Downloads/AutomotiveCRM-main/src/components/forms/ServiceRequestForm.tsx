import React, { useState } from 'react';
import { Wrench, AlertTriangle, Calendar } from 'lucide-react';

interface ServiceRequestFormProps {
  onComplete: (data: any) => void;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    urgency: 'normal',
    preferredDate: '',
    symptoms: [],
    lastService: '',
  });

  const serviceTypes = [
    'Oil Change',
    'Brake Service',
    'Engine Diagnostics',
    'Tire Service',
    'Transmission Service',
    'Air Conditioning',
    'Battery & Electrical',
    'General Inspection',
    'Other',
  ];

  const symptoms = [
    'Strange noises',
    'Warning lights',
    'Poor performance',
    'Fluid leaks',
    'Vibration',
    'Overheating',
    'Starting issues',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const toggleSymptom = (symptom: string) => {
    const current = formData.symptoms;
    const updated = current.includes(symptom)
      ? current.filter(s => s !== symptom)
      : [...current, symptom];
    setFormData({ ...formData, symptoms: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center mb-4">
          <Wrench className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Service Request Details</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Service Needed
            </label>
            <select
              required
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a service</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the Issue or Service Needed
            </label>
            <textarea
              required
              rows={4}
              placeholder="Please describe what you've noticed or what service you need..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Any of these symptoms? (Check all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {symptoms.map(symptom => (
                <label key={symptom} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.symptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Urgency Level
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low - Can wait</option>
                <option value="normal">Normal - Within a few days</option>
                <option value="high">High - ASAP</option>
                <option value="urgent">Urgent - Not safe to drive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Preferred Completion Date
              </label>
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When was your last service? (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., 3 months ago, 5,000 miles ago"
              value={formData.lastService}
              onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors transform hover:scale-[1.02] shadow-lg"
      >
        Continue to Photo Upload
      </button>
    </form>
  );
};

export default ServiceRequestForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Car, FileText, Signature } from 'lucide-react';
import VehicleInfoForm from '../components/forms/VehicleInfoForm';
import ServiceRequestForm from '../components/forms/ServiceRequestForm';
import PhotoUploadSection from '../components/forms/PhotoUploadSection';
import DigitalWaiver from '../components/forms/DigitalWaiver';

const CheckInPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicle: {},
    customer: {},
    service: {},
    photos: [],
    waiver: null,
  });
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Vehicle Information', icon: Car },
    { number: 2, title: 'Service Request', icon: FileText },
    { number: 3, title: 'Photo Upload', icon: Camera },
    { number: 4, title: 'Digital Waiver', icon: Signature },
  ];

  const handleStepComplete = (stepData: any) => {
    setFormData({ ...formData, ...stepData });
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit complete form
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    // In a real app, this would submit to the backend
    console.log('Final form data:', formData);
    alert('Check-in completed successfully! You will receive updates via email and SMS.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vehicle Check-In</h1>
          <p className="text-lg text-gray-600">Experience our streamlined digital check-in process - fast, secure, and transparent</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                {step.number < steps.length && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {currentStep === 1 && (
            <VehicleInfoForm onComplete={(data) => handleStepComplete({ vehicle: data, customer: data })} />
          )}
          {currentStep === 2 && (
            <ServiceRequestForm onComplete={(data) => handleStepComplete({ service: data })} />
          )}
          {currentStep === 3 && (
            <PhotoUploadSection onComplete={(data) => handleStepComplete({ photos: data })} />
          )}
          {currentStep === 4 && (
            <DigitalWaiver onComplete={(data) => handleStepComplete({ waiver: data })} />
          )}

          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Previous Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
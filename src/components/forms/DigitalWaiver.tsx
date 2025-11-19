import React, { useState, useRef } from 'react';
import { Signature, Check } from 'lucide-react';

interface DigitalWaiverProps {
  onComplete: (data: any) => void;
}

const DigitalWaiver: React.FC<DigitalWaiverProps> = ({ onComplete }) => {
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const waiverText = `
I hereby authorize AutoShop CRM to perform the requested services on my vehicle. I understand that:

1. I am responsible for any costs incurred for the diagnosis and repair of my vehicle.
2. All work performed is guaranteed for 90 days or 3,000 miles, whichever comes first.
3. The shop is not responsible for items left in the vehicle.
4. I authorize the shop to road test my vehicle if necessary.
5. I understand that additional repairs may be discovered during service.

By signing below, I acknowledge that I have read and agree to these terms.
  `;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignature(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !signature) {
      alert('Please agree to the terms and provide your signature.');
      return;
    }
    
    onComplete({
      agreed,
      signature,
      signedAt: new Date().toISOString(),
      ipAddress: '127.0.0.1', // In production, get real IP
      waiverText,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center mb-4">
          <Signature className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Service Authorization & Waiver</h3>
        </div>

        {/* Waiver Text */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Terms and Conditions</h4>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {waiverText}
          </div>
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-start space-x-3 mb-6">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">
            I have read and agree to the terms and conditions above
          </span>
        </label>

        {/* Signature Pad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Digital Signature
          </label>
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className="w-full border border-gray-200 rounded cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ touchAction: 'none' }}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">Sign above with your finger or mouse</p>
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!agreed || !signature}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
      >
        <Check className="w-5 h-5 mr-2" />
        Complete Check-In
      </button>
    </form>
  );
};

export default DigitalWaiver;
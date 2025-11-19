import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToasterProps {
  toasts?: Toast[];
}

export const Toaster: React.FC<ToasterProps> = ({ toasts: initialToasts = [] }) => {
  const [toasts, setToasts] = useState<Toast[]>(initialToasts);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration !== 0) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts]);

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
    }
  };

  const getToastColors = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => {
        const Icon = getToastIcon(toast.type);
        const colors = getToastColors(toast.type);
        
        return (
          <div
            key={toast.id}
            className={`max-w-sm border rounded-lg p-4 shadow-lg ${colors} transform transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-start">
              <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{toast.title}</p>
                {toast.message && (
                  <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Toast utility functions for easy use throughout the app
export const createToast = (
  type: Toast['type'],
  title: string,
  message?: string,
  duration?: number
): Toast => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  type,
  title,
  message,
  duration,
});

export const showSuccessToast = (title: string, message?: string) => 
  createToast('success', title, message);

export const showErrorToast = (title: string, message?: string) => 
  createToast('error', title, message);

export const showWarningToast = (title: string, message?: string) => 
  createToast('warning', title, message);

export const showInfoToast = (title: string, message?: string) => 
  createToast('info', title, message);
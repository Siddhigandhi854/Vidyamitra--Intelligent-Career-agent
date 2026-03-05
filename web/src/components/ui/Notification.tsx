import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border transform transition-all duration-300 ${getStyles()}`}>
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 mr-4">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

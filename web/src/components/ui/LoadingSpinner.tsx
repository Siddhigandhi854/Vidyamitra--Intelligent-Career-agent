import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-2">
        <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
        {text && (
          <span className="text-sm text-gray-600 animate-pulse">{text}</span>
        )}
      </div>
    </div>
  );
};

export const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading VidyāMitra...</p>
    </div>
    
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `
    }} />
  </div>
);

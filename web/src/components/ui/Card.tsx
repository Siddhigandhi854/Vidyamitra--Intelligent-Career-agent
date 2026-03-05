import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  glass = false 
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
  
  const hoverStyles = hover ? 'hover:shadow-2xl hover:scale-105 transform' : '';
  const glassStyles = glass 
    ? 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl' 
    : 'bg-white shadow-lg';
  
  return (
    <div className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 pb-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h2 className={`text-2xl font-bold text-gray-900 mb-2 ${className}`}>
    {children}
  </h2>
);

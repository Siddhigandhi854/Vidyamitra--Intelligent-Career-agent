import React from 'react';
import { Eye, EyeOff, Mail, Lock, User, Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: 'email' | 'password' | 'user' | 'search';
  loading?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  loading = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const getIcon = () => {
    switch (icon) {
      case 'email':
        return <Mail className="w-5 h-5 text-gray-400" />;
      case 'password':
        return showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />;
      case 'user':
        return <User className="w-5 h-5 text-gray-400" />;
      case 'search':
        return <Search className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const togglePassword = () => {
    if (props.type === 'password') {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {getIcon()}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 border-2 border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 text-gray-900 placeholder-gray-500
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${isFocused ? 'shadow-lg' : 'shadow-sm'}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
          type={props.type === 'password' && showPassword ? 'text' : props.type}
        />
        {props.type === 'password' && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

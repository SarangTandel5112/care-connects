import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'contained';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean; // Alias for isLoading
  loadingContent?: string; // Custom loading text
  ariaLabel?: string;
  icon?: React.ReactNode; // Support icon prop
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loading = false,
  loadingContent,
  disabled,
  className,
  ariaLabel,
  icon,
  ...props
}) => {
  const loadingState = isLoading || loading;

  const baseClasses =
    'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    contained: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500', // Same as primary
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={loadingState || disabled}
      aria-label={ariaLabel}
      aria-busy={loadingState}
      aria-disabled={loadingState || disabled}
      {...props}
    >
      {loadingState ? (
        <>
          <div
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span>{loadingContent || 'Loading...'}</span>
          <span className="sr-only">Please wait</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

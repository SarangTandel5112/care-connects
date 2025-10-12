import React from 'react';

interface PlusIconProps {
  className?: string;
  size?: number;
}

export const PlusIcon: React.FC<PlusIconProps> = ({ className = 'h-5 w-5', size = 20 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
};

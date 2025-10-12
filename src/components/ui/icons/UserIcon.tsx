/**
 * User Icon Component
 * User/person icon for empty states
 */

import React from 'react';

interface UserIconProps {
  className?: string;
  size?: number;
}

export const UserIcon: React.FC<UserIconProps> = ({
  className = 'h-12 w-12 text-gray-400',
  size = 48,
}) => {
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
};

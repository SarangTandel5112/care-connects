import React from 'react';

interface SearchIconProps {
  className?: string;
  size?: number;
}

export const SearchIcon: React.FC<SearchIconProps> = ({
  className = 'h-5 w-5 text-gray-400',
  size = 20,
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
};

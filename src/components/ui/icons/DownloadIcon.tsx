/**
 * Download Icon Component
 * Download icon for actions
 */

import React from 'react';

interface DownloadIconProps {
  className?: string;
  size?: number;
}

export const DownloadIcon: React.FC<DownloadIconProps> = ({ className = 'h-4 w-4', size = 16 }) => {
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
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
};

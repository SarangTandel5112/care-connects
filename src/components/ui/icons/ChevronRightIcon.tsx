/**
 * ChevronRightIcon Component
 * Right-pointing chevron arrow icon
 */

import React from 'react';

interface ChevronRightIconProps {
  className?: string;
}

export const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
};

export default ChevronRightIcon;

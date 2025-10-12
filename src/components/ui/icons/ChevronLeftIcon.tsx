/**
 * ChevronLeftIcon Component
 * Left-pointing chevron arrow icon
 */

import React from 'react';

interface ChevronLeftIconProps {
  className?: string;
}

export const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
};

export default ChevronLeftIcon;

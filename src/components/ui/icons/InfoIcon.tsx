/**
 * InfoIcon Component
 * Information circle icon
 */

import React from 'react';

interface InfoIconProps {
  className?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.708-2.5M15 6.708A7.962 7.962 0 0012 5c-2.34 0-4.29 1.007-5.708 2.5"
      />
    </svg>
  );
};

export default InfoIcon;

import React from 'react';

interface StethoscopeIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const StethoscopeIcon: React.FC<StethoscopeIconProps> = ({
  className = 'h-4 w-4',
  size = 16,
  ...props
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
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

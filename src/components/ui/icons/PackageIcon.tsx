import React from 'react';

interface PackageIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const PackageIcon: React.FC<PackageIconProps> = ({
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
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
};

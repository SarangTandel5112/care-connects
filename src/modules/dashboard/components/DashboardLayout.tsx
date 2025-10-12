/**
 * Dashboard Layout Component
 * Implements 8-4 grid layout with left side having 30-70% height split
 * Following Single Responsibility Principle - Only handles layout structure
 */

import React from 'react';

interface DashboardLayoutProps {
  leftTop: React.ReactNode;
  leftBottom: React.ReactNode;
  right: React.ReactNode;
}

/**
 * Main dashboard layout component
 * @param leftTop - Content for top 30% of left container
 * @param leftBottom - Content for bottom 70% of left container
 * @param right - Content for right container (4 columns)
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ leftTop, leftBottom, right }) => {
  return (
    <div className="h-auto w-full overflow-auto lg:h-[calc(100vh-61px-48px)] lg:overflow-hidden">
      {/* Main Grid: 8-4 columns (left-right) */}
      <div className="grid h-auto grid-cols-1 gap-4 p-1 lg:h-full lg:grid-cols-12">
        {/* Left Container (8 columns) */}
        <div className="flex h-auto flex-col gap-4 lg:h-full lg:col-span-7">
          {/* Top Section (30% height) */}
          <div className="min-h-[200px] w-full overflow-hidden rounded-lg bg-white shadow-sm lg:h-[30%] lg:min-h-0">
            {leftTop}
          </div>

          {/* Bottom Section (70% height) */}
          <div className="min-h-[400px] w-full overflow-hidden rounded-lg bg-white shadow-sm lg:h-[70%] lg:min-h-0 flex flex-col">
            {leftBottom}
          </div>
        </div>

        {/* Right Container (4 columns) */}
        <div className="min-h-[600px] overflow-hidden rounded-lg bg-white shadow-sm lg:h-full lg:min-h-0 lg:col-span-5">
          {right}
        </div>
      </div>
    </div>
  );
};

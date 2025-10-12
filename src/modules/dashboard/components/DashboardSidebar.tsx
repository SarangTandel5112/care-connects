/**
 * Dashboard Sidebar Component (Right - 4 columns)
 * Displays appointment calendar with timeline
 * Professional medical application design migrated from old project
 * Following Single Responsibility Principle
 */

import React from 'react';
import { AppointmentCalendar } from './AppointmentCalendar';

interface DashboardSidebarProps {
  className?: string;
}

/**
 * Right sidebar of dashboard (4 columns)
 * Contains appointment calendar with date selector, status tabs, and timeline
 */
export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className = '' }) => {
  return (
    <div className={`h-full w-full p-4 ${className}`}>
      <AppointmentCalendar />
    </div>
  );
};

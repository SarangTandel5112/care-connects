'use client';

/**
 * Dashboard Page
 * Main dashboard view with 8-4 grid layout
 * Left: 30-70% height split | Right: Sidebar
 */

import {
  DashboardLayout,
  ClinicInfoCard,
  PatientTableAntd,
  DashboardSidebar,
} from '@/modules/dashboard/components';

export default function DashboardPage() {
  return (
    <DashboardLayout
      leftTop={<ClinicInfoCard />}
      leftBottom={<PatientTableAntd />}
      right={<DashboardSidebar />}
    />
  );
}

'use client';

import { useCurrentUserData } from '@/hooks';
import { Card, LoadingSpinner } from '@/components/ui';

export default function DashboardPage() {
  const user = useCurrentUserData();
  const isLoading = false; // React Query handles loading states

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-secondary-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Welcome Back!</h3>
          <p className="text-secondary-600">{user?.name || 'User'}</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Patients</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Appointments Today</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </Card>
      </div>
    </div>
  );
}

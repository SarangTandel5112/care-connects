'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';
import { useIsAuthenticated, useCurrentUser } from '@/hooks';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* TODO: Add Sidebar and Header components here */}
      <main>{children}</main>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';
import { useIsAuthenticated, useCurrentUser } from '@/hooks';
import { Sidebar, Header } from '@/components/layout';

/**
 * Protected Layout
 * Wrapper for all authenticated pages with sidebar and header navigation
 * Following Single Responsibility Principle - handles authentication check and layout structure
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  // Only fetch user data if authenticated to avoid unnecessary API calls
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    // Add a small delay to prevent immediate redirects during token validation
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Show loading only if we're actually loading user data
  if (isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show loading while redirect happens
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden ml-0 md:ml-16">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

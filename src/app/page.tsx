'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';
import { tokenStorage } from '@/utils/token';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Simple token check without triggering API calls
    const hasValidToken = tokenStorage.isTokenValid();
    router.push(hasValidToken ? '/dashboard' : '/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

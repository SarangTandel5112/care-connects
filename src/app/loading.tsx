'use client';

import { Card } from '@/components/ui';

interface LoadingProps {
  message?: string;
}

// Next.js 13+ Loading Component
export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
            <p className="text-gray-600">Please wait while we load your content...</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

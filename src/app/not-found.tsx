'use client';

import { useEffect } from 'react';
import { Button, Card } from '@/components/ui';

interface NotFoundProps {
  // Next.js automatically provides these props for 404 pages
}

// Next.js 13+ Not Found Page
export default function NotFound({}: NotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.708-2.5M15 6.708A7.962 7.962 0 0012 5c-2.34 0-4.29 1.007-5.708 2.5"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="flex gap-3 justify-center">
              <Button variant="primary" onClick={() => window.history.back()} className="px-6">
                Go Back
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/')}
                className="px-6"
              >
                Go Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

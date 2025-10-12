'use client';

import { Button, Card } from '@/components/ui';
import { InfoIcon } from '@/components/ui/icons';

// Next.js 13+ Not Found Page
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <InfoIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-6">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
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

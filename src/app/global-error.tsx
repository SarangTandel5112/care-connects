'use client';

import { useEffect } from 'react';
import { Button, Card } from '@/components/ui';
import { WarningIcon } from '@/components/ui/icons';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Next.js 13+ Global Error Handler
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);

    // You can send to error reporting service here
    // logErrorToService(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <Card>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <WarningIcon className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Error</h2>
                <p className="text-gray-600 mb-6">
                  Something went wrong with the application. Please try again.
                </p>

                {process.env.NODE_ENV === 'development' && (
                  <details className="mb-6 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                      Error Details (Development)
                    </summary>
                    <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-auto">
                      <div className="mb-2">
                        <strong>Error:</strong> {error.message}
                      </div>
                      {error.digest && (
                        <div className="mb-2">
                          <strong>Digest:</strong> {error.digest}
                        </div>
                      )}
                      {error.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                <div className="flex gap-3 justify-center">
                  <Button variant="primary" onClick={reset} className="px-6">
                    Try Again
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
      </body>
    </html>
  );
}

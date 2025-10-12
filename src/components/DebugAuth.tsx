'use client';

import { useCombinedStore } from '@/hooks/useStore';
import { tokenStorage } from '@/utils/token';

/**
 * Debug component to display authentication state
 * Use this temporarily to debug Redux and localStorage sync issues
 */
//TODO: remove this ?

export const DebugAuth = () => {
  const { user, isAuthenticated, isLoading, allErrors } = useCombinedStore();
  const tokens = tokenStorage.getTokens();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs font-mono z-50">
      <h3 className="font-bold mb-2 text-sm">🐛 Auth Debug Info</h3>

      <div className="space-y-2">
        <div>
          <strong>Redux State:</strong>
          <pre className="bg-gray-800 p-2 rounded mt-1 overflow-auto max-h-32">
            {JSON.stringify(
              {
                isAuthenticated,
                isLoading,
                user: user
                  ? {
                      id: user.id,
                      email: user.email,
                      name: user.name,
                      role: user.role,
                    }
                  : null,
                errors: allErrors,
              },
              null,
              2
            )}
          </pre>
        </div>

        <div>
          <strong>LocalStorage:</strong>
          <pre className="bg-gray-800 p-2 rounded mt-1 overflow-auto max-h-32">
            {JSON.stringify(
              {
                hasAccessToken: !!tokens?.accessToken,
                hasRefreshToken: !!tokens?.refreshToken,
                expiresIn: tokens?.expiresIn,
                isValid: tokenStorage.isTokenValid(),
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>

      <button
        onClick={() => {
          console.log('🔍 Full Debug Info:', {
            redux: { user, isAuthenticated, isLoading, allErrors },
            localStorage: tokens,
            rawLocalStorage: {
              access_token: localStorage.getItem('access_token'),
              refresh_token: localStorage.getItem('refresh_token'),
              token_expiry: localStorage.getItem('token_expiry'),
            },
          });
        }}
        className="mt-2 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs w-full"
      >
        Log Full State to Console
      </button>
    </div>
  );
};

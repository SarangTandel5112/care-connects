import { useRef } from 'react';

/**
 * Hook for throttling function calls
 */
export function useThrottle<T extends (...args: never[]) => unknown>(callback: T, delay: number): T {
  const lastCall = useRef<number>(0);

  const throttledCallback = ((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }) as T;

  return throttledCallback;
}

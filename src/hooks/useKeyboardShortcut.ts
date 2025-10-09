import { useEffect } from 'react';

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options?: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  }
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === key &&
        (!options?.ctrlKey || event.ctrlKey) &&
        (!options?.shiftKey || event.shiftKey) &&
        (!options?.altKey || event.altKey) &&
        (!options?.metaKey || event.metaKey)
      ) {
        callback(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, options]);
}

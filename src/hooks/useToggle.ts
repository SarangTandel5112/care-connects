import { useState } from 'react';

/**
 * Hook for managing toggle state
 */
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue((prev) => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return [value, { toggle, setTrue, setFalse }] as const;
}

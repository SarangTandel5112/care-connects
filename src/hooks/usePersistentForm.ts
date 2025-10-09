import { useForm, FieldValues, DefaultValues } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook for managing form state with persistence
 */
export function usePersistentForm<T extends FieldValues>(
  key: string,
  defaultValues: T,
  options?: {
    storage?: 'localStorage' | 'sessionStorage';
    debounceMs?: number;
  }
) {
  const debounceMs = options?.debounceMs || 500;

  const [storedValue, setStoredValue] = useLocalStorage(key, defaultValues);
  const debouncedValue = useDebounce(storedValue, debounceMs);

  const form = useForm<T>({
    defaultValues: storedValue as DefaultValues<T>,
  });

  const { watch } = form;
  const watchedValues = watch();

  // Save form data to storage when values change
  useEffect(() => {
    setStoredValue(watchedValues);
  }, [watchedValues, setStoredValue]);

  const clearStorage = useCallback(() => {
    setStoredValue(defaultValues);
    form.reset(defaultValues);
  }, [setStoredValue, defaultValues, form]);

  return {
    ...form,
    clearStorage,
    storedValue: debouncedValue,
  };
}

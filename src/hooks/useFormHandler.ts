import { useForm, UseFormProps, FieldValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from './useDebounce';

interface UseFormHandlerOptions<T extends FieldValues> extends UseFormProps<T> {
  schema?: ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  debounceMs?: number;
}

export const useFormHandler = <T extends FieldValues>({
  schema,
  onSubmit,
  onSuccess,
  onError,
  successMessage = 'Form submitted successfully',
  errorMessage = 'Failed to submit form',
  showSuccessToast = true,
  showErrorToast = true,
  debounceMs = 0,
  ...formOptions
}: UseFormHandlerOptions<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitCount, setSubmitCount] = useState(0);

  const form = useForm<T>({
    ...formOptions,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const debouncedOnSubmit = useDebounce(async (data: T) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitCount((prev) => prev + 1);

    try {
      await onSubmit(data);

      if (showSuccessToast) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(data);
      }

      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage;
      setSubmitError(message);

      if (showErrorToast) {
        toast.error(message);
      }

      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, debounceMs);

  const handleSubmit: SubmitHandler<T> = useCallback(
    (data) => {
      if (debounceMs > 0) {
        debouncedOnSubmit(data);
      } else {
        // Immediate submission
        (async () => {
          setIsSubmitting(true);
          setSubmitError(null);
          setSubmitCount((prev) => prev + 1);

          try {
            await onSubmit(data);

            if (showSuccessToast) {
              toast.success(successMessage);
            }

            if (onSuccess) {
              onSuccess(data);
            }

            form.reset();
          } catch (error) {
            const message = error instanceof Error ? error.message : errorMessage;
            setSubmitError(message);

            if (showErrorToast) {
              toast.error(message);
            }

            if (onError) {
              onError(error);
            }
          } finally {
            setIsSubmitting(false);
          }
        })();
      }
    },
    [
      onSubmit,
      onSuccess,
      onError,
      successMessage,
      errorMessage,
      showSuccessToast,
      showErrorToast,
      debounceMs,
      debouncedOnSubmit,
      form,
    ]
  );

  const clearError = useCallback(() => {
    setSubmitError(null);
  }, []);

  const resetForm = useCallback(() => {
    form.reset();
    setSubmitError(null);
    setIsSubmitting(false);
  }, [form]);

  return {
    ...form,
    isSubmitting,
    submitError,
    submitCount,
    clearError,
    resetForm,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};

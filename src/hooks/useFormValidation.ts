import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

/**
 * Hook for managing form validation with real-time feedback
 */
export function useFormValidation<T extends FieldValues>(
  schema: ZodSchema<T>,
  options?: {
    mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
    reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  }
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: options?.mode || 'onChange',
    reValidateMode: options?.reValidateMode || 'onChange',
  });

  const {
    formState: { errors, isValid, isDirty, touchedFields },
  } = form;

  const hasErrors = Object.keys(errors).length > 0;
  const hasTouchedErrors = Object.keys(touchedFields).some((field) => errors[field]);

  return {
    ...form,
    hasErrors,
    hasTouchedErrors,
    isValid,
    isDirty,
  };
}

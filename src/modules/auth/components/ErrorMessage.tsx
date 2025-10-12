/**
 * Error message component for displaying form errors
 * Following Single Responsibility Principle - only handles error display
 */

import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from '@/components/ui/icons';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <motion.div
      data-testid="error-message"
      role="alert"
      aria-live="polite"
      className={`bg-red-50 border-red-200 text-red-600 mb-6 flex items-center gap-2 rounded-lg border p-4 text-sm ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <XIcon className="h-5 w-5 flex-shrink-0" />
      <span className="sr-only">Error: </span>
      {message}
    </motion.div>
  );
};

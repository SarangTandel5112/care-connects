/**
 * Reusable Modal Component
 * Generic modal wrapper with customizable content
 * Professional medical application design
 * Following Single Responsibility Principle
 */

'use client';

import React from 'react';

interface ReusableModalProps {
  /**
   * Whether the modal is visible
   */
  show: boolean;
  /**
   * Modal close handler
   */
  onClose: () => void;
  /**
   * Modal header content
   */
  header?: React.ReactNode;
  /**
   * Modal body content
   */
  children: React.ReactNode;
  /**
   * Modal footer content
   */
  footer?: React.ReactNode;
  /**
   * Modal width classes
   */
  width?: string;
  /**
   * Whether to show close button
   */
  showCloseButton?: boolean;
  /**
   * Whether modal content is scrollable
   */
  scrollable?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Generic modal component for various use cases
 * Provides backdrop, header, body, and close functionality
 */
export const ReusableModal: React.FC<ReusableModalProps> = ({
  show,
  onClose,
  header,
  children,
  footer,
  width = 'w-[90%] max-w-3xl',
  showCloseButton = true,
  scrollable = false,
  className = '',
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex h-screen items-center justify-center p-4">
        <div
          className={`relative w-full ${width} h-[90vh] max-h-[90vh] transform overflow-hidden rounded-lg bg-white shadow-xl transition-all flex flex-col ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          {header && (
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white flex-shrink-0">
              <div className="flex-1 text-lg font-semibold text-gray-900">{header}</div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                  aria-label="Close modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body - Scrollable */}
          <div className={`bg-white flex-1 overflow-y-auto`}>{children}</div>

          {/* Footer - Fixed */}
          {footer && (
            <div className="flex-shrink-0 border-t border-gray-200 bg-white">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
};

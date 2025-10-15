/**
 * Print Service
 * Provides SSR-safe printing functionality with proper error handling
 * Follows Single Responsibility Principle - only handles printing
 */

import { generatePrintHTML, CONSULTATION_PRINT_STYLES, BASE_PRINT_STYLES } from './printStyles';

/**
 * Print options configuration
 */
export interface PrintOptions {
  /** Document title for the print window */
  title: string;
  /** Custom CSS styles (optional, defaults to base styles) */
  styles?: string;
  /** Auto-print after window opens (default: true) */
  autoPrint?: boolean;
  /** Window features string (default: '') */
  windowFeatures?: string;
}

/**
 * Print result status
 */
export interface PrintResult {
  success: boolean;
  error?: string;
}

/**
 * Print Service Class
 * Provides testable, SSR-safe printing functionality
 */
export class PrintService {
  /**
   * Check if printing is available (browser environment)
   */
  static isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.open === 'function';
  }

  /**
   * Print HTML content in a new window
   * @param content - HTML content to print
   * @param options - Print configuration options
   * @returns PrintResult indicating success or failure
   */
  static print(content: string, options: PrintOptions): PrintResult {
    // SSR safety check
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'Print functionality is not available in this environment (SSR or non-browser)',
      };
    }

    try {
      // Open new window
      const printWindow = window.open('', '_blank', options.windowFeatures || '');

      if (!printWindow) {
        return {
          success: false,
          error: 'Failed to open print window. Please check if pop-ups are blocked.',
        };
      }

      // Use provided styles or default to base styles
      const styles = options.styles || BASE_PRINT_STYLES;

      // Generate complete HTML document
      const htmlContent = generatePrintHTML(options.title, content, styles);

      // Write content to new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Auto-print if enabled (default: true)
      if (options.autoPrint !== false) {
        // Small delay to ensure content is loaded
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred while printing',
      };
    }
  }

  /**
   * Print content from a DOM element by ID
   * @param elementId - DOM element ID to print
   * @param options - Print configuration options
   * @returns PrintResult indicating success or failure
   */
  static printElement(elementId: string, options: PrintOptions): PrintResult {
    // SSR safety check
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'Print functionality is not available in this environment',
      };
    }

    try {
      const element = document.getElementById(elementId);

      if (!element) {
        return {
          success: false,
          error: `Element with ID "${elementId}" not found`,
        };
      }

      // Get element's innerHTML
      const content = element.innerHTML;

      // Use the main print method
      return this.print(content, options);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred while printing',
      };
    }
  }
}

/**
 * Consultation-specific print helper
 * Pre-configured for consultation documents
 */
export class ConsultationPrintService {
  /**
   * Print a consultation by its ID
   * @param consultationId - The consultation ID
   * @param shortId - Short version of ID for display (optional)
   * @returns PrintResult indicating success or failure
   */
  static printConsultation(consultationId: string, shortId?: string): PrintResult {
    const elementId = `consultation-${consultationId}`;
    const displayId = shortId || consultationId.slice(0, 8);

    return PrintService.printElement(elementId, {
      title: `Consultation - ${displayId}`,
      styles: CONSULTATION_PRINT_STYLES,
      autoPrint: true,
    });
  }

  /**
   * Print consultation with custom title
   * @param consultationId - The consultation ID
   * @param title - Custom document title
   * @returns PrintResult indicating success or failure
   */
  static printConsultationWithTitle(consultationId: string, title: string): PrintResult {
    const elementId = `consultation-${consultationId}`;

    return PrintService.printElement(elementId, {
      title,
      styles: CONSULTATION_PRINT_STYLES,
      autoPrint: true,
    });
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use ConsultationPrintService.printConsultation instead
 */
export function printConsultation(consultationId: string): PrintResult {
  return ConsultationPrintService.printConsultation(consultationId);
}

// Default export
export default PrintService;

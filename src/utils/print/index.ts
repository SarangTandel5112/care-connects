/**
 * Print Utilities Index
 * Central export point for all print-related functionality
 */

export {
  PrintService,
  ConsultationPrintService,
  printConsultation,
  type PrintOptions,
  type PrintResult,
} from './printService';

export {
  BASE_PRINT_STYLES,
  CONSULTATION_PRINT_STYLES,
  generatePrintHTML,
} from './printStyles';

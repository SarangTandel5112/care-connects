/**
 * Print Styles Configuration
 * Centralized print styles for consistent print output across the application
 */

/**
 * Base print styles used for all print documents
 */
export const BASE_PRINT_STYLES = `
  body {
    font-family: Arial, sans-serif;
    padding: 20px;
    margin: 0;
    color: #000;
    background: #fff;
  }

  /* Hide elements that shouldn't be printed */
  .print-hide,
  button,
  .ant-btn {
    display: none !important;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    color: #000;
    margin-top: 10px;
    margin-bottom: 8px;
  }

  p {
    margin: 5px 0;
  }

  /* Tables */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 15px 0;
    page-break-inside: avoid;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    font-size: 12px;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  /* Section Titles */
  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 10px 0;
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
    page-break-after: avoid;
  }

  /* Dividers */
  hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 15px 0;
  }

  /* Prevent page breaks inside important elements */
  .no-break {
    page-break-inside: avoid;
  }

  /* Cards and containers */
  .card,
  .container {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px 0;
    page-break-inside: avoid;
  }

  /* Print-specific layout */
  @media print {
    body {
      padding: 0;
    }

    .page-break {
      page-break-before: always;
    }
  }
`;

/**
 * Consultation-specific print styles
 */
export const CONSULTATION_PRINT_STYLES = `
  ${BASE_PRINT_STYLES}

  /* Consultation header */
  .consultation-header {
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  /* Consultation sections */
  .consultation-section {
    margin: 20px 0;
    page-break-inside: avoid;
  }

  /* Doctor info */
  .doctor-info {
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
  }

  /* Clinical notes */
  .clinical-notes {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 10px;
  }

  /* Billing section */
  .billing-summary {
    background-color: #f8f9fa;
    padding: 15px;
    border: 1px solid #ddd;
    margin-top: 20px;
  }

  .billing-total {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 2px solid #000;
  }

  /* Prescription notes */
  .prescription-notes {
    background-color: #f3e5f5;
    border: 1px solid #ba68c8;
    padding: 10px;
    margin: 10px 0;
  }

  /* Payment summary */
  .payment-summary {
    background-color: #e8f5e9;
    padding: 10px;
    margin-top: 10px;
  }
`;

/**
 * Generate complete HTML for print document
 */
export function generatePrintHTML(title: string, content: string, styles: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}

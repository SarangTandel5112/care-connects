# Print Service

A reusable, SSR-safe print service for printing HTML content in the browser.

## Features

- ✅ **SSR-Safe**: Checks for browser environment before executing
- ✅ **SOLID Principles**: Single Responsibility, Open/Closed, Dependency Inversion
- ✅ **Error Handling**: Returns success/error status instead of throwing
- ✅ **Testable**: Class-based design for easy mocking and unit testing
- ✅ **Reusable**: Pre-configured services for specific use cases
- ✅ **TypeScript**: Full type safety with interfaces

## Usage

### Basic Usage

```typescript
import { PrintService } from '@/utils/print';

// Print custom HTML content
const result = PrintService.print('<h1>Hello World</h1>', {
  title: 'My Document',
  autoPrint: true,
});

if (!result.success) {
  console.error(result.error);
}
```

### Print DOM Element

```typescript
import { PrintService } from '@/utils/print';

// Print an element by ID
const result = PrintService.printElement('my-element-id', {
  title: 'My Document',
  styles: BASE_PRINT_STYLES,
});
```

### Consultation Printing (Pre-configured)

```typescript
import { ConsultationPrintService } from '@/utils/print';

// Simple consultation print
const result = ConsultationPrintService.printConsultation(consultationId);

// With custom title
const result = ConsultationPrintService.printConsultationWithTitle(
  consultationId,
  'Patient Consultation Report'
);

// Handle errors
if (!result.success) {
  message.error(result.error);
}
```

## API Reference

### PrintService

Main service class for printing operations.

#### Methods

**`isAvailable(): boolean`**
- Checks if printing is available (browser environment)
- Returns `true` in browser, `false` in SSR

**`print(content: string, options: PrintOptions): PrintResult`**
- Prints HTML content in a new window
- Parameters:
  - `content`: HTML string to print
  - `options`: Print configuration
- Returns: `PrintResult` with success status

**`printElement(elementId: string, options: PrintOptions): PrintResult`**
- Prints a DOM element by ID
- Parameters:
  - `elementId`: ID of element to print
  - `options`: Print configuration
- Returns: `PrintResult` with success status

### ConsultationPrintService

Pre-configured service for printing consultations.

#### Methods

**`printConsultation(consultationId: string, shortId?: string): PrintResult`**
- Prints a consultation by ID
- Uses pre-configured consultation styles
- Element must have ID: `consultation-${consultationId}`

**`printConsultationWithTitle(consultationId: string, title: string): PrintResult`**
- Prints consultation with custom title

## Types

### PrintOptions

```typescript
interface PrintOptions {
  title: string;              // Document title
  styles?: string;            // Custom CSS (optional)
  autoPrint?: boolean;        // Auto-print (default: true)
  windowFeatures?: string;    // Window features (optional)
}
```

### PrintResult

```typescript
interface PrintResult {
  success: boolean;
  error?: string;
}
```

## Styles

### Pre-configured Styles

- **`BASE_PRINT_STYLES`**: Base styles for all print documents
- **`CONSULTATION_PRINT_STYLES`**: Consultation-specific styles

### Custom Styles

```typescript
import { PrintService, generatePrintHTML } from '@/utils/print';

const customStyles = `
  body { font-size: 14px; }
  h1 { color: blue; }
`;

PrintService.print(content, {
  title: 'Custom Document',
  styles: customStyles,
});
```

## Component Integration

### React Component Example

```tsx
import React from 'react';
import { Button, message } from 'antd';
import { ConsultationPrintService } from '@/utils/print';
import { PrinterOutlined } from '@ant-design/icons';

export const MyComponent: React.FC<{ consultationId: string }> = ({ consultationId }) => {
  const handlePrint = () => {
    const result = ConsultationPrintService.printConsultation(consultationId);

    if (!result.success) {
      message.error(result.error || 'Failed to print');
    }
  };

  return (
    <div>
      {/* Printable content with required ID */}
      <div id={`consultation-${consultationId}`}>
        <h1>Consultation Details</h1>
        {/* ... your content ... */}
      </div>

      {/* Print button */}
      <Button
        icon={<PrinterOutlined />}
        onClick={handlePrint}
        className="print-hide"
      >
        Print
      </Button>
    </div>
  );
};
```

## Best Practices

### 1. Hide Print Buttons in Print Output

Add `print-hide` class to elements that shouldn't appear in print:

```tsx
<Button className="print-hide" onClick={handlePrint}>
  Print
</Button>
```

### 2. Use Unique IDs for Printable Content

```tsx
<div id={`consultation-${consultationId}`}>
  {/* Content */}
</div>
```

### 3. Handle Errors Gracefully

```typescript
const result = ConsultationPrintService.printConsultation(id);

if (!result.success) {
  // Show user-friendly error message
  message.error('Unable to print. Please check if pop-ups are blocked.');
  console.error('Print error:', result.error);
}
```

### 4. SSR Safety

The service automatically checks for browser environment:

```typescript
// This is safe in SSR - returns { success: false, error: '...' }
const result = PrintService.print(content, options);
```

## Testing

### Mock Example

```typescript
import { PrintService } from '@/utils/print';

// Mock the service in tests
jest.mock('@/utils/print', () => ({
  PrintService: {
    isAvailable: jest.fn(() => true),
    print: jest.fn(() => ({ success: true })),
    printElement: jest.fn(() => ({ success: true })),
  },
  ConsultationPrintService: {
    printConsultation: jest.fn(() => ({ success: true })),
  },
}));

// Test component
it('should handle print click', () => {
  const { getByText } = render(<MyComponent consultationId="123" />);

  fireEvent.click(getByText('Print'));

  expect(ConsultationPrintService.printConsultation).toHaveBeenCalledWith('123');
});
```

## Architecture

### SOLID Principles

1. **Single Responsibility**: Each class has one reason to change
   - `PrintService`: Handles printing operations
   - `ConsultationPrintService`: Consultation-specific printing
   - `printStyles.ts`: Manages styles

2. **Open/Closed**: Extend functionality without modifying existing code
   - Create new print services by extending base service
   - Add custom styles without changing core

3. **Dependency Inversion**: Depend on abstractions
   - Uses interfaces (`PrintOptions`, `PrintResult`)
   - Injected styles, not hardcoded

### File Structure

```
src/utils/print/
├── index.ts              # Central exports
├── printService.ts       # Core print logic
├── printStyles.ts        # Style configurations
└── README.md            # This file
```

## Troubleshooting

### Print window doesn't open

**Problem**: Pop-up blocker preventing window
**Solution**: Check browser pop-up settings, use user-initiated events

### Content not loading

**Problem**: Element ID not found
**Solution**: Ensure element exists and ID matches exactly

### Styles not applying

**Problem**: Missing or incorrect styles
**Solution**: Use pre-configured styles or check custom CSS syntax

## Migration from Legacy Code

### Before (Old Implementation)

```typescript
const handlePrint = (id: string) => {
  const printWindow = window.open('', '_blank');
  const element = document.getElementById(`consultation-${id}`);

  if (printWindow && element) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Consultation</title>
          <style>/* inline styles */</style>
        </head>
        <body>${element.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};
```

### After (New Implementation)

```typescript
import { ConsultationPrintService } from '@/utils/print';
import { message } from 'antd';

const handlePrint = (id: string) => {
  const result = ConsultationPrintService.printConsultation(id);

  if (!result.success) {
    message.error(result.error);
  }
};
```

## Benefits

✅ **Less code** - 8 lines vs 18 lines
✅ **SSR-safe** - No server-side errors
✅ **Error handling** - Proper error messages
✅ **Testable** - Easy to mock and test
✅ **Reusable** - Use across multiple components
✅ **Maintainable** - Centralized styles and logic

## License

Internal use only - Care Connects Project

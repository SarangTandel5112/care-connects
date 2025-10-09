# Next.js 13+ Optimized Error Handling

This guide shows you how to handle errors more efficiently in Next.js 13+ using built-in error handling mechanisms instead of traditional React Error Boundaries.

## 🚀 **Why Next.js Error Handling is More Efficient**

### **Traditional React Error Boundaries:**

- ❌ Only catch errors in React components
- ❌ Don't handle server-side errors
- ❌ Don't handle routing errors
- ❌ Require manual setup in every component tree
- ❌ Limited error recovery options

### **Next.js 13+ Error Handling:**

- ✅ **Automatic error catching** at the framework level
- ✅ **Server-side error handling** built-in
- ✅ **Routing error handling** automatic
- ✅ **Better error recovery** with `reset()` function
- ✅ **Error boundaries** work at the route level
- ✅ **Built-in error pages** with proper HTML structure

## 📁 **Next.js Error Handling Files**

```
src/app/
├── error.tsx              # Route-level error boundary
├── global-error.tsx       # Global error boundary
├── not-found.tsx          # 404 error page
├── loading.tsx            # Loading state
└── layout.tsx             # Root layout (wraps everything)
```

## 🎯 **Error Handling Hierarchy**

```
1. global-error.tsx        # Catches ALL errors (highest level)
   ↓
2. error.tsx              # Catches errors in specific routes
   ↓
3. Component Error Boundaries # Catches errors in specific components
   ↓
4. useNextErrorHandler    # Programmatic error handling
```

## 🔧 **Implementation**

### **1. Route-Level Error Handling (`error.tsx`)**

```typescript
// src/app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**What it does:**

- ✅ Catches errors in the route and its children
- ✅ Provides `reset()` function to retry
- ✅ Automatically handles server-side errors
- ✅ Works with Suspense boundaries

### **2. Global Error Handling (`global-error.tsx`)**

```typescript
// src/app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

**What it does:**

- ✅ Catches ALL errors in the application
- ✅ Must include `<html>` and `<body>` tags
- ✅ Last resort error handling
- ✅ Handles errors in root layout

### **3. Not Found Handling (`not-found.tsx`)**

```typescript
// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
```

**What it does:**

- ✅ Automatically handles 404 errors
- ✅ Can be placed in any route segment
- ✅ Provides custom 404 pages

### **4. Loading States (`loading.tsx`)**

```typescript
// src/app/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

**What it does:**

- ✅ Automatic loading UI
- ✅ Works with Suspense boundaries
- ✅ Can be placed in any route segment

## 🎣 **Next.js Optimized Hooks**

### **1. useNextErrorHandler**

```typescript
import { useNextErrorHandler } from '@/components/ErrorBoundary';

function MyComponent() {
  const { handleError, handleAsyncError } = useNextErrorHandler();

  const handleClick = async () => {
    // Handle async operations
    const result = await handleAsyncError(
      () => fetch('/api/data').then(res => res.json()),
      {
        onSuccess: (data) => console.log('Success:', data),
        onError: (error) => console.log('Error:', error),
        showToast: true,
        redirectTo: '/error-page',
      }
    );
  };

  return <button onClick={handleClick}>Load Data</button>;
}
```

### **2. useApiErrorHandler**

```typescript
import { useApiErrorHandler } from '@/components/ErrorBoundary';

function ApiComponent() {
  const { handleApiError } = useApiErrorHandler();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/patients');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    } catch (error) {
      handleApiError(error, {
        showToast: true,
        redirectTo: '/patients',
      });
    }
  };

  return <button onClick={fetchData}>Fetch Patients</button>;
}
```

### **3. useFormErrorHandler**

```typescript
import { useFormErrorHandler } from '@/components/ErrorBoundary';

function PatientForm() {
  const { handleFormError } = useFormErrorHandler();
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (data) => {
    try {
      await createPatient(data);
    } catch (error) {
      handleFormError(error, {
        showToast: true,
        setFieldError: (field, message) => {
          setFieldErrors(prev => ({ ...prev, [field]: message }));
        },
      });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 🎯 **Usage Patterns**

### **1. Route-Level Error Handling**

```typescript
// src/app/dashboard/error.tsx
'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="dashboard-error">
      <h2>Dashboard Error</h2>
      <p>Something went wrong in the dashboard</p>
      <button onClick={reset}>Retry Dashboard</button>
    </div>
  );
}
```

### **2. Component-Level Error Handling**

```typescript
// Still use Error Boundaries for specific components
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<CustomErrorFallback />}>
      <ComplexComponent />
    </ErrorBoundary>
  );
}
```

### **3. Programmatic Error Handling**

```typescript
// Use hooks for programmatic error handling
import { useNextErrorHandler } from '@/components/ErrorBoundary';

function DataComponent() {
  const { handleAsyncError } = useNextErrorHandler();

  const loadData = () => {
    handleAsyncError(
      () => fetchData(),
      {
        onSuccess: (data) => setData(data),
        onError: (error) => setError(error),
        showToast: true,
      }
    );
  };

  return <button onClick={loadData}>Load Data</button>;
}
```

## 🚀 **Benefits of Next.js Error Handling**

### **1. Automatic Error Catching**

- No need to wrap every component
- Framework handles errors automatically
- Better error recovery with `reset()`

### **2. Server-Side Error Handling**

- Handles errors during SSR
- Proper error pages with HTML structure
- Better SEO and user experience

### **3. Route-Level Granularity**

- Different error pages for different routes
- Context-aware error handling
- Better user experience

### **4. Built-in Loading States**

- Automatic loading UI
- Works with Suspense boundaries
- Better perceived performance

### **5. Better Error Recovery**

- `reset()` function to retry operations
- Automatic error boundary recovery
- Better user experience

## 📊 **Comparison**

| Feature            | React Error Boundaries | Next.js Error Handling |
| ------------------ | ---------------------- | ---------------------- |
| **Setup**          | Manual wrapping        | Automatic              |
| **Server Errors**  | ❌ No                  | ✅ Yes                 |
| **Route Errors**   | ❌ No                  | ✅ Yes                 |
| **Error Recovery** | Limited                | ✅ Built-in `reset()`  |
| **Loading States** | Manual                 | ✅ Automatic           |
| **404 Handling**   | Manual                 | ✅ Automatic           |
| **Performance**    | Good                   | ✅ Better              |

## 🎯 **Best Practices**

### **1. Use Next.js Error Handling for:**

- Route-level errors
- Server-side errors
- 404 errors
- Loading states
- Global error handling

### **2. Use React Error Boundaries for:**

- Component-specific errors
- Third-party component errors
- Isolated error handling

### **3. Use Hooks for:**

- Programmatic error handling
- API error handling
- Form validation errors
- Async operation errors

## 🚀 **Migration from React Error Boundaries**

### **Before (React Error Boundaries):**

```typescript
// Manual wrapping everywhere
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### **After (Next.js Error Handling):**

```typescript
// Automatic error handling
// Just create error.tsx files in your routes
// src/app/error.tsx - handles all route errors
// src/app/global-error.tsx - handles all app errors
```

## 📈 **Performance Benefits**

- ✅ **Faster error recovery** with built-in `reset()`
- ✅ **Better caching** with Next.js error boundaries
- ✅ **Automatic loading states** reduce perceived loading time
- ✅ **Server-side error handling** improves SEO
- ✅ **Route-level granularity** provides better UX

Next.js error handling is **more efficient, easier to use, and provides better user experience** than traditional React Error Boundaries! 🚀

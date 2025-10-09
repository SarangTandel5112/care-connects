# Setup Configuration

This folder contains all the setup and configuration files for external services and integrations.

## 📁 **Structure**

```
src/setup/
├── axios.ts          # HTTP client configuration
├── index.ts          # Barrel exports
└── README.md         # This file
```

## 🔧 **Current Setup**

### **Axios Configuration (`axios.ts`)**

- HTTP client setup with interceptors
- Automatic token injection
- Error handling and token refresh
- Request/response logging (in development)

## 🚀 **Usage**

### **Import Axios**

```typescript
import { Axios } from '@/setup';

// Use in services
const response = await Axios.get('/api/users');
```

### **Future Setup Files**

As your application grows, you can add more setup files:

```typescript
// src/setup/database.ts
export const Database = new DatabaseClient({
  connectionString: process.env.DATABASE_URL,
});

// src/setup/redis.ts
export const Redis = new RedisClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// src/setup/email.ts
export const EmailService = new EmailClient({
  apiKey: process.env.EMAIL_API_KEY,
});

// src/setup/storage.ts
export const FileStorage = new StorageClient({
  bucket: process.env.STORAGE_BUCKET,
});
```

## 📝 **Best Practices**

### **1. Centralized Configuration**

- Keep all external service configurations in this folder
- Use environment variables for sensitive data
- Provide default configurations where possible

### **2. Error Handling**

- Implement proper error handling for all services
- Log errors appropriately
- Provide fallback mechanisms

### **3. Type Safety**

- Use TypeScript for all setup files
- Define proper interfaces for configurations
- Export types for use in other parts of the app

### **4. Testing**

- Mock setup services in tests
- Provide test configurations
- Use dependency injection for better testability

## 🔄 **Migration from Old Structure**

If you're migrating from the old `src/axios/` structure:

### **Old Import:**

```typescript
import Axios from '@/axios/axios';
```

### **New Import:**

```typescript
import { Axios } from '@/setup';
```

### **Update All Files:**

1. Search for `@/axios/axios` imports
2. Replace with `@/setup` imports
3. Update TypeScript paths in `tsconfig.json`
4. Remove old axios folder

## 🎯 **Benefits**

- **Better Organization**: All setup code in one place
- **Easier Maintenance**: Centralized configuration management
- **Scalability**: Easy to add new services
- **Consistency**: Uniform setup patterns across services
- **Type Safety**: Better TypeScript support

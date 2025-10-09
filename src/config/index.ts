// Export environment configuration with validation
export { env as config, isEnvValid } from './env';

// Legacy export for backward compatibility
export const legacyConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Care Connects',
} as const;

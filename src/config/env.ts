/**
 * Environment Configuration & Validation
 * Validates all required environment variables on app startup
 */

interface EnvConfig {
  apiBaseUrl: string;
  appName: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  nodeEnv: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// Validate required environment variables
function validateEnv(): EnvConfig {
  const requiredServerVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const requiredClientVars = ['NEXT_PUBLIC_API_BASE_URL', 'NEXT_PUBLIC_APP_NAME'];

  // Check server-side variables (only in Node environment)
  if (typeof window === 'undefined') {
    const missingServerVars = requiredServerVars.filter((key) => !process.env[key]);

    if (missingServerVars.length > 0) {
      console.error(`❌ Missing required environment variables: ${missingServerVars.join(', ')}`);
      console.error('Please create a .env.local file based on env.example');

      // In production, throw error. In development, use defaults
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Missing required environment variables: ${missingServerVars.join(', ')}`);
      }
    }
  }

  // Check client-side variables
  const missingClientVars = requiredClientVars.filter((key) => !process.env[key]);

  if (missingClientVars.length > 0) {
    console.warn(`⚠️ Missing public environment variables: ${missingClientVars.join(', ')}`);
  }

  const nodeEnv = (process.env.NODE_ENV || 'development') as EnvConfig['nodeEnv'];

  return {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Care Connects',
    jwtSecret: process.env.JWT_SECRET || 'development-jwt-secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'development-refresh-secret',
    nodeEnv,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
  };
}

// Export validated config
export const env = validateEnv();

// Helper function to check if all required env vars are set
export const isEnvValid = (): boolean => {
  try {
    validateEnv();
    return true;
  } catch {
    return false;
  }
};

// Log config in development
if (env.isDevelopment && typeof window === 'undefined') {
  console.log('🔧 Environment Configuration:');
  console.log('- API Base URL:', env.apiBaseUrl);
  console.log('- App Name:', env.appName);
  console.log('- Environment:', env.nodeEnv);
  console.log('- JWT Secret:', env.jwtSecret ? '✓ Set' : '✗ Missing');
  console.log('- JWT Refresh Secret:', env.jwtRefreshSecret ? '✓ Set' : '✗ Missing');
}

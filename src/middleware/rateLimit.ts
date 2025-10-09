/**
 * API Rate Limiting Middleware
 * Implements token bucket algorithm for rate limiting
 */

interface RateLimitStore {
  [key: string]: {
    tokens: number;
    lastRefill: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitConfig {
  maxRequests: number; // Maximum number of requests
  windowMs: number; // Time window in milliseconds
}

/**
 * Rate limiter using token bucket algorithm
 */
export function rateLimit(config: RateLimitConfig) {
  const { maxRequests, windowMs } = config;

  return function checkRateLimit(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const refillRate = maxRequests / windowMs;

    if (!store[identifier]) {
      store[identifier] = {
        tokens: maxRequests,
        lastRefill: now,
      };
    }

    const bucket = store[identifier];
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = timePassed * refillRate;

    bucket.tokens = Math.min(maxRequests, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        resetTime: now + windowMs,
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetTime: now + windowMs,
    };
  };
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

/**
 * Default rate limit configurations
 */
export const rateLimitConfigs = {
  // Strict limit for auth endpoints
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Standard limit for API endpoints
  api: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Lenient limit for general requests
  general: {
    maxRequests: 200,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

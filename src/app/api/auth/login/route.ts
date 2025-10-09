// Example Next.js API Routes for authentication
// File: src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp, rateLimitConfigs } from '@/middleware/rateLimit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Initialize rate limiter for login endpoint
const loginRateLimiter = rateLimit(rateLimitConfigs.auth);

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = loginRateLimiter(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many login attempts. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitConfigs.auth.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // TODO: Implement your authentication logic here
    // This is just an example

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      {
        status: 401,
        headers: {
          'X-RateLimit-Limit': rateLimitConfigs.auth.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

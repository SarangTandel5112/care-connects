// Example Next.js API Route for getting current user
// File: src/app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // TODO: Fetch user from database using decoded.userId
      const user = {
        id: decoded.userId,
        email: decoded.email,
        name: 'Admin User',
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: user,
      });
    } catch (jwtError) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

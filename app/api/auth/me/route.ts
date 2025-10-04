import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from 'app/lib/jwt';
import { usersDB } from 'app/lib/supabase';
import { logError, logInfo } from 'app/lib/utils/logger';
import { ApiResponse, AuthResponse, AuthUser } from 'app/types/database.types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    logInfo('Handling /api/auth/me GET request', { path: request.nextUrl.pathname });

    // Verify JWT using cookies
    const payload = verifyJwt(request);
    if ('error' in payload) {
      logInfo('JWT verification failed in /api/auth/me', { error: payload.error, code: payload.code });
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Invalid or expired session' },
        },
        { status: 401 }
      );
    }

    // Fetch user by ID
    const user = await usersDB.getById(payload.sub);
    if (!user) {
      logInfo('User not found in /api/auth/me', { userId: payload.sub });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Create safe user data
    const safeUserData: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    logInfo('User session fetched in /api/auth/me', { userId: user.id, role: user.role });
    return NextResponse.json<ApiResponse<AuthResponse>>(
      { success: true, data: { user: safeUserData } },
      { status: 200 }
    );
  } catch (error) {
    logError('Unexpected error in /api/auth/me', { error });
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse> {
  logInfo('Invalid POST request to /api/auth/me');
  return NextResponse.json<ApiResponse>(
    { success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } },
    { status: 405 }
  );
}
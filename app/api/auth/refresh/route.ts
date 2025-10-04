import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signJwt, signRefreshToken } from 'app/lib/jwt';
import { setAuthCookies } from 'app/lib/cookies';
import { usersDB } from 'app/lib/supabase';
import { logError, logInfo } from 'app/lib/utils/logger';
import { ApiResponse, AuthResponse, AuthUser } from 'app/types/database.types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    logInfo('Handling /api/auth/refresh POST request', { path: request.nextUrl.pathname });

    // Verify refresh token
    const refreshPayload = verifyRefreshToken(request);
    if ('error' in refreshPayload) {
      logInfo('Refresh token verification failed', { error: refreshPayload.error, code: refreshPayload.code });
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Invalid or expired refresh token' },
        },
        { status: 401 }
      );
    }

    // Verify session
    const session = await usersDB.validateRefreshToken(refreshPayload.refresh_id);
    if (!session) {
      logInfo('Session not found for refresh token', { refreshId: refreshPayload.refresh_id });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid session' } },
        { status: 401 }
      );
    }

    // Fetch user
    const user = await usersDB.getById(session.user_id);
    if (!user) {
      logInfo('User not found during refresh', { userId: session.user_id });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Generate new access and refresh tokens
    const accessTokenResult = signJwt({ sub: user.id, email: user.email, role: user.role });

    if (typeof accessTokenResult !== 'string') {
      logError('Failed to generate access token during refresh', { userId: user.id, email: user.email, error: accessTokenResult });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'JWT_ERROR', message: accessTokenResult.error } },
        { status: 500 }
      );
    }

    const refreshTokenResult = await signRefreshToken({ sub: user.id, email: user.email, role: user.role });

    if (typeof refreshTokenResult !== 'string') {
      logError('Failed to generate refresh token during refresh', { userId: user.id, email: user.email, error: refreshTokenResult });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'JWT_ERROR', message: refreshTokenResult.error } },
        { status: 500 }
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

    // Create response
    let response = NextResponse.json<ApiResponse<AuthResponse>>(
      { success: true, data: { user: safeUserData } },
      { status: 200 }
    );

    // Set new auth cookies
    response = setAuthCookies(response, accessTokenResult, refreshTokenResult) as NextResponse<ApiResponse<AuthResponse>>;

    logInfo('Token refresh successful', { userId: user.id, email: user.email });
    return response;
  } catch (error) {
    logError('Unexpected error during token refresh', { error });
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  logInfo('Invalid GET request to /api/auth/refresh');
  return NextResponse.json<ApiResponse>(
    { success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } },
    { status: 405 }
  );
}
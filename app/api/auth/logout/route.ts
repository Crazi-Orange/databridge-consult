import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies, getAuthCookies } from 'app/lib/cookies';
import { blacklistToken } from 'app/lib/jwt';
import { usersDB } from 'app/lib/supabase';
import { logError, logInfo } from 'app/lib/utils/logger';
import { ApiResponse } from 'app/types/database.types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    logInfo('Handling /api/auth/logout POST request', { path: request.nextUrl.pathname });

    // Get tokens from cookies
    const { authToken, refreshToken } = getAuthCookies(request);

    // Create response
    let response = NextResponse.json<ApiResponse<{ message: string }>>(
      { success: true, data: { message: 'Logged out successfully' } },
      { status: 200 }
    );

    // Clear auth cookies (NextResponse)
    response = clearAuthCookies(response) as NextResponse<ApiResponse<{ message: string }>>;

    // Blacklist tokens and revoke session if present
    if (authToken) {
      const blacklistResult = blacklistToken(authToken, response);
      if (typeof blacklistResult !== 'boolean') {
        logError('Failed to blacklist access token during logout', { error: blacklistResult });
      }
    }

    if (refreshToken) {
      const blacklistResult = blacklistToken(refreshToken, response);
      if (typeof blacklistResult !== 'boolean') {
        logError('Failed to blacklist refresh token during logout', { error: blacklistResult });
      }
      await usersDB.revokeSession(refreshToken);
    }

    logInfo('Logout successful', { hasAuthToken: !!authToken, hasRefreshToken: !!refreshToken });
    return response;
  } catch (error) {
    logError('Unexpected error during logout', { error });
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  logInfo('Invalid GET request to /api/auth/logout');
  return NextResponse.json<ApiResponse>(
    { success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } },
    { status: 405 }
  );
}
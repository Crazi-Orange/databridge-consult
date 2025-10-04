import { NextRequest, NextResponse } from 'next/server';
import { usersDB } from 'app/lib/supabase';
import { checkBruteForce, handleFailedLogin, handleSuccessfulLogin } from 'app/lib/brute-force';
import { verifyPassword } from 'app/lib/password';
import { signJwt, signRefreshToken } from 'app/lib/jwt';
import { setAuthCookies } from 'app/lib/cookies';
import { logError, logInfo } from 'app/lib/utils/logger';
import { ApiResponse, AuthResponse, AuthUser } from 'app/types/database.types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await request.json();
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!email || !password) {
      logInfo('Invalid login attempt: missing email or password', { email });
      await handleFailedLogin('', email, ip, userAgent);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Email and password are required' },
        },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await usersDB.getByEmail(email);
    if (!user) {
      logInfo('Login attempt failed: user not found', { email });
      await handleFailedLogin('', email, ip, userAgent);
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' } },
        { status: 401 }
      );
    }

    // Brute force protection
    const bruteForceCheck = await checkBruteForce(user);
    if (!bruteForceCheck.allowed) {
      await handleFailedLogin('', email, ip, userAgent);
      logInfo('Login blocked by brute force protection', { userId: user.id, email });
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: { code: 'TOO_MANY_ATTEMPTS', message: bruteForceCheck.message || 'Too many login attempts' },
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      await handleFailedLogin('', email, ip, userAgent);
      logInfo('Login failed: invalid password', { userId: user.id, email });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' } },
        { status: 401 }
      );
    }

    // Handle successful login
    await handleSuccessfulLogin(user.id, email, ip, userAgent);

    // Generate tokens
    const accessToken = signJwt({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = await signRefreshToken({ sub: user.id, email: user.email, role: user.role });

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      logError('Token generation failed', { userId: user.id, email });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'JWT_ERROR', message: 'Failed to generate tokens' } },
        { status: 500 }
      );
    }

    // Prepare user data
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

    // Set cookies and return updated response
    response = setAuthCookies(response, accessToken, refreshToken) as NextResponse<ApiResponse<AuthResponse>>;

    logInfo('Login successful', { userId: user.id, email, role: user.role });
    return response;
  } catch (error) {
    logError('Unexpected error during login', { error });
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  logInfo('Invalid GET request to /api/auth/login');
  return NextResponse.json<ApiResponse>(
    { success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } },
    { status: 405 }
  );
}

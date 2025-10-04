import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from 'app/lib/password';
import { usersDB } from 'app/lib/supabase';
import { signJwt, signRefreshToken } from 'app/lib/jwt';
import { setAuthCookies } from 'app/lib/cookies';
import { logError, logInfo } from 'app/lib/utils/logger';
import { ApiResponse, AuthResponse, AuthUser, Role, UserStatus } from 'app/types/database.types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { name, email, password } = await request.json();

    // Input validation
    if (!email || !password || !name) {
      logInfo('Invalid signup attempt: missing required fields', { email });
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Name, email, and password are required' },
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await usersDB.getByEmail(email);
    if (existingUser) {
      logInfo('Signup attempt failed: user already exists', { email });
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: { code: 'USER_EXISTS', message: 'User with this email already exists' },
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await usersDB.create({
      email,
      password_hash: hashedPassword,
      profile_data: { name },
      role: Role.User,
      status: UserStatus.Active,
    });

    if (!newUser) {
      logError('Failed to create user during signup', { email });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create user' } },
        { status: 500 }
      );
    }

    // Create JWT and refresh token
    const accessTokenResult = signJwt({ sub: newUser.id, email: newUser.email, role: newUser.role });

    if (typeof accessTokenResult !== 'string') {
      logError('Failed to generate access token during signup', { email, error: accessTokenResult });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'JWT_ERROR', message: accessTokenResult.error } },
        { status: 500 }
      );
    }

    const refreshTokenResult = await signRefreshToken({ sub: newUser.id, email: newUser.email, role: newUser.role });

    if (typeof refreshTokenResult !== 'string') {
      logError('Failed to generate refresh token during signup', { email, error: refreshTokenResult });
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'JWT_ERROR', message: refreshTokenResult.error } },
        { status: 500 }
      );
    }

    // Create safe user data
    const safeUserData: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    };

    // Create response
    let response = NextResponse.json<ApiResponse<AuthResponse>>(
      { success: true, data: { user: safeUserData } },
      { status: 201 }
    );

    // Set auth cookies (NextResponse)
  response = setAuthCookies(response, accessTokenResult, refreshTokenResult) as NextResponse<ApiResponse<AuthResponse>>;

    logInfo('User signed up successfully', { email, userId: newUser.id });
    return response;
  } catch (error) {
    logError('Unexpected error during signup', { error });
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  logInfo('Invalid GET request to /api/auth/signup');
  return NextResponse.json<ApiResponse>(
    { success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } },
    { status: 405 }
  );
}
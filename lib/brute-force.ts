import { usersDB } from './supabase';
import { MAX_ATTEMPTS, LOCKOUT_DURATION_MS } from './config/auth.config';
import { logError, logInfo } from './utils/logger';
import { User } from 'app/types/database.types';

export interface BruteForceCheck {
  allowed: boolean;
  message?: string;
  remainingTime?: number;
}

/**
 * Check if a user is allowed to attempt login
 */
export async function checkBruteForce(user: Pick<User, 'id' | 'status' | 'failed_login_attempts' | 'last_failed_login'>): Promise<BruteForceCheck> {
  // Check if account is suspended
  if (user.status === 'suspended') {
    logInfo('Login attempt blocked: account suspended', { userId: user.id });
    return { allowed: false, message: 'Account suspended. Please contact support.' };
  }

  // Check if account is locked due to too many failed attempts
  const failedAttempts = user.failed_login_attempts || 0;
  if (failedAttempts >= MAX_ATTEMPTS && user.last_failed_login) {
    const lastFailedLogin = new Date(user.last_failed_login).getTime();
    const lockoutExpiry = lastFailedLogin + LOCKOUT_DURATION_MS;
    const now = Date.now();

    if (now < lockoutExpiry) {
      const remainingSeconds = Math.ceil((lockoutExpiry - now) / 1000);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      logInfo('Login attempt blocked: account locked', { userId: user.id, remainingSeconds });
      return {
        allowed: false,
        message: `Account temporarily locked. Try again in ${minutes}m ${seconds}s.`,
        remainingTime: remainingSeconds,
      };
    }

    // Lockout period has expired, reset attempts
    try {
      await usersDB.resetFailedLogin(user.id);
      logInfo('Lockout expired, reset failed login attempts', { userId: user.id });
    } catch (error) {
      logError('Failed to reset expired lockout', { userId: user.id, error });
    }
  }

  logInfo('Login attempt allowed', { userId: user.id });
  return { allowed: true };
}

/**
 * Handle failed login attempt
 */
export async function handleFailedLogin(
  userId: string,
  email: string,
  ip: string,
  userAgent: string
): Promise<void> {
  try {
    await Promise.all([
      usersDB.incrementFailedLogin(userId),
      usersDB.logLoginAttempt(userId, email, ip, userAgent, false),
    ]);
    logInfo('Handled failed login attempt', { userId, email, ip });
  } catch (error) {
    logError('Failed to handle failed login attempt', { userId, email, ip, error });
  }
}

/**
 * Handle successful login
 */
export async function handleSuccessfulLogin(
  userId: string,
  email: string,
  ip: string,
  userAgent: string
): Promise<void> {
  try {
    await Promise.all([
      usersDB.resetFailedLogin(userId),
      usersDB.logLoginAttempt(userId, email, ip, userAgent, true),
    ]);
    logInfo('Handled successful login', { userId, email, ip });
  } catch (error) {
    logError('Failed to handle successful login', { userId, email, ip, error });
  }
}
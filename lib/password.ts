import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './config/auth.config';
import { logError } from './utils/logger';

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logError('Failed to hash password', { error });
    throw new Error('Failed to hash password');
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logError('Failed to verify password', { error });
    throw new Error('Failed to verify password');
  }
}
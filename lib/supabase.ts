import { createClient } from '@supabase/supabase-js';
import { User, AuthUser, Role, UserStatus, Session } from 'app/types/database.types';
import { logError, logInfo } from './utils/logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const usersDB = {
  async getByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, status, created_at, updated_at, password_hash')
        .eq('email', email)
        .single();

      if (error || !data) {
        logError('Failed to fetch user by email', { email, error });
        return null;
      }

      logInfo('User fetched by email', { email });
  return data as User;
    } catch (error) {
      logError('Unexpected error fetching user by email', { email, error });
      return null;
    }
  },

  async getById(id: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, status, created_at, updated_at')
        .eq('id', id)
        .single();

      if (error || !data) {
        logError('Failed to fetch user by ID', { id, error });
        return null;
      }

      logInfo('User fetched by ID', { id });
      return data as AuthUser;
    } catch (error) {
      logError('Unexpected error fetching user by ID', { id, error });
      return null;
    }
  },

  async create(userData: {
    email: string;
    password_hash: string;
    profile_data?: Record<string, unknown>;
    role?: Role;
    status?: UserStatus;
  }): Promise<AuthUser | null> {
    try {
      const now = new Date().toISOString();
      const userInsert: Omit<User, 'id' | 'last_failed_login' | 'failed_login_attempts'> = {
        email: userData.email,
        password_hash: userData.password_hash,
        role: userData.role ?? Role.User,
        status: userData.status ?? UserStatus.Active,
        profile_data: userData.profile_data ?? {},
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userInsert])
        .select('id, email, role, status, created_at, updated_at')
        .single();

      if (error) {
        logError('Failed to create user', { email: userData.email, error });
        return null;
      }

      logInfo('User created', { email: userData.email, id: data.id });
      return data as AuthUser;
    } catch (error) {
      logError('Unexpected error creating user', { email: userData.email, error });
      return null;
    }
  },

  async createSession(sessionData: {
    user_id: string;
    refresh_token: string;
    expires_at: string;
  }): Promise<Session | null> {
    try {
      const now = new Date().toISOString();
      const sessionInsert: Omit<Session, 'id' | 'created_at'> = {
        user_id: sessionData.user_id,
        refresh_token: sessionData.refresh_token,
        expires_at: sessionData.expires_at,
      };

      const { data, error } = await supabase
        .from('sessions')
        .insert([{ ...sessionInsert, created_at: now }])
        .select()
        .single();

      if (error) {
        logError('Failed to create session', { userId: sessionData.user_id, error });
        return null;
      }

      logInfo('Session created', { userId: sessionData.user_id, sessionId: data.id });
      return data as Session;
    } catch (error) {
      logError('Unexpected error creating session', { userId: sessionData.user_id, error });
      return null;
    }
  },

  async validateRefreshToken(refreshToken: string): Promise<Session | null> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('refresh_token', refreshToken)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        logError('Failed to validate refresh token', { refreshToken, error });
        return null;
      }

      logInfo('Refresh token validated', { sessionId: data.id });
      return data as Session;
    } catch (error) {
      logError('Unexpected error validating refresh token', { refreshToken, error });
      return null;
    }
  },

  async revokeSession(refreshToken: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('refresh_token', refreshToken);

      if (error) {
        logError('Failed to revoke session', { refreshToken, error });
        return;
      }

      logInfo('Session revoked', { refreshToken });
    } catch (error) {
      logError('Unexpected error revoking session', { refreshToken, error });
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .rpc('update_user', { p_user_id: id, p_updates: updates })
        .select('id, email, role, status, created_at, updated_at')
        .single();

      if (error) {
        logError('Failed to update user', { id, error });
        return null;
      }

      logInfo('User updated', { id });
      return data as AuthUser;
    } catch (error) {
      logError('Unexpected error updating user', { id, error });
      return null;
    }
  },

  async incrementFailedLogin(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_failed_logins', { p_user_id: userId });
      if (error) {
        logError('Failed to increment failed login attempts', { userId, error });
        return;
      }
      logInfo('Incremented failed login attempts', { userId });
    } catch (error) {
      logError('Unexpected error incrementing failed login attempts', { userId, error });
    }
  },

  async resetFailedLogin(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('reset_failed_logins', { p_user_id: userId });
      if (error) {
        logError('Failed to reset failed login attempts', { userId, error });
        return;
      }
      logInfo('Reset failed login attempts', { userId });
    } catch (error) {
      logError('Unexpected error resetting failed login attempts', { userId, error });
    }
  },

  async logLoginAttempt(
    userId: string,
    email: string,
    ip: string,
    userAgent: string,
    successful: boolean
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('log_login_attempt', {
        p_user_id: userId,
        p_email: email,
        p_ip_address: ip,
        p_user_agent: userAgent,
        p_successful: successful,
      });

      if (error) {
        logError('Failed to log login attempt', { userId, email, ip, successful, error });
        return;
      }
      logInfo('Logged login attempt', { userId, email, ip, successful });
    } catch (error) {
      logError('Unexpected error logging login attempt', { userId, email, ip, successful, error });
    }
  },
};
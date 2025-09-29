import { cookies } from 'next/headers';
import { verifyJwt } from './auth';
import { supabaseAdmin } from './supabaseAdmin';

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  const decoded = verifyJwt(token);
  if (!decoded) return null;

  const { data } = await supabaseAdmin.from('users').select('*').eq('id', decoded.id).single();
  return data;
}
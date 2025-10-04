export const ROLE_TO_PATH: Record<string, string> = {
  superadmin: 'superadmin',
  admin: 'admin',
  user: 'user',
};

export function dashboardPathForRole(role?: string): string {
  if (!role) return ROLE_TO_PATH.user;
  return ROLE_TO_PATH[role] ?? ROLE_TO_PATH.user;
}

export default dashboardPathForRole;

// app/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { verifyJwt } from 'app/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const navItems = {
  user: [
    { href: '/dashboard/user/services', label: 'Services' },
    { href: '/dashboard/user/orders', label: 'Orders' },
    { href: '/dashboard/user/messages', label: 'Messages' },
    { href: '/dashboard/user/profile', label: 'Profile' },
  ],
  admin: [
    { href: '/dashboard/admin/services', label: 'Services' },
    { href: '/dashboard/admin/quotes', label: 'Quotes' },
    { href: '/dashboard/admin/orders', label: 'Orders' },
    { href: '/dashboard/admin/profile', label: 'Profile' },
  ],
  superadmin: [
    { href: '/dashboard/superadmin/tools', label: 'Tools' },
    { href: '/dashboard/superadmin/users', label: 'Users' },
  ],
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    console.error('No auth_token cookie found in dashboard layout', {
      cookies: Object.fromEntries(cookieStore),
      path: process.env.NEXT_PUBLIC_APP_URL,
    });
    redirect('/auth/login?error=no_token');
  }

  const payload = verifyJwt(token.value);
  if (!payload) {
    console.error('Token verification failed:', { token: token.value });
    redirect('/auth/login?error=invalid_token');
  }

  console.log('Dashboard access granted:', { userId: payload.id, role: payload.role });

  const roleNavItems = (() => {
    switch (payload.role) {
      case 'superadmin':
        return [...navItems.superadmin, ...navItems.admin];
      case 'admin':
        return navItems.admin;
      default:
        return navItems.user;
    }
  })();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Dashboard</h1>
              </div>
              <div className="hidden sm:flex sm:space-x-8">
                {roleNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
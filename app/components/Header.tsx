'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      console.log('Header: Fetching user session from /api/auth/me');
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Header: User session fetched:', data.user);
        setUser(data.user);
      } else {
        console.log('Header: No valid session found');
        setUser(null);
      }
    } catch (error) {
      console.error('Header: Error fetching user session:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    console.log('Initiating logout');
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="font-bold text-lg">DataBridge Consult</span>
        </Link>
        <nav className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
          {user ? (
            <>
              <Link href={`/dashboard/${user.role}`}>Dashboard</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link
                href="/auth/signup"
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
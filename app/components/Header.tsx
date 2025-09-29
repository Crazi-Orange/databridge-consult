'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { verifyJwt } from "app/lib/auth";
import { useRouter } from "next/navigation";


export default function Header() {
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='));
    if (token) {
      const decoded = verifyJwt(token);
      setUser(decoded);
    }
  },[])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/"><span className="font-bold text-lg">DataBridge Consult</span></Link>
        <nav className="space-x-4">
          <Link href="/">Home</Link>
          <Link href = '/about'>About</Link>
          <Link href="/services">Services</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
          {user ? (
            <>
              <li>
                <Link href={`/dashboard/${user.role}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/signup" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

'use client';

import { useState } from 'react';
import { signup } from 'app/lib/api';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password);
      router.push('/dashboard/user');
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <h1 className="text-xl font-bold">Sign Up</h1>
      {error && <div className="mt-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <input className="block mt-3 p-2 border" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input className="block mt-3 p-2 border" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="block mt-3 p-2 border" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded" type="submit">Sign Up</button>
    </form>
  );
}
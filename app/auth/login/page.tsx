"use client";
import { useState } from "react";
import { login } from "app/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { user } = await login(email, password);
      // Redirect based on user role
      switch (user.role) {
        case 'superadmin':
          router.push('/dashboard/superadmin');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/dashboard/user');
          break;
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <h1 className="text-xl font-bold">Login</h1>
      {error && <div className="mt-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <input className="block mt-3 p-2 border" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="block mt-3 p-2 border" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Login</button>
    </form>
  );
};

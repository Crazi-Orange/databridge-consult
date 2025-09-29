'use client';

import { useState, useEffect } from 'react';
import { fetchUsers, createUser } from "app/lib/api";
import { User } from 'app/types/database.types';

export default function SuperadminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin' | 'superadmin'>('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const newUser = await createUser({ name, email, password_hash: 'hashed-in-api', role });
      setUsers([...users, newUser]);
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setSuccess('User created successfully!');
    } catch (error) {
      setError('Failed to create user. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Users</h1>
      </div>
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="p-4 bg-green-100 text-green-700 rounded">{success}</div>}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full name"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value as 'user' | 'admin' | 'superadmin')}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add User
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Users List</h2>
        <div className="divide-y">
          {users.map((user) => (
            <div key={user.id} className="py-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${
                user.role === 'superadmin' ? 'bg-red-100 text-red-800' :
                user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
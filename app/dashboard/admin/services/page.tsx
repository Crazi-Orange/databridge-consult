'use client';

import { useState, useEffect } from 'react';
import { Service } from 'app/types/database.types';
import ServiceCard from '../../../components/ServiceCard';
import { fetchServices, createService } from '../../../../lib/api';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [isFree, setIsFree] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => setError('Failed to load services'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const newService = await createService({ title, description, price, is_free: isFree });
      setServices([...services, newService]);
      setTitle('');
      setDescription('');
      setPrice(0);
      setIsFree(false);
      setSuccess('Service created successfully!');
    } catch (error) {
      setError('Failed to create service. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Services</h1>
      </div>
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="p-4 bg-green-100 text-green-700 rounded">{success}</div>}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Service title"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Service description"
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                placeholder="0"
                className="w-full p-2 border rounded"
                disabled={isFree}
                min="0"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={e => setIsFree(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Free Service</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Service
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} s={service} />
        ))}
      </div>
    </div>
  );
}
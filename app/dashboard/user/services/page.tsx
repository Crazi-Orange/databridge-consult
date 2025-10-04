'use client';

import { useState } from 'react';
import { fetchServices, createResearchRequest } from "app/lib/api";
import { Service } from "app/types/database.types";
import ServiceCard from "../../../components/ServiceCard";
import { useEffect } from 'react';
import { supabaseClient } from "app/lib/supabaseClient";
import { verifyJwt } from 'app/lib/jwt';

export default function UserServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [details, setDetails] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    
    setError('');
    setSuccess('');

    let fileUrl = null;
    if (file) {
      const filePath = `requests/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabaseClient.storage.from('files').upload(filePath, file);
      if (uploadError) {
        setError('File upload failed. Please try again.');
        return;
      }
      const { data } = supabaseClient.storage.from('files').getPublicUrl(filePath);
      fileUrl = data.publicUrl;
    }

    try {
       const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (!token) {
          throw new Error('No authentication token found');
        }

        const decoded = verifyJwt(token);
        if (!decoded || !decoded.id) {
          throw new Error('Invalid authentication token');
        }
      await createResearchRequest({
        service_id: selectedService.id,
        user_id: decoded.id,
        details,
        deadline,
        file_url: fileUrl,
        status: 'pending',
      });
      setDetails('');
      setDeadline('');
      setFile(null);
      setSelectedService(null);
      setSuccess('Request submitted successfully!');
    } catch (error) {
      setError('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Available Services</h1>
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="p-4 bg-green-100 text-green-700 rounded">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="relative">
            <ServiceCard s={service} showLink={false} />
            <button
              onClick={() => setSelectedService(service)}
              className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Request
            </button>
          </div>
        ))}
      </div>
      {selectedService && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Request Service: {selectedService.title}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe your requirements"
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
              <input
                type="file"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { fetchResearchRequests, updateResearchRequest } from 'app/lib/api';
import { ResearchRequest } from 'app/types/database.types';

export default function AdminQuotes() {
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchResearchRequests();
        setRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load requests');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ResearchRequest['status']) => {
    try {
      const updatedRequest = await updateResearchRequest(id, { status: newStatus });
      setRequests(requests.map(req => req.id === id ? updatedRequest : req));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request status');
    }
  };

  const getStatusColor = (status: ResearchRequest['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Research Requests</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No research requests found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {requests.map((req) => (
              <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                        {req.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">ID: {req.id}</span>
                    </div>
                    <p className="text-gray-800">{req.details}</p>
                    <div className="text-sm text-gray-600">
                      User ID: {req.user_id} • Service ID: {req.service_id}
                    </div>
                    <div className="text-sm text-gray-600">
                      Deadline: {new Date(req.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end md:self-auto">
                    {req.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'in_progress')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Start
                      </button>
                    )}
                    {req.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'completed')}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Complete
                      </button>
                    )}
                    {(req.status === 'pending' || req.status === 'in_progress') && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'cancelled')}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
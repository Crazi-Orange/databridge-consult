'use client';

import { useState, useEffect } from 'react';
import { fetchOrders, updateOrder } from 'app/lib/api';
import { Order } from 'app/types/database.types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Order['status']) => {
    try {
      const updatedOrder = await updateOrder(id, { status: newStatus });
      setOrders(orders.map(order => order.id === id ? updatedOrder : order));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return (
          <button
            onClick={() => handleUpdateStatus(order.id, 'paid')}
            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Mark Paid
          </button>
        );
      case 'paid':
        return (
          <button
            onClick={() => handleUpdateStatus(order.id, 'shipped')}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Mark Shipped
          </button>
        );
      case 'shipped':
        return (
          <button
            onClick={() => handleUpdateStatus(order.id, 'completed')}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Complete
          </button>
        );
      default:
        return null;
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
        <h1 className="text-2xl font-bold">Manage Orders</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">Order ID: {order.id}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      User ID: {order.user_id} • Product ID: {order.product_id}
                    </div>
                    <div className="font-medium">
                      Total Amount: ${order.total_amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Ordered: {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end md:self-auto">
                    {getStatusActions(order)}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
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
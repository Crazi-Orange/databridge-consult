'use client';

import { useState, useEffect } from 'react';
import { fetchProducts, createOrder } from 'app/lib/api';
import { useRouter } from 'next/navigation';
import { Product } from 'app/types/database.types';
import Image from 'next/image';

interface CartItem {
  id: string;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    fetchProducts().then(setProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleCheckout = async () => {
    setError('');
    try {
      for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          await createOrder({
            product_id: item.id,
            total_amount: product.price * item.quantity,
            status: 'pending',
          });
        }
      }
      setCart([]);
      localStorage.removeItem('cart');
      router.push('/dashboard/user/orders');
    } catch (error) {
      setError('Checkout failed. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
      </div>
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => {
                  const product = products.find(p => p.id === item.id);
                  if (!product) return null;
                  return (
                    <div key={item.id} className="flex justify-between items-center p-4 border rounded">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">${(product.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded-lg">
              {product.image_url && (
                <div className="relative w-full h-48 mb-4">
                  <Image 
                    src={product.image_url} 
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';
import { Product } from 'app/types/database.types';
import { fetchProducts } from "app/lib/api";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from 'react';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        console.error('Failed to load products:', err);
      }
    };
    loadProducts();
  }, []);

  if (error) {
    return <div>Error loading products: {error}</div>;
  }
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} p={product} />
        ))}
      </div>
    </div>
  );
}





import { fetchProducts } from "app/lib/api";
import ProductCard from "../components/ProductCard";

export default async function ShopPage() {
  const products = await fetchProducts();
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

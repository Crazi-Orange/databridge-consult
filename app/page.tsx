import Link from "next/link";
//import {fetchServices } from "../lib/api";
//import { fetchProducts } from "../lib/api";

export default function HomePage() {
  //const services = fetchServices(); 
  //const products = fetchProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to DataBridge Consult</h1>
      <p className="mt-3">Paid services, free tips and a small shop — built with Next.js + Supabase.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Services</h2>
          <p className="text-sm mt-2">Research writing, reviews, assignments and more.</p>
          <Link href="/services" className="text-blue-600 mt-3 block">Browse services</Link>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Shop</h2>
          <p className="text-sm mt-2">Laptops and accessories.</p>
          <Link href="/shop" className="text-blue-600 mt-3 block">Browse shop</Link>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Blog</h2>
          <p className="text-sm mt-2">Free IT & research tips (read-only).</p>
          <Link href="/blog" className="text-blue-600 mt-3 block">Read blog</Link>
        </div>
      </div>
    </div>
  );
}

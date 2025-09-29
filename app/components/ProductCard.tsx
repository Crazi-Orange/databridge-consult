import { Product } from "app/types/database.types";
import Link from "next/link";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="border p-4 rounded">
      <h3 className="font-semibold">{p.name}</h3>
      <p className="text-sm mt-2">{p.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm">${p.price}</span>
        <Link href={`/shop/${p.id}`} className="text-blue-600">View</Link>
      </div>
    </article>
  );
}

import { Service } from "app/types/database.types";
import Link from "next/link";

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="border p-4 rounded">
      <h3 className="font-semibold">{s.title}</h3>
      <p className="text-sm mt-2">{s.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm">{s.is_free ? "Free" : `\$${s.price}`}</span>
        <Link href={`/services/${s.id}`} className="text-blue-600">View</Link>
      </div>
    </article>
  );
}

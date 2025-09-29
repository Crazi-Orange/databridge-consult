import { Service } from "app/types/database.types";
import Link from "next/link";

interface ServiceCardProps {
  s: Service;
  showLink?: boolean;
  linkText?: string;
}

export default function ServiceCard({ s, showLink = true, linkText = "View" }: ServiceCardProps) {
  return (
    <article className="border p-4 rounded">
      <h3 className="font-semibold">{s.title}</h3>
      <p className="text-sm mt-2">{s.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm">{s.is_free ? "Free" : `$${s.price}`}</span>
        {showLink && (
          <Link href={`/services/${s.id}`} className="text-blue-600">{linkText}</Link>
        )}
      </div>
    </article>
  );
}

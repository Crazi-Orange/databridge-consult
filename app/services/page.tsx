import { fetchServices } from "../../lib/api";
import ServiceCard from "../components/ServiceCard";

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} s={service} />
        ))}
      </div>
    </div>
  );
}

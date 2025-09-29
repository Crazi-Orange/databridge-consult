'use client';
import { fetchServices } from "../../lib/api";
import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { Service } from 'app/types/database.types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        console.error('Failed to load services:', err);
      }
    };
    loadServices();
  }, []);

  if (error) {
    return <div>Error loading services: {error}</div>;
  }


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

import { fetchService } from "app/lib/api";

export default async function ServiceDetail({ params }: { params: { id: string } }) {
  const service = await fetchService(params.id);

  return (
    <div>
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <p>Price: {service.price}</p>
      <p>Free: {service.is_free ? 'Yes' : 'No'}</p>
    </div>
  );
}
import { notFound } from 'next/navigation';
import Image from 'next/image';
import StatusBadge from '../../components/StatusBadge';
import { fetchProduct } from 'app/lib/api';

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);

  if (!product) return notFound();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <Image src={product.image_url} alt={product.name} width={800} height={256} className="w-full h-64 object-cover rounded mb-2"/>
      <p className="mb-2">{product.description}</p>
      <p className="mb-2 font-bold">Price: GHC{product.price}</p>
      <p className="mb-2">Stock: {product.stock}</p>
      <StatusBadge status={product.stock > 0 ? 'completed' : 'pending'} />
    </div>
  );
}
